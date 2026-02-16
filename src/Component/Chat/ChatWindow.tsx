// components/Chat/ChatWindow.tsx

import { type CSSProperties, useState } from 'react';
import { useChat } from '../../Context/ChatContext';
import { ConnectionStatus } from '../../Types/Chat';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

const ChatWindow = () => {
  const {
    messages,
    onlineCount,
    connectionStatus,
    currentUser,
    isTyping,
    typingUser,
    sendMessage,
    setUsername,
    notifyTyping,
    notifyStopTyping
  } = useChat();

  // const [showUsernameModal, setShowUsernameModal] = useState(!currentUser);
  const [selectedContact, setSelectedContact] = useState<string>('group-1');
  const [showSidebar, setShowSidebar] = useState(true);

  // Mock contacts data - replace with your actual data
  const contacts: Contact[] = [
    { id: 'group-1', name: 'General Chat', lastMessage: 'Hey everyone!', time: '10:30 AM', unread: 3, online: true },
    { id: 'group-2', name: 'Tech Discussion', lastMessage: 'Check out this new framework', time: '9:15 AM', unread: 0, online: true },
    { id: 'user-1', name: 'John Doe', lastMessage: 'See you tomorrow', time: 'Yesterday', unread: 0, online: true },
    { id: 'user-2', name: 'Jane Smith', lastMessage: 'Thanks for your help!', time: 'Yesterday', unread: 1, online: false },
    { id: 'group-3', name: 'Project Team', lastMessage: 'Meeting at 3 PM', time: 'Monday', unread: 0, online: true },
    { id: 'user-3', name: 'Mike Johnson', lastMessage: 'Perfect, let\'s do it', time: 'Sunday', unread: 0, online: false },
    { id: 'user-4', name: 'Sarah Williams', lastMessage: 'Have a great day!', time: 'Saturday', unread: 0, online: true },
    { id: 'group-4', name: 'Family', lastMessage: 'Mom: Dinner tonight?', time: 'Friday', unread: 2, online: true },
  ];

  const handleSetUsername = async (username: string) => {
    try {
      await setUsername(username);
      // setShowUsernameModal(false);
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

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case ConnectionStatus.Connected:
        return '#25D366';
      case ConnectionStatus.Connecting:
      case ConnectionStatus.Reconnecting:
        return '#FFA000';
      case ConnectionStatus.Disconnected:
      case ConnectionStatus.ConnectionFailed:
        return '#FF5252';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <>
      {/* {showUsernameModal && <UsernameModal onSetUsername={handleSetUsername} />} */}

      <div style={styles.appContainer}>
        {/* Sidebar - Contacts List */}
        <aside style={{
          ...styles.sidebar,
          display: showSidebar ? 'flex' : 'none',
        }}>
          {/* Sidebar Header */}
          <div style={styles.sidebarHeader}>
            <div style={styles.sidebarHeaderLeft}>
              <div style={styles.userAvatar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h2 style={styles.sidebarTitle}>Chats</h2>
            </div>

            <div style={styles.sidebarHeaderRight}>
              <button style={styles.sidebarIconButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </button>

              <button style={styles.sidebarIconButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search or start new chat"
                style={styles.searchInput}
              />
            </div>
          </div>

          {/* Contacts List - Scrollable */}
          <div style={styles.contactsList}>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  ...styles.contactItem,
                  backgroundColor: selectedContact === contact.id ? '#2A3942' : 'transparent',
                }}
                onClick={() => {
                  setSelectedContact(contact.id)
                  handleSetUsername(contact.name);
                }}
              >
                <div style={styles.contactAvatar}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {contact.online && <div style={styles.onlineDot}></div>}
                </div>

                <div style={styles.contactInfo}>
                  <div style={styles.contactHeader}>
                    <h3 style={styles.contactName}>{contact.name}</h3>
                    <span style={styles.contactTime}>{contact.time}</span>
                  </div>
                  <div style={styles.contactFooter}>
                    <p style={styles.lastMessage}>{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <div style={styles.unreadBadge}>{contact.unread}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main style={styles.mainChat}>
          {/* Chat Header */}
          <header style={styles.header}>
            <div style={styles.headerContent}>
              {/* Left Side - Back & Profile */}
              <div style={styles.headerLeft}>
                <button
                  style={styles.backButton}
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <div style={styles.profileSection}>
                  <div style={styles.avatar}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>

                  <div style={styles.profileInfo}>
                    <h1 style={styles.chatTitle}>
                      {contacts.find(c => c.id === selectedContact)?.name || 'Group Chat'}
                    </h1>
                    <div style={styles.statusContainer}>
                      <span style={styles.onlineText}>{onlineCount} participants</span>
                      <span style={styles.statusDot}>•</span>
                      <div style={styles.connectionBadge}>
                        <div style={{
                          ...styles.connectionDot,
                          backgroundColor: getConnectionColor()
                        }}></div>
                        <span style={styles.connectionText}>
                          {connectionStatus === ConnectionStatus.Connected ? 'online' : connectionStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div style={styles.headerRight}>
                <button style={styles.iconButton}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>

                <button style={styles.iconButton}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Messages Area - Scrollable */}
          <div style={styles.messagesContainer}>
            <MessageList
              messages={messages}
              currentConnectionId={currentUser?.connectionId}
            />
          </div>

          {/* Typing Indicator */}
          {isTyping && typingUser && (
            <div style={styles.typingIndicator}>
              <div style={styles.typingBubble}>
                <div style={styles.typingDotsContainer}>
                  <span style={styles.typingDot1}></span>
                  <span style={styles.typingDot2}></span>
                  <span style={styles.typingDot3}></span>
                </div>
              </div>
              <span style={styles.typingLabel}>{typingUser}</span>
            </div>
          )}

          {/* Input Area */}
          <div style={styles.inputContainer}>
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={notifyTyping}
              onStopTyping={notifyStopTyping}
              disabled={connectionStatus !== ConnectionStatus.Connected}
            />
          </div>
        </main>

        {/* Animations */}
        <style>{`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          /* Custom Scrollbar */
          .contactsList::-webkit-scrollbar,
          .messagesContainer::-webkit-scrollbar {
            width: 6px;
          }

          .contactsList::-webkit-scrollbar-track,
          .messagesContainer::-webkit-scrollbar-track {
            background: transparent;
          }

          .contactsList::-webkit-scrollbar-thumb,
          .messagesContainer::-webkit-scrollbar-thumb {
            background: #374955;
            border-radius: 3px;
          }

          .contactsList::-webkit-scrollbar-thumb:hover,
          .messagesContainer::-webkit-scrollbar-thumb:hover {
            background: #4A5C6A;
          }

          /* Hover Effects */
          button:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }

          @media (max-width: 768px) {
            .sidebar {
              position: absolute !important;
              width: 100% !important;
              z-index: 20;
            }
          }
        `}</style>
      </div>
    </>
  );
};

const styles: Record<string, CSSProperties> = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#111B21',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: 'hidden',
  },

  // Sidebar Styles
  sidebar: {
    width: '400px',
    backgroundColor: '#111B21',
    borderRight: '1px solid #2A3942',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    flexShrink: 0,
  },

  sidebarHeader: {
    backgroundColor: '#202C33',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    flexShrink: 0,
  },

  sidebarHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#374955',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8696A0',
  },

  sidebarTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#E9EDEF',
  },

  sidebarHeaderRight: {
    display: 'flex',
    gap: '8px',
  },

  sidebarIconButton: {
    background: 'transparent',
    border: 'none',
    color: '#AEBAC1',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },

  searchContainer: {
    padding: '8px 16px 10px',
    backgroundColor: '#111B21',
    flexShrink: 0,
  },

  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#202C33',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#8696A0',
  },

  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#E9EDEF',
    fontSize: '14px',
    fontFamily: 'inherit',
  },

  // Contacts List - Scrollable
  contactsList: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  contactItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid rgba(42, 57, 66, 0.5)',
  },

  contactAvatar: {
    position: 'relative',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#374955',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8696A0',
    flexShrink: 0,
  },

  onlineDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    backgroundColor: '#25D366',
    border: '2px solid #111B21',
    borderRadius: '50%',
  },

  contactInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },

  contactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contactName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    color: '#E9EDEF',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  contactTime: {
    fontSize: '12px',
    color: '#8696A0',
    flexShrink: 0,
  },

  contactFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },

  lastMessage: {
    margin: 0,
    fontSize: '14px',
    color: '#8696A0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },

  unreadBadge: {
    backgroundColor: '#25D366',
    color: '#111B21',
    fontSize: '12px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '12px',
    minWidth: '20px',
    textAlign: 'center',
    flexShrink: 0,
  },

  // Main Chat Styles
  mainChat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0B141A',
    overflow: 'hidden',
  },

  // Header Styles
  header: {
    backgroundColor: '#202C33',
    borderBottom: '1px solid #2A3942',
    flexShrink: 0,
    zIndex: 10,
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    height: '60px',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: 0,
  },

  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#AEBAC1',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  },

  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    flex: 1,
    minWidth: 0,
  },

  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#374955',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8696A0',
    flexShrink: 0,
  },

  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    flex: 1,
  },

  chatTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    color: '#E9EDEF',
    lineHeight: '21px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  onlineText: {
    fontSize: '13px',
    color: '#8696A0',
  },

  statusDot: {
    fontSize: '6px',
    color: '#8696A0',
  },

  connectionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  connectionDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },

  connectionText: {
    fontSize: '13px',
    color: '#8696A0',
    textTransform: 'lowercase',
  } as CSSProperties,

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },

  iconButton: {
    background: 'transparent',
    border: 'none',
    color: '#AEBAC1',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },

  // Messages Container - Scrollable
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#0B141A',
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,.02) 10px,
        rgba(255,255,255,.02) 20px
      )
    `,
  },

  // Typing Indicator
  typingIndicator: {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0B141A',
    flexShrink: 0,
  },

  typingBubble: {
    backgroundColor: '#202C33',
    borderRadius: '7.5px',
    padding: '8px 12px',
    boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
  },

  typingDotsContainer: {
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
  },

  typingDot1: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#8696A0',
    display: 'inline-block',
    animation: 'typing 1.4s infinite ease-in-out',
  },

  typingDot2: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#8696A0',
    display: 'inline-block',
    animation: 'typing 1.4s infinite ease-in-out 0.2s',
  },

  typingDot3: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#8696A0',
    display: 'inline-block',
    animation: 'typing 1.4s infinite ease-in-out 0.4s',
  },

  typingLabel: {
    fontSize: '13px',
    color: '#8696A0',
    fontStyle: 'italic',
  },

  // Input Container
  inputContainer: {
    backgroundColor: '#202C33',
    borderTop: '1px solid #2A3942',
    // padding: '8px 16px',
    flexShrink: 0,
  },
};

export default ChatWindow;