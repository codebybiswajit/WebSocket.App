// Context/ChatContext.tsx

import * as signalR from "@microsoft/signalr";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ConnectionStatus, type ChatMessage, type User } from "../Types/Chat";
import {
  ChatContext,
  type ChatContextValue,
  type OnlineUser,
} from "./ChatContextObject";

const HUB_URL =
  import.meta.env.VITE_HUB_URL ?? "https://localhost:7001/chatHub";

// ─── Provider ─────────────────────────────────────────────────────────────────

const ChatProvider = ({
  children,
  loggedIn = true,
  tokens,
}: {
  children: React.ReactNode;
  loggedIn?: boolean;
  tokens: string;
}) => {
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [connectionStatus, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Disconnected,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [activeConversationId, setActiveConversationIdState] = useState<
    string | null
  >(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const activeConversationRef = useRef<string | null>(null);
  const currentUserRef = useRef<User | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  const appendMessage = useCallback(
    (conversationId: string, msg: ChatMessage) => {
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), msg],
      }));
    },
    [],
  );

  const prependHistory = useCallback(
    (conversationId: string, msgs: ChatMessage[]) => {
      setMessagesByConversation((prev) => {
        const existing = prev[conversationId] ?? [];
        const existingIds = new Set(existing.map((m) => m.id));
        const newMsgs = msgs.filter((m) => !existingIds.has(m.id));
        return { ...prev, [conversationId]: [...newMsgs, ...existing] };
      });
    },
    [],
  );

  const setActiveConversation = useCallback((id: string) => {
    activeConversationRef.current = id;
    setActiveConversationIdState(id);
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));

    // If the SignalR connection isn't connected, attempt to start/reconnect
    const conn = connectionRef.current;
    if (
      conn &&
      conn.state !== signalR.HubConnectionState.Connected &&
      conn.state !== signalR.HubConnectionState.Connecting
    ) {
      setStatus(ConnectionStatus.Connecting);
      conn
        .start()
        .then(() => {
          if (!isMountedRef.current) return;
          setStatus(ConnectionStatus.Connected);
          conn.invoke("GetOnlineUsers").catch(() => {});
        })
        .catch(() => {
          if (!isMountedRef.current) return;
          setStatus(ConnectionStatus.ConnectionFailed);
        });
    }
  }, []);

  const getMessages = useCallback(
    (conversationId: string): ChatMessage[] => {
      return messagesByConversation[conversationId] ?? [];
    },
    [messagesByConversation],
  );

  // ── SignalR connection ────────────────────────────────────────────────────

  useEffect(() => {
    isMountedRef.current = true;

    // Only attempt connection if we have a token
    if (!tokens) {
      setStatus(ConnectionStatus.Disconnected);
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => tokens,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (ctx) =>
          ctx.elapsedMilliseconds < 60_000
            ? Math.min(1000 * (ctx.previousRetryCount + 1), 5000)
            : null,
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // ── Handlers ─────────────────────────────────────────────────────────

    // Server sends this on connect with identity from JWT claims.
    // No separate authenticate() call needed — the server reads
    // userId/username directly from Context.User in OnConnectedAsync.
    connection.on(
      "ConnectedAs",
      (data: { userId: string; username: string }) => {
        if (!isMountedRef.current) return;
        const updated: User = {
          connectionId: connection.connectionId ?? "",
          userId: data.userId,
          username: data.username,
        };
        currentUserRef.current = updated;
        setCurrentUser(updated);
      },
    );

    // Private message — echoed to sender + delivered to recipient
    connection.on(
      "ReceiveMessage",
      (payload: {
        id: string;
        fromUserId: string;
        fromUsername: string;
        toUserId: string;
        message: string;
        timestamp: string;
      }) => {
        if (!isMountedRef.current) return;

        const msg: ChatMessage = {
          id: payload.id,
          username: payload.fromUsername,
          message: payload.message,
          timestamp: new Date(payload.timestamp),
          connectionId: payload.fromUserId,
          userId: payload.fromUserId,
        };

        const myUserId = currentUserRef.current?.userId;
        const conversationKey =
          payload.fromUserId === myUserId
            ? payload.toUserId
            : payload.fromUserId;

        appendMessage(conversationKey, msg);

        if (
          conversationKey !== activeConversationRef.current &&
          payload.fromUserId !== myUserId
        ) {
          setUnreadCounts((prev) => ({
            ...prev,
            [payload.fromUserId]: (prev[payload.fromUserId] ?? 0) + 1,
          }));
        }
      },
    );

    // Group message
    connection.on(
      "ReceiveGroupMessage",
      (payload: {
        id: string;
        fromUserId: string;
        fromUsername: string;
        groupId: string;
        message: string;
        timestamp: string;
      }) => {
        if (!isMountedRef.current) return;
        const msg: ChatMessage = {
          id: payload.id,
          username: payload.fromUsername,
          message: payload.message,
          timestamp: new Date(payload.timestamp),
          connectionId: payload.fromUserId,
          userId: payload.fromUserId,
        };
        appendMessage(payload.groupId, msg);
      },
    );

    // Conversation history from DB
    connection.on(
      "ConversationHistory",
      (data: {
        withUserId: string;
        messages: Array<{
          id: string;
          fromUserId: string;
          fromUsername: string;
          message: string;
          timestamp: string;
        }>;
        page: number;
      }) => {
        if (!isMountedRef.current) return;
        const msgs: ChatMessage[] = data.messages.map((m) => ({
          id: m.id,
          username: m.fromUsername,
          message: m.message,
          timestamp: new Date(m.timestamp),
          connectionId: m.fromUserId,
          userId: m.fromUserId,
        }));
        prependHistory(data.withUserId, msgs);
      },
    );

    // Group history from DB
    connection.on(
      "GroupHistory",
      (data: {
        groupId: string;
        messages: Array<{
          id: string;
          fromUserId: string;
          fromUsername: string;
          message: string;
          timestamp: string;
        }>;
      }) => {
        if (!isMountedRef.current) return;
        const msgs: ChatMessage[] = data.messages.map((m) => ({
          id: m.id,
          username: m.fromUsername,
          message: m.message,
          timestamp: new Date(m.timestamp),
          connectionId: m.fromUserId,
          userId: m.fromUserId,
        }));
        prependHistory(data.groupId, msgs);
      },
    );

    connection.on("UserOnline", (user: OnlineUser) => {
      if (!isMountedRef.current) return;
      setOnlineUsers((prev) =>
        prev.find((u) => u.userId === user.userId) ? prev : [...prev, user],
      );
    });

    connection.on("UserOffline", (user: OnlineUser) => {
      if (!isMountedRef.current) return;
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    });

    connection.on("OnlineUsers", (users: OnlineUser[]) => {
      if (!isMountedRef.current) return;
      setOnlineUsers(users);
    });

    connection.on("UpdateUserCount", (count: number) => {
      if (!isMountedRef.current) return;
      setOnlineCount(count);
    });

    connection.on("UnreadCounts", (counts: Record<string, number>) => {
      if (!isMountedRef.current) return;
      setUnreadCounts(counts);
    });

    connection.on("UserTyping", (username: string) => {
      if (!isMountedRef.current) return;
      setIsTyping(true);
      setTypingUser(username);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
        setTypingUser(null);
      }, 3000);
    });

    connection.on("UserStopTyping", () => {
      if (!isMountedRef.current) return;
      if (typingTimer.current) clearTimeout(typingTimer.current);
      setIsTyping(false);
      setTypingUser(null);
    });

    connection.onclose(() => {
      if (!isMountedRef.current) return;
      setStatus(ConnectionStatus.Disconnected);
    });

    connection.onreconnecting(() => {
      if (!isMountedRef.current) return;
      setStatus(ConnectionStatus.Reconnecting);
    });

    connection.onreconnected(() => {
      if (!isMountedRef.current) return;
      setStatus(ConnectionStatus.Connected);
      // Server will re-fire ConnectedAs which refreshes currentUser
      connection.invoke("GetOnlineUsers").catch(() => {});
    });

    setStatus(ConnectionStatus.Connecting);

    // Start connection with timeout protection
    const connectionPromise = connection.start();
    let timeoutId: ReturnType<typeof setTimeout>;

    connectionPromise
      .then(() => {
        if (!isMountedRef.current) return;
        clearTimeout(timeoutId);
        setStatus(ConnectionStatus.Connected);
        console.log("SignalR connected successfully");
        connection.invoke("GetOnlineUsers").catch(() => {});
      })
      .catch((err) => {
        if (!isMountedRef.current) return;
        clearTimeout(timeoutId);
        console.error("SignalR connection error:", err);
        setStatus(ConnectionStatus.ConnectionFailed);
      });

    // Set timeout to prevent stuck "Connecting" state
    timeoutId = setTimeout(() => {
      if (
        isMountedRef.current &&
        connectionRef.current?.state === signalR.HubConnectionState.Connecting
      ) {
        console.warn("SignalR connection timeout - setting to failed");
        setStatus(ConnectionStatus.ConnectionFailed);
      }
    }, 15000); // 15 second timeout

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
      connectionRef.current = null;
      connection.stop();
    };
  }, [appendMessage, prependHistory, loggedIn, tokens]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const sendPrivateMessage = useCallback(
    async (toUserId: string, message: string) => {
      const conn = connectionRef.current;
      if (conn?.state !== signalR.HubConnectionState.Connected) return;
      if (!currentUserRef.current?.userId) return;
      await conn.invoke("SendPrivateMessage", toUserId, message);
    },
    [],
  );

  const sendGroupMessage = useCallback(
    async (groupId: string, message: string) => {
      const conn = connectionRef.current;
      if (conn?.state !== signalR.HubConnectionState.Connected) return;
      if (!currentUserRef.current?.userId) return;
      await conn.invoke("SendGroupMessage", groupId, message);
    },
    [],
  );

  const loadConversationHistory = useCallback(
    async (withUserId: string, page = 0) => {
      const conn = connectionRef.current;
      if (conn?.state !== signalR.HubConnectionState.Connected) return;
      await conn.invoke("GetConversationHistory", withUserId, page);
    },
    [],
  );

  const loadGroupHistory = useCallback(async (groupId: string, page = 0) => {
    const conn = connectionRef.current;
    if (conn?.state !== signalR.HubConnectionState.Connected) return;
    await conn.invoke("GetGroupHistory", groupId, page);
  }, []);

  const notifyTyping = useCallback((toUserId: string) => {
    if (!currentUserRef.current?.userId) return;
    connectionRef.current?.invoke("NotifyTyping", toUserId).catch(() => {});
  }, []);

  const notifyStopTyping = useCallback((toUserId: string) => {
    if (!currentUserRef.current?.userId) return;
    connectionRef.current?.invoke("NotifyStopTyping", toUserId).catch(() => {});
  }, []);

  const value: ChatContextValue = {
    messagesByConversation,
    getMessages,
    onlineCount,
    onlineUsers,
    connectionStatus,
    currentUser,
    isTyping,
    typingUser,
    activeConversationId,
    setActiveConversation,
    sendPrivateMessage,
    sendGroupMessage,
    loadConversationHistory,
    loadGroupHistory,
    notifyTyping,
    notifyStopTyping,
    unreadCounts,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatProvider };
