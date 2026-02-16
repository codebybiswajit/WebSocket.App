// components/Chat/ChatWindow.tsx

import React, { useState } from 'react';

import { useChat } from '../../Context/ChatContext';
import { ConnectionStatus } from '../../types/chat';
import styles from './ChatStyle';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UsernameModal from './UsernameModel';

const ChatWindow: React.FC = () => {
  const { messages, onlineCount, connectionStatus, currentUser, isTyping, typingUser, sendMessage, setUsername, notifyTyping, notifyStopTyping } = useChat();

  const [showUsernameModal, setShowUsernameModal] = useState(!currentUser);

  const handleSetUsername = async (username: string) => {
    try {
      await setUsername(username);
      setShowUsernameModal(false);
    } catch (error) {
      console.error('Failed to set username:', error);
      alert('Failed to set username. Please try again.');
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getConnectionStatusClass = () => {
    switch (connectionStatus) {
      case ConnectionStatus.Connected:
        return styles.connected;
      case ConnectionStatus.Connecting:
      case ConnectionStatus.Reconnecting:
        return styles.connecting;
      case ConnectionStatus.Disconnected:
      case ConnectionStatus.ConnectionFailed:
        return styles.disconnected;
      default:
        return '';
    }
  };

  return (
    <>
      {showUsernameModal && <UsernameModal onSetUsername={handleSetUsername} />}

      <div style={styles.chatContainer}>
        {/* Header */}
        <div style={styles.chatHeader}>
          <h1 style={styles.title}>💬 Real-Time Chat</h1>
          <div style={styles.headerInfo}>
            <span style={styles.onlineCount}>{onlineCount} online</span>
            <span className={`${styles.connectionStatus} ${getConnectionStatusClass()}`}>{connectionStatus}</span>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} currentConnectionId={currentUser?.connectionId} />

        {/* Typing Indicator */}
        {isTyping && typingUser && <div style={styles.typingIndicator}>{typingUser} is typing...</div>}

        {/* Input */}
        <MessageInput onSendMessage={handleSendMessage} onTyping={notifyTyping} onStopTyping={notifyStopTyping} disabled={connectionStatus !== ConnectionStatus.Connected} />
      </div>
    </>
  );
};

export default ChatWindow;
