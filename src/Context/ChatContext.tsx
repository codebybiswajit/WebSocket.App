// contexts/ChatContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSignalR } from '../Hooks/useSignalLR';
import type { ChatContextType, ChatMessage, User } from '../types/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const HUB_URL = import.meta.env.VITE_APP_HUB_URL || 'http://localhost:5000/chatHub';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [onlineCount, setOnlineCount] = useState<number>(0);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);

    const {
        connectionStatus,
        connectionId,
        connect: connectSignalR,
        disconnect: disconnectSignalR,
        on,
        off,
        invoke,
    } = useSignalR({
        hubUrl: HUB_URL,
        onConnected: (connId) => {
            console.log('Chat connected:', connId);
        },
        onDisconnected: () => {
            console.log('Chat disconnected');
            setCurrentUser(null);
        },
        onReconnecting: () => {
            console.log('Chat reconnecting...');
        },
        onReconnected: (connId) => {
            console.log('Chat reconnected:', connId);
            // Re-set username after reconnection
            if (currentUser?.username) {
                invoke('SetUsername', currentUser.username);
            }
        },
    });

    // Setup SignalR event handlers
    useEffect(() => {
        // Receive messages
        const handleReceiveMessage = (data: {
            username: string;
            message: string;
            timestamp: string;
            connectionId: string;
        }) => {
            const newMessage: ChatMessage = {
                username: data.username,
                message: data.message,
                timestamp: new Date(data.timestamp),
                connectionId: data.connectionId,
            };
            setMessages((prev) => [...prev, newMessage]);
        };

        // User joined
        const handleUserJoined = (username: string) => {
            const systemMessage: ChatMessage = {
                username: 'System',
                message: `${username} joined the chat`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, systemMessage]);
        };

        // User left
        const handleUserLeft = (username: string) => {
            const systemMessage: ChatMessage = {
                username: 'System',
                message: `${username} left the chat`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, systemMessage]);
        };

        // Update user count
        const handleUpdateUserCount = (count: number) => {
            setOnlineCount(count);
        };

        // User typing
        const handleUserTyping = (username: string) => {
            setIsTyping(true);
            setTypingUser(username);
        };

        // User stopped typing
        const handleUserStopTyping = () => {
            setIsTyping(false);
            setTypingUser(null);
        };

        // Username set confirmation
        const handleUsernameSet = (username: string) => {
            console.log('Username set:', username);
        };

        // Connection established
        const handleConnected = (connId: string) => {
            console.log('Connected with ID:', connId);
        };

        // Register handlers
        on('ReceiveMessage', handleReceiveMessage);
        on('UserJoined', handleUserJoined);
        on('UserLeft', handleUserLeft);
        on('UpdateUserCount', handleUpdateUserCount);
        on('UserTyping', handleUserTyping);
        on('UserStopTyping', handleUserStopTyping);
        on('UsernameSet', handleUsernameSet);
        on('Connected', handleConnected);

        // Cleanup
        return () => {
            off('ReceiveMessage', handleReceiveMessage);
            off('UserJoined', handleUserJoined);
            off('UserLeft', handleUserLeft);
            off('UpdateUserCount', handleUpdateUserCount);
            off('UserTyping', handleUserTyping);
            off('UserStopTyping', handleUserStopTyping);
            off('UsernameSet', handleUsernameSet);
            off('Connected', handleConnected);
        };
    }, [on, off]);

    // Set username and connect
    const setUsername = useCallback(
        async (username: string) => {
            if (!username.trim()) {
                throw new Error('Username cannot be empty');
            }

            try {
                await connectSignalR();
                await invoke('SetUsername', username);

                setCurrentUser({
                    connectionId: connectionId || '',
                    username: username,
                });
            } catch (error) {
                console.error('Error setting username:', error);
                throw error;
            }
        },
        [connectSignalR, invoke, connectionId]
    );

    // Send message
    const sendMessage = useCallback(
        async (message: string) => {
            if (!message.trim() || !currentUser) {
                return;
            }

            try {
                await invoke('SendMessage', currentUser.username, message);
            } catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        },
        [invoke, currentUser]
    );

    // Notify typing
    const notifyTyping = useCallback(() => {
        if (currentUser) {
            invoke('NotifyTyping', currentUser.username).catch((err) =>
                console.error('Error notifying typing:', err)
            );
        }
    }, [invoke, currentUser]);

    // Notify stop typing
    const notifyStopTyping = useCallback(() => {
        if (currentUser) {
            invoke('NotifyStopTyping', currentUser.username).catch((err) =>
                console.error('Error notifying stop typing:', err)
            );
        }
    }, [invoke, currentUser]);

    const value: ChatContextType = {
        messages,
        users,
        onlineCount,
        connectionStatus,
        currentUser,
        isTyping,
        typingUser,
        sendMessage,
        setUsername,
        connect: connectSignalR,
        disconnect: disconnectSignalR,
        notifyTyping,
        notifyStopTyping,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};