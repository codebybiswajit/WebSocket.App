
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
    const typingTimeoutRef = useRef(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        // Notify typing
        onTyping();

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing
        // typingTimeoutRef.current = setTimeout(() => {
        //     onStopTyping();
        // }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
            onStopTyping();

            // Clear typing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
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
                style={styles.sendButton}
                disabled={disabled || !message.trim()}
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;