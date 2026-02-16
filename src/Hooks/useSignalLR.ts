// hooks/useSignalR.ts

import * as signalR from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConnectionStatus } from '../Types/Chat';

interface UseSignalROptions {
    hubUrl: string;
    onConnected?: (connectionId: string) => void;
    onDisconnected?: () => void;
    onReconnecting?: () => void;
    onReconnected?: (connectionId: string) => void;
    automaticReconnect?: boolean;
}

export const useSignalR = (options: UseSignalROptions) => {
    const {
        hubUrl,
        onConnected,
        onDisconnected,
        onReconnecting,
        onReconnected,
        automaticReconnect = true,
    } = options;

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
        ConnectionStatus.Disconnected
    );
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    // Build connection
    const buildConnection = useCallback(() => {
        const builder = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .configureLogging(signalR.LogLevel.Information);

        if (automaticReconnect) {
            builder.withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    if (retryContext.elapsedMilliseconds < 60000) {
                        // Exponential backoff up to 1 minute
                        return Math.min(1000 * (retryContext.previousRetryCount + 1), 5000);
                    }
                    return null; // Stop retrying after 1 minute
                },
            });
        }

        return builder.build();
    }, [hubUrl, automaticReconnect]);

    // Connect to SignalR hub
    const connect = useCallback(async () => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            console.log('Already connected');
            return;
        }

        try {
            setConnectionStatus(ConnectionStatus.Connecting);

            const connection = buildConnection();
            connectionRef.current = connection;

            // Setup connection event handlers
            connection.onclose(() => {
                setConnectionStatus(ConnectionStatus.Disconnected);
                setConnectionId(null);
                onDisconnected?.();
            });

            connection.onreconnecting(() => {
                setConnectionStatus(ConnectionStatus.Reconnecting);
                onReconnecting?.();
            });

            connection.onreconnected((connId) => {
                setConnectionStatus(ConnectionStatus.Connected);
                setConnectionId(connId || null);
                onReconnected?.(connId || '');
            });

            // Start connection
            await connection.start();

            setConnectionStatus(ConnectionStatus.Connected);
            const connId = connection.connectionId || '';
            setConnectionId(connId);
            onConnected?.(connId);

            console.log('SignalR Connected:', connId);
        } catch (error) {
            console.error('SignalR Connection Error:', error);
            setConnectionStatus(ConnectionStatus.ConnectionFailed);
        }
    }, [buildConnection, onConnected, onDisconnected, onReconnecting, onReconnected]);

    // Disconnect from SignalR hub
    const disconnect = useCallback(async () => {
        if (connectionRef.current) {
            try {
                await connectionRef.current.stop();
                connectionRef.current = null;
                setConnectionStatus(ConnectionStatus.Disconnected);
                setConnectionId(null);
            } catch (error) {
                console.error('Error disconnecting:', error);
            }
        }
    }, []);

    // Register event handler
    const on = useCallback(
        (methodName: string, handler: (...args: any[]) => void) => {
            if (connectionRef.current) {
                connectionRef.current.on(methodName, handler);
            }
        },
        []
    );

    // Unregister event handler
    const off = useCallback(
        (methodName: string, handler: (...args: any[]) => void) => {
            if (connectionRef.current) {
                connectionRef.current.off(methodName, handler);
            }
        },
        []
    );

    // Invoke server method
    const invoke = useCallback(
        async <T = any>(methodName: string, ...args: any[]): Promise<T | undefined> => {
            if (
                connectionRef.current?.state === signalR.HubConnectionState.Connected
            ) {
                try {
                    return await connectionRef.current.invoke<T>(methodName, ...args);
                } catch (error) {
                    console.error(`Error invoking ${methodName}:`, error);
                    throw error;
                }
            } else {
                console.warn('Cannot invoke method: SignalR not connected');
                return undefined;
            }
        },
        []
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connection: connectionRef.current,
        connectionStatus,
        connectionId,
        isConnected: connectionStatus === ConnectionStatus.Connected,
        connect,
        disconnect,
        on,
        off,
        invoke,
    };
};