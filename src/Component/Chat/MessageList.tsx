// components/Chat/MessageList.tsx

import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chat';
import styles from './ChatStyle'
interface MessageListProps {
    messages: ChatMessage[];
    currentConnectionId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentConnectionId }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const isOwnMessage = (message: ChatMessage) => {
        return message.connectionId === currentConnectionId;
    };

    const isSystemMessage = (message: ChatMessage) => {
        return message.username === 'System';
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div style={styles.messageList}>
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`${styles.message} ${isSystemMessage(message)
                        ? styles.systemMessage
                        : isOwnMessage(message)
                            ? styles.ownMessage
                            : ''
                        }`}
                >
                    {!isSystemMessage(message) ? (
                        <>
                            <div style={styles.messageHeader}>
                                <strong style={isOwnMessage(message) ? styles.usernameOwn : styles.username}>{message.username}</strong>
                                <span style={isOwnMessage(message) ? styles.timestampOwn : styles.timestamp}>
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                            <div style={styles.messageText}>{message.message}</div>
                        </>
                    ) : (
                        <span style={styles.systemMessage}>{message.message}</span>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;