// Context/ChatContext.tsx

import * as signalR from '@microsoft/signalr';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ConnectionStatus, type ChatMessage, type User } from '../Types/Chat';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnlineUser {
    userId: string;
    username: string;
}

interface ChatContextValue {
    messagesByConversation: Record<string, ChatMessage[]>;
    getMessages: (conversationId: string) => ChatMessage[];
    onlineCount: number;
    onlineUsers: OnlineUser[];
    connectionStatus: ConnectionStatus;
    currentUser: User | null;
    isTyping: boolean;
    typingUser: string | null;
    activeConversationId: string | null;
    setActiveConversation: (id: string) => void;
    sendPrivateMessage: (toUserId: string, message: string) => Promise<void>;
    sendGroupMessage: (groupId: string, message: string) => Promise<void>;
    loadConversationHistory: (withUserId: string, page?: number) => Promise<void>;
    loadGroupHistory: (groupId: string, page?: number) => Promise<void>;
    authenticate: (userId: string, username: string) => Promise<void>;
    notifyTyping: (toUserId: string) => void;
    notifyStopTyping: (toUserId: string) => void;
    unreadCounts: Record<string, number>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
    return ctx;
};

const HUB_URL = import.meta.env.VITE_HUB_URL ?? 'https://localhost:7001/chatHub';

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [messagesByConversation, setMessagesByConversation] = useState<Record<string, ChatMessage[]>>({});
    const [onlineCount, setOnlineCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [connectionStatus, setStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);

    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const activeConversationRef = useRef<string | null>(null);
    const currentUserRef = useRef<User | null>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const appendMessage = useCallback((conversationId: string, msg: ChatMessage) => {
        setMessagesByConversation(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] ?? []), msg],
        }));
    }, []);

    const prependHistory = useCallback((conversationId: string, msgs: ChatMessage[]) => {
        setMessagesByConversation(prev => {
            const existing = prev[conversationId] ?? [];
            const existingIds = new Set(existing.map(m => m.id));
            const newMsgs = msgs.filter(m => !existingIds.has(m.id));
            return { ...prev, [conversationId]: [...newMsgs, ...existing] };
        });
    }, []);

    const setActiveConversation = useCallback((id: string) => {
        activeConversationRef.current = id;
        setActiveConversationIdState(id);
        // Clear unread when opening conversation
        setUnreadCounts(prev => ({ ...prev, [id]: 0 }));
    }, []);

    const getMessages = useCallback((conversationId: string): ChatMessage[] => {
        return messagesByConversation[conversationId] ?? [];
    }, [messagesByConversation]);

    // ── SignalR connection ────────────────────────────────────────────────────

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (ctx) =>
                    ctx.elapsedMilliseconds < 60_000
                        ? Math.min(1000 * (ctx.previousRetryCount + 1), 5000)
                        : null,
            })
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        connectionRef.current = connection;

        // Register ALL handlers BEFORE start()

        connection.on('Connected', (connId: string) => {
            setCurrentUser(prev => {
                const updated = prev
                    ? { ...prev, connectionId: connId }
                    : { connectionId: connId, userId: '', username: '' };
                currentUserRef.current = updated;
                return updated;
            });
        });

        connection.on('Authenticated', (data: { userId: string; username: string }) => {
            setCurrentUser(prev => {
                const updated = {
                    connectionId: prev?.connectionId ?? '',
                    userId: data.userId,
                    username: data.username,
                };
                currentUserRef.current = updated;
                return updated;
            });
        });

        // Private message — echoed to sender + delivered to recipient
        connection.on('ReceiveMessage', (payload: {
            id: string; fromUserId: string; fromUsername: string;
            toUserId: string; message: string; timestamp: string;
        }) => {
            const msg: ChatMessage = {
                id: payload.id,
                username: payload.fromUsername,
                message: payload.message,
                timestamp: new Date(payload.timestamp),
                connectionId: payload.fromUserId,
                userId: payload.fromUserId,
            };

            // Determine which conversation bucket this belongs to
            const myUserId = currentUserRef.current?.userId;
            const conversationKey = payload.fromUserId === myUserId
                ? payload.toUserId    // I sent it → bucket by recipient
                : payload.fromUserId; // I received it → bucket by sender

            appendMessage(conversationKey, msg);

            // Increment unread if not currently viewing this conversation
            if (conversationKey !== activeConversationRef.current && payload.fromUserId !== myUserId) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [payload.fromUserId]: (prev[payload.fromUserId] ?? 0) + 1,
                }));
            }
        });

        // Group message
        connection.on('ReceiveGroupMessage', (payload: {
            id: string; fromUserId: string; fromUsername: string;
            groupId: string; message: string; timestamp: string;
        }) => {
            const msg: ChatMessage = {
                id: payload.id,
                username: payload.fromUsername,
                message: payload.message,
                timestamp: new Date(payload.timestamp),
                connectionId: payload.fromUserId,
                userId: payload.fromUserId,
            };
            appendMessage(payload.groupId, msg);
        });

        // Conversation history from DB
        connection.on('ConversationHistory', (data: {
            withUserId: string;
            messages: Array<{ id: string; fromUserId: string; fromUsername: string; message: string; timestamp: string; }>;
            page: number;
        }) => {
            const msgs: ChatMessage[] = data.messages.map(m => ({
                id: m.id, username: m.fromUsername, message: m.message,
                timestamp: new Date(m.timestamp), connectionId: m.fromUserId, userId: m.fromUserId,
            }));
            prependHistory(data.withUserId, msgs);
        });

        // Group history from DB
        connection.on('GroupHistory', (data: {
            groupId: string;
            messages: Array<{ id: string; fromUserId: string; fromUsername: string; message: string; timestamp: string; }>;
        }) => {
            const msgs: ChatMessage[] = data.messages.map(m => ({
                id: m.id, username: m.fromUsername, message: m.message,
                timestamp: new Date(m.timestamp), connectionId: m.fromUserId, userId: m.fromUserId,
            }));
            prependHistory(data.groupId, msgs);
        });

        connection.on('UserOnline', (user: OnlineUser) => {
            setOnlineUsers(prev => prev.find(u => u.userId === user.userId) ? prev : [...prev, user]);
        });

        connection.on('UserOffline', (user: OnlineUser) => {
            setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId));
        });

        connection.on('OnlineUsers', (users: OnlineUser[]) => {
            setOnlineUsers(users);
        });

        connection.on('UpdateUserCount', (count: number) => setOnlineCount(count));

        connection.on('UnreadCounts', (counts: Record<string, number>) => setUnreadCounts(counts));

        connection.on('UserTyping', (username: string) => {
            setIsTyping(true);
            setTypingUser(username);
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => { setIsTyping(false); setTypingUser(null); }, 3000);
        });

        connection.on('UserStopTyping', () => {
            if (typingTimer.current) clearTimeout(typingTimer.current);
            setIsTyping(false);
            setTypingUser(null);
        });

        connection.onclose(() => setStatus(ConnectionStatus.Disconnected));
        connection.onreconnecting(() => setStatus(ConnectionStatus.Reconnecting));
        connection.onreconnected((connId) => {
            setStatus(ConnectionStatus.Connected);
            setCurrentUser(prev => prev ? { ...prev, connectionId: connId ?? '' } : null);
        });

        setStatus(ConnectionStatus.Connecting);
        connection.start()
            .then(() => {
                setStatus(ConnectionStatus.Connected);
                connection.invoke('GetOnlineUsers').catch(() => { });
            })
            .catch((err) => {
                console.error('SignalR connection error:', err);
                setStatus(ConnectionStatus.ConnectionFailed);
            });

        return () => { connection.stop(); };
    }, [appendMessage, prependHistory]);

    // ── Actions ───────────────────────────────────────────────────────────────

    const authenticate = useCallback(async (userId: string, username: string) => {
        const conn = connectionRef.current;
        if (conn?.state !== signalR.HubConnectionState.Connected) return;
        await conn.invoke('Authenticate', userId, username);
    }, []);

    const sendPrivateMessage = useCallback(async (toUserId: string, message: string) => {
        const conn = connectionRef.current;
        if (conn?.state !== signalR.HubConnectionState.Connected) return;
        await conn.invoke('SendPrivateMessage', toUserId, message);
    }, []);

    const sendGroupMessage = useCallback(async (groupId: string, message: string) => {
        const conn = connectionRef.current;
        if (conn?.state !== signalR.HubConnectionState.Connected) return;
        await conn.invoke('SendGroupMessage', groupId, message);
    }, []);

    const loadConversationHistory = useCallback(async (withUserId: string, page = 0) => {
        const conn = connectionRef.current;
        if (conn?.state !== signalR.HubConnectionState.Connected) return;
        await conn.invoke('GetConversationHistory', withUserId, page);
    }, []);

    const loadGroupHistory = useCallback(async (groupId: string, page = 0) => {
        const conn = connectionRef.current;
        if (conn?.state !== signalR.HubConnectionState.Connected) return;
        await conn.invoke('GetGroupHistory', groupId, page);
    }, []);

    const notifyTyping = useCallback((toUserId: string) => {
        connectionRef.current?.invoke('NotifyTyping', toUserId).catch(() => { });
    }, []);

    const notifyStopTyping = useCallback((toUserId: string) => {
        connectionRef.current?.invoke('NotifyStopTyping', toUserId).catch(() => { });
    }, []);

    const value: ChatContextValue = {
        messagesByConversation, getMessages, onlineCount, onlineUsers,
        connectionStatus, currentUser, isTyping, typingUser,
        activeConversationId, setActiveConversation,
        sendPrivateMessage, sendGroupMessage,
        loadConversationHistory, loadGroupHistory,
        authenticate, notifyTyping, notifyStopTyping, unreadCounts,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};