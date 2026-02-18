// components/Chat/ChatWindow.tsx

import { type CSSProperties, useEffect, useState } from 'react';
import { useChat } from '../../Context/ChatContext';
import UserService from '../../Services/UserService';
import { ConnectionStatus } from '../../Types/Chat';
import type { IdName } from '../../Types/CommonTypes';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  online?: boolean;
}

// ─── Icon Components ──────────────────────────────────────────────────────────

const UserIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const VideoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    <circle cx="12" cy="13" r="2" />
  </svg>
);

const NewChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#53bdeb" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ─── Animations ───────────────────────────────────────────────────────────────

const Animations = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ripple {
      0% { transform: scale(0); opacity: 0.4; }
      100% { transform: scale(4); opacity: 0; }
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(134,150,160,0.3); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(134,150,160,0.5); }

    .contact-item {
      transition: background-color 0.12s ease;
      position: relative;
      overflow: hidden;
    }
    .contact-item:hover { background-color: #2a3942 !important; }
    .contact-item:active { background-color: #374955 !important; }

    .icon-btn {
      transition: background-color 0.15s, transform 0.1s;
      border-radius: 50%;
    }
    .icon-btn:hover { background-color: rgba(255,255,255,0.08) !important; }
    .icon-btn:active { transform: scale(0.92); }

    .mobile-slide-contacts {
      animation: slideInLeft 0.28s cubic-bezier(0.4,0,0.2,1);
    }
    .mobile-slide-chat {
      animation: slideInRight 0.28s cubic-bezier(0.4,0,0.2,1);
    }

    .chat-bg {
      background-color: #0b141a;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .status-bar {
      background: linear-gradient(180deg, #1a2b34 0%, transparent 100%);
    }

    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
    }
    @media (min-width: 769px) {
      .mobile-only { display: none !important; }
    }
  `}</style>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  appContainer: {
    display: 'flex',
    height: '100dvh',
    width: '100%',
    backgroundColor: '#111b21',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },

  // ── Mobile screens
  mobileScreen: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#111b21',
    willChange: 'transform, opacity',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease',
  },

  // ── Sidebar (desktop)
  sidebar: {
    width: '380px',
    minWidth: '320px',
    backgroundColor: '#111b21',
    borderRight: '1px solid #222d34',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flexShrink: 0,
  },

  // ── Sidebar header
  sidebarHeader: {
    backgroundColor: '#202c33',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    flexShrink: 0,
    borderBottom: '1px solid #2a3942',
  },
  sidebarHeaderLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  userAvatarWrapper: {
    width: '42px', height: '42px', borderRadius: '50%',
    backgroundColor: '#2a3942',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#8696a0', cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  sidebarTitle: {
    margin: 0, fontSize: '19px', fontWeight: 600,
    color: '#e9edef', letterSpacing: '-0.2px',
  },
  sidebarHeaderRight: { display: 'flex', gap: '4px', alignItems: 'center' },
  sidebarIconButton: {
    background: 'transparent', border: 'none', color: '#aebac1',
    cursor: 'pointer', padding: '8px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    width: '40px', height: '40px',
  },

  // ── Search
  searchContainer: {
    padding: '8px 12px 10px',
    backgroundColor: '#111b21',
    flexShrink: 0,
  },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    backgroundColor: '#202c33',
    borderRadius: '10px',
    padding: '9px 14px',
    color: '#8696a0',
    border: '1px solid transparent',
    transition: 'border-color 0.2s',
  },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none',
    outline: 'none', color: '#e9edef', fontSize: '15px',
    fontFamily: 'inherit',
  },

  // ── Contacts list
  contactsList: {
    flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0,
  },
  contactItem: {
    display: 'flex', gap: '13px',
    padding: '10px 16px',
    cursor: 'pointer',
    alignItems: 'center',
  },
  contactDivider: {
    height: '1px',
    backgroundColor: 'rgba(42,57,66,0.6)',
    marginLeft: '82px',
  },
  contactAvatar: {
    position: 'relative', width: '52px', height: '52px', borderRadius: '50%',
    backgroundColor: '#2a3942',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#8696a0', flexShrink: 0,
  },
  onlineDot: {
    position: 'absolute', bottom: '1px', right: '1px',
    width: '13px', height: '13px', backgroundColor: '#25d366',
    border: '2.5px solid #111b21', borderRadius: '50%',
  },
  contactInfo: {
    flex: 1, display: 'flex', flexDirection: 'column',
    gap: '3px', minWidth: 0,
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(42,57,66,0.5)',
  },
  contactInfoLast: {
    flex: 1, display: 'flex', flexDirection: 'column',
    gap: '3px', minWidth: 0,
    paddingBottom: '8px',
  },
  contactHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'baseline', gap: '8px',
  },
  contactName: {
    margin: 0, fontSize: '16px', fontWeight: 500,
    color: '#e9edef',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    flex: 1,
  },
  contactTime: { fontSize: '12px', color: '#8696a0', flexShrink: 0, fontWeight: 400 },
  contactTimeUnread: { fontSize: '12px', color: '#25d366', flexShrink: 0, fontWeight: 500 },
  contactFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: '6px',
  },
  lastMessage: {
    margin: 0, fontSize: '14px', color: '#8696a0',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
    lineHeight: '20px',
  },
  lastMessageUnread: {
    margin: 0, fontSize: '14px', color: '#e9edef',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
    lineHeight: '20px', fontWeight: 500,
  },
  unreadBadge: {
    backgroundColor: '#25d366', color: '#111b21', fontSize: '12px',
    fontWeight: 700, padding: '1px 7px', borderRadius: '12px',
    minWidth: '21px', textAlign: 'center', flexShrink: 0, lineHeight: '20px',
  },

  // ── Main chat
  mainChat: {
    flex: 1, display: 'flex', flexDirection: 'column',
    height: '100%', overflow: 'hidden', minWidth: 0,
  },

  // ── Chat header
  chatHeader: {
    backgroundColor: '#202c33',
    borderBottom: '1px solid #2a3942',
    flexShrink: 0, zIndex: 10,
  },
  chatHeaderContent: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px 8px 8px',
    height: '64px', gap: '4px',
  },
  chatHeaderLeft: {
    display: 'flex', alignItems: 'center',
    gap: '6px', flex: 1, minWidth: 0,
  },
  backButton: {
    background: 'transparent', border: 'none', color: '#aebac1',
    cursor: 'pointer', padding: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '40px', height: '40px', flexShrink: 0,
  },
  headerAvatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    backgroundColor: '#2a3942',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#8696a0', flexShrink: 0, cursor: 'pointer',
    position: 'relative',
  },
  headerAvatarOnline: {
    position: 'absolute', bottom: '1px', right: '1px',
    width: '11px', height: '11px', backgroundColor: '#25d366',
    border: '2px solid #202c33', borderRadius: '50%',
  },
  headerInfo: {
    display: 'flex', flexDirection: 'column',
    gap: '1px', minWidth: 0, flex: 1, cursor: 'pointer',
  },
  headerName: {
    margin: 0, fontSize: '16px', fontWeight: 500,
    color: '#e9edef', lineHeight: '21px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  headerStatus: { fontSize: '13px', color: '#8696a0', lineHeight: '18px' },
  headerStatusOnline: { fontSize: '13px', color: '#25d366', lineHeight: '18px' },
  chatHeaderRight: {
    display: 'flex', alignItems: 'center', gap: '0px', flexShrink: 0,
  },
  iconButton: {
    background: 'transparent', border: 'none', color: '#aebac1',
    cursor: 'pointer', padding: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '40px', height: '40px',
  },

  // ── Messages
  messagesContainer: {
    flex: 1, overflowY: 'auto', overflowX: 'hidden',
    minHeight: 0, padding: '8px 0',
  },

  // ── Typing indicator
  typingIndicator: {
    padding: '4px 16px 8px',
    display: 'flex', alignItems: 'center',
    gap: '8px', backgroundColor: 'transparent', flexShrink: 0,
  },
  typingBubble: {
    backgroundColor: '#202c33', borderRadius: '12px 12px 12px 0',
    padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
    display: 'flex', alignItems: 'center', gap: '4px',
  },
  typingDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    backgroundColor: '#8696a0', display: 'inline-block',
  },
  typingLabel: { fontSize: '13px', color: '#8696a0', fontStyle: 'italic' },

  // ── Input
  inputContainer: {
    backgroundColor: '#202c33',
    borderTop: '1px solid #2a3942',
    flexShrink: 0,
  },

  // ── Empty state
  emptyState: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0b141a', color: '#8696a0', gap: '16px',
  },
  emptyStateIcon: {
    width: '80px', height: '80px', borderRadius: '50%',
    backgroundColor: '#202c33',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#3c5260',
  },
  emptyStateText: { fontSize: '15px', color: '#8696a0', textAlign: 'center' },
  emptyStateTitle: {
    fontSize: '22px', fontWeight: 300, color: '#d1d7db',
    margin: 0, letterSpacing: '-0.3px',
  },

  // ── Connection badge
  connectionDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    display: 'inline-block', marginRight: '5px',
    animation: 'pulse 2s infinite',
  },

  // ── Sections label
  sectionLabel: {
    fontSize: '12px', fontWeight: 600, color: '#8696a0',
    textTransform: 'uppercase' as const, letterSpacing: '0.8px',
    padding: '14px 16px 6px',
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ChatWindow = () => {
  const {
    getMessages,
    onlineCount,
    connectionStatus,
    currentUser,
    isTyping,
    typingUser,
    sendPrivateMessage,
    setActiveConversation,
    notifyTyping,
    notifyStopTyping,
  } = useChat();

  const [selectedContact, setSelectedContact] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileView, setMobileView] = useState<'contacts' | 'chat'>('contacts');
  const [isMobile, setIsMobile] = useState(false);
  const [animClass, setAnimClass] = useState('');

  const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId') || '';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    UserService.getContacts(userId).then(res => {
      const raw: IdName[] = res.data?.result ?? [];
      const mapped: Contact[] = raw.map((c) => ({ id: c.id, name: c.name }));
      setContacts(mapped);
      if (mapped.length > 0) {
        setSelectedContact(mapped[0].id);
        setActiveConversation(mapped[0].id);
      }
    });
  }, [setActiveConversation, userId]);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact.id);
    setActiveConversation(contact.id);
    if (isMobile) {
      setAnimClass('mobile-slide-chat');
      setMobileView('chat');
    }
  };

  const handleBackToContacts = () => {
    setAnimClass('mobile-slide-contacts');
    setMobileView('contacts');
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedContact) return;
    try {
      await sendPrivateMessage(selectedContact, message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleLogout = async () => {
    const id = sessionStorage.getItem('userId') || localStorage.getItem('userId') || '';
    await UserService.logOut(id).then(() => window.location.reload());
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case ConnectionStatus.Connected: return '#25d366';
      case ConnectionStatus.Connecting:
      case ConnectionStatus.Reconnecting: return '#ffa000';
      case ConnectionStatus.Disconnected:
      case ConnectionStatus.ConnectionFailed: return '#ff5252';
      default: return '#9e9e9e';
    }
  };

  const isConnected = connectionStatus === ConnectionStatus.Connected;
  const currentMessages = getMessages(selectedContact);
  const selectedContactData = contacts.find(c => c.id === selectedContact);

  // ── Contact List JSX ───────────────────────────────────────────────────────
  const contactListJSX = (
    <>
      {/* Header */}
      <div style={styles.sidebarHeader}>
        <div style={styles.sidebarHeaderLeft}>
          <div style={styles.userAvatarWrapper} onClick={handleLogout} className="icon-btn">
            <UserIcon size={22} />
          </div>
          <h2 style={styles.sidebarTitle}>My Chat</h2>
        </div>
        <div style={styles.sidebarHeaderRight}>
          <button style={styles.sidebarIconButton} className="icon-btn" title="New chat">
            <NewChatIcon />
          </button>
          <button style={styles.sidebarIconButton} className="icon-btn" title="Menu">
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <SearchIcon size={18} />
          <input
            type="text"
            placeholder="Search or start new chat"
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Connection status strip */}
      {!isConnected && (
        <div style={{
          backgroundColor: '#2a3942', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
        }}>
          <div style={{ ...styles.connectionDot, backgroundColor: getConnectionColor() }} />
          <span style={{ fontSize: '13px', color: '#8696a0' }}>
            {connectionStatus}...
          </span>
        </div>
      )}

      {/* Contacts */}
      <div style={styles.contactsList}>
        {contacts.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8696a0', fontSize: '14px' }}>
            No contacts found
          </div>
        ) : (
          contacts.map((contact, idx) => {
            const isSelected = selectedContact === contact.id;
            const isLast = idx === contacts.length - 1;
            return (
              <div key={contact.id}>
                <div
                  className="contact-item"
                  style={{
                    ...styles.contactItem,
                    backgroundColor: isSelected ? '#2a3942' : 'transparent',
                  }}
                  onClick={() => handleContactSelect(contact)}
                >
                  {/* Avatar */}
                  <div style={styles.contactAvatar}>
                    <UserIcon size={26} />
                    {contact.online && <div style={styles.onlineDot} />}
                  </div>

                  {/* Info */}
                  <div style={isLast ? styles.contactInfoLast : styles.contactInfo}>
                    <div style={styles.contactHeader}>
                      <h3 style={styles.contactName}>{contact.name}</h3>
                      <span style={contact.unread ? styles.contactTimeUnread : styles.contactTime}>
                        {contact.time ?? ''}
                      </span>
                    </div>
                    <div style={styles.contactFooter}>
                      <p style={contact.unread ? styles.lastMessageUnread : styles.lastMessage}>
                        {contact.lastMessage ?? 'Tap to start chatting'}
                      </p>
                      {contact.unread && contact.unread > 0 ? (
                        <div style={styles.unreadBadge}>{contact.unread}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  // ── Chat Area JSX ──────────────────────────────────────────────────────────
  const chatAreaJSX = (onBack?: () => void) => (
    <>
      {/* Header */}
      <div style={styles.chatHeader}>
        <div style={styles.chatHeaderContent}>
          <div style={styles.chatHeaderLeft}>
            {/* Back button (mobile) or toggle (desktop) */}
            <button
              style={styles.backButton}
              className="icon-btn"
              onClick={onBack ?? (() => setShowSidebar(!showSidebar))}
            >
              <BackArrowIcon />
            </button>

            {/* Avatar */}
            <div style={styles.headerAvatar}>
              <UserIcon size={22} />
              {selectedContactData?.online && (
                <div style={styles.headerAvatarOnline} />
              )}
            </div>

            {/* Name + status */}
            <div style={styles.headerInfo}>
              <h1 style={styles.headerName}>
                {selectedContactData?.name ?? 'Select a contact'}
              </h1>
              {selectedContactData ? (
                <span style={selectedContactData.online ? styles.headerStatusOnline : styles.headerStatus}>
                  {selectedContactData.online
                    ? 'online'
                    : isConnected
                      ? `${onlineCount} online`
                      : connectionStatus}
                </span>
              ) : null}
            </div>
          </div>

          {/* Action icons */}
          <div style={styles.chatHeaderRight}>
            <button style={styles.iconButton} className="icon-btn" title="Voice call">
              <PhoneIcon />
            </button>
            <button style={styles.iconButton} className="icon-btn" title="Video call">
              <VideoIcon />
            </button>
            <button style={styles.iconButton} className="icon-btn" title="Search">
              <SearchIcon />
            </button>
            <button style={styles.iconButton} className="icon-btn" title="Menu">
              <DotsIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer} className="chat-bg">
        <MessageList
          messages={currentMessages}
          currentUserId={currentUser?.userId ?? ''}
        />
      </div>

      {/* Typing indicator */}
      {isTyping && typingUser && (
        <div style={{ ...styles.typingIndicator, backgroundColor: '#0b141a' }}>
          <div style={styles.typingBubble}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                style={{
                  ...styles.typingDot,
                  animation: `typingBounce 1.4s infinite ease-in-out ${delay}s`,
                }}
              />
            ))}
          </div>
          <span style={styles.typingLabel}>{typingUser} is typing</span>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputContainer}>
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={() => notifyTyping(selectedContact)}
          onStopTyping={() => notifyStopTyping(selectedContact)}
          disabled={!isConnected}
        />
      </div>
    </>
  );

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={styles.appContainer}>
        <Animations />

        {/* Contacts screen */}
        <div
          style={{
            ...styles.mobileScreen,
            transform: mobileView === 'contacts' ? 'translateX(0)' : 'translateX(-100%)',
            opacity: mobileView === 'contacts' ? 1 : 0,
            pointerEvents: mobileView === 'contacts' ? 'all' : 'none',
            zIndex: mobileView === 'contacts' ? 2 : 1,
          }}
        >
          {contactListJSX}
        </div>

        {/* Chat screen */}
        <div
          style={{
            ...styles.mobileScreen,
            transform: mobileView === 'chat' ? 'translateX(0)' : 'translateX(100%)',
            opacity: mobileView === 'chat' ? 1 : 0,
            pointerEvents: mobileView === 'chat' ? 'all' : 'none',
            zIndex: mobileView === 'chat' ? 2 : 1,
          }}
        >
          {chatAreaJSX(handleBackToContacts)}
        </div>
      </div>
    );
  }

  // ── Desktop layout ─────────────────────────────────────────────────────────
  return (
    <div style={styles.appContainer}>
      <Animations />

      {showSidebar && (
        <aside style={styles.sidebar}>
          {contactListJSX}
        </aside>
      )}

      <main style={styles.mainChat}>
        {selectedContact
          ? chatAreaJSX()
          : (
            <div style={{ ...styles.emptyState, className: 'chat-bg' } as CSSProperties}>
              <div style={styles.emptyStateIcon}>
                <NewChatIcon />
              </div>
              <div>
                <p style={styles.emptyStateTitle}>My Chat Web</p>
                <p style={styles.emptyStateText}>Select a contact to start chatting</p>
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default ChatWindow;