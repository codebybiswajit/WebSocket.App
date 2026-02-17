// components/Chat/MessageInput.tsx

import React, { useEffect, useRef, useState } from 'react';
import styles from './ChatStyle';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    onTyping: () => void;
    onStopTyping: () => void;
    disabled?: boolean;
}

const MessageInput = ({ onSendMessage, onTyping, onStopTyping, disabled }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        onTyping();

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            onStopTyping();
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || disabled) return;

        // FIX: call onSendMessage ONCE — the old code called it a second time
        // inside console.log(), sending the message twice and logging a Promise
        await onSendMessage(trimmed);

        setMessage('');
        onStopTyping();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} style={styles.messageForm}>
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder={disabled ? 'Connecting...' : 'Type a message...'}
                style={styles.messageInput}
                disabled={disabled}
                autoComplete="off"
            />
            <button
                type="submit"
                style={{
                    ...styles.sendButton,
                    ...(disabled || !message.trim() ? styles.sendButtonDisabled : {}),
                }}
                disabled={disabled || !message.trim()}
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;