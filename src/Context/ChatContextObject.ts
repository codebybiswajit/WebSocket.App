import { createContext } from "react";
import type { ChatMessage, ConnectionStatus, User } from "../Types/Chat";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnlineUser {
  userId: string;
  username: string;
}

export interface ChatContextValue {
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
  notifyTyping: (toUserId: string) => void;
  notifyStopTyping: (toUserId: string) => void;
  unreadCounts: Record<string, number>;
}

export const ChatContext = createContext<ChatContextValue | null>(null);
