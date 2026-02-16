// components/Chat/UsernameModal.tsx

import React, { useState } from 'react';
import styles from './ChatStyle'

interface UsernameModalProps {
  onSetUsername: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ onSetUsername }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    if (trimmedUsername.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    onSetUsername(trimmedUsername);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Welcome to Chat</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={username}
            onChange={handleInputChange}
            placeholder='Enter your username'
            style={styles.usernameInput}
            autoComplete='off'
            autoFocus
            minLength={2}
            maxLength={20}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type='submit' style={styles.joinButton}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
