// types/chat.ts

export interface ChatMessage {
  id?: string;
  username: string;
  message: string;
  timestamp: Date;
  connectionId?: string;
  userId?: string;
  formUserId?: string; // FIX: added formUserId to match server payload
  toUserId?: string;
  inGroupId?: string;
}

export interface User {
  connectionId: string;
  username: string;
  userId: string;
}

export enum ConnectionStatus {
  Disconnected = "Disconnected",
  Connecting = "Connecting",
  Connected = "Connected",
  Reconnecting = "Reconnecting",
  ConnectionFailed = "ConnectionFailed",
}

export interface ChatState {
  messages: ChatMessage[];
  users: User[];
  onlineCount: number;
  connectionStatus: ConnectionStatus;
  currentUser: User | null;
  isTyping: boolean;
  typingUser: string | null;
}

export interface ChatContextType extends ChatState {
  sendMessage: (message: string) => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  notifyTyping: () => void;
  notifyStopTyping: () => void;
}

export interface SignalRConfig {
  hubUrl: string;
  automaticReconnect?: boolean;
  logLevel?: number;
}
