// components/Chat/MessageList.tsx

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../Types/Chat";
import styles from "./ChatStyle";

interface MessageListProps {
  messages: ChatMessage[];
  // FIX: was currentConnectionId — server payload has fromUserId, not connectionId
  currentUserId?: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FIX: compare userId (what the context creates) instead of formUserId
  const isOwnMessage = (message: ChatMessage) => {
    return message.userId === currentUserId;
  };

  const isSystemMessage = (message: ChatMessage) => {
    return message.username === "System";
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.messageList}>
      {messages.map((message, index) => {
        const own = isOwnMessage(message);
        const system = isSystemMessage(message);

        if (system) {
          return (
            <div key={index} style={styles.systemMessage}>
              <span style={styles.systemMessage}>{message.message}</span>
            </div>
          );
        }

        return (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(own ? styles.ownMessage : styles.messageForm),
            }}
          >
            <div style={styles.messageHeader}>
              <strong style={own ? styles.usernameOwn : styles.username}>
                {message.username}
              </strong>
              <span style={own ? styles.timestampOwn : styles.timestamp}>
                {formatTime(message.timestamp)}
              </span>
            </div>
            <div style={styles.messageText}>{message.message}</div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
