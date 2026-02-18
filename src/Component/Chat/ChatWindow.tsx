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

// ─── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#aebac1">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const DotsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#aebac1">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aebac1" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#aebac1" strokeWidth="2.5" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#aebac1">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const VideoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#aebac1">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

// ─── Global Styles ────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #374955; border-radius: 4px; }

    .cw-contact:hover { background-color: #2a3942 !important; }
    .cw-contact:active { background-color: #3c4f59 !important; }
    .cw-btn:hover { background-color: rgba(255,255,255,0.07) !important; border-radius: 50%; }
  `}</style>
);

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId') || '';

  // ── Responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Load contacts
  useEffect(() => {
    UserService.getContacts(userId).then(res => {
      const raw: IdName[] = res.data?.result ?? [];
      const mapped: Contact[] = raw.map(c => ({ id: c.id, name: c.name }));
      setContacts(mapped);
      if (mapped.length > 0) {
        setSelectedContact(mapped[0].id);
        setActiveConversation(mapped[0].id);
      }
    });
  }, [userId, setActiveConversation]);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact.id);
    setActiveConversation(contact.id);
    if (isMobile) setMobileView('chat');
  };

  const handleSendMessage = async (msg: string) => {
    if (!selectedContact) return;
    try { await sendPrivateMessage(selectedContact, msg); }
    catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    const id = sessionStorage.getItem('userId') || localStorage.getItem('userId') || '';
    await UserService.logOut(id);
    window.location.reload();
  };

  const isConnected = connectionStatus === ConnectionStatus.Connected;
  const connColor = {
    [ConnectionStatus.Connected]: '#25d366',
    [ConnectionStatus.Connecting]: '#ffa000',
    [ConnectionStatus.Reconnecting]: '#ffa000',
    [ConnectionStatus.Disconnected]: '#ff5252',
    [ConnectionStatus.ConnectionFailed]: '#ff5252',
  }[connectionStatus] ?? '#9e9e9e';

  const messages = getMessages(selectedContact);
  const activeContact = contacts.find(c => c.id === selectedContact);

  // ─────────────────────────────────────────────────────────────────────────
  // CONTACT LIST
  // ─────────────────────────────────────────────────────────────────────────
  const contactListJSX = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#111b21' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#202c33',
        padding: '0 16px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar / logout */}
          <div
            onClick={handleLogout}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#374955',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <UserIcon size={22} />
          </div>
          <span style={{ color: '#e9edef', fontSize: '18px', fontWeight: 600 }}>Chats</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="cw-btn" style={iconBtnStyle}><DotsIcon /></button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px', backgroundColor: '#111b21', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: '#202c33', borderRadius: '9px',
          padding: '9px 14px',
        }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search or start new chat"
            style={{
              flex: 1, background: 'transparent', border: 'none',
              outline: 'none', color: '#e9edef', fontSize: '15px',
            }}
          />
        </div>
      </div>

      {/* Connection warning */}
      {!isConnected && (
        <div style={{
          backgroundColor: '#2a3942', padding: '6px 16px',
          display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: connColor, animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: '#8696a0', fontSize: '13px' }}>{connectionStatus}</span>
        </div>
      )}

      {/* Contacts */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {contacts.length === 0 && (
          <p style={{ color: '#8696a0', textAlign: 'center', padding: '32px 16px', fontSize: '14px' }}>
            No contacts
          </p>
        )}
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="cw-contact"
            onClick={() => handleContactSelect(contact)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px', cursor: 'pointer',
              backgroundColor: selectedContact === contact.id ? '#2a3942' : 'transparent',
              transition: 'background-color 0.12s',
              borderBottom: '1px solid rgba(42,57,66,0.45)',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%',
              backgroundColor: '#374955', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <UserIcon size={26} />
              {contact.online && (
                <div style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  backgroundColor: '#25d366', border: '2px solid #111b21',
                }} />
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                <span style={{
                  color: '#e9edef', fontSize: '16px', fontWeight: 500,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '65%',
                }}>
                  {contact.name}
                </span>
                <span style={{ color: contact.unread ? '#25d366' : '#8696a0', fontSize: '12px', flexShrink: 0 }}>
                  {contact.time ?? ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  color: '#8696a0', fontSize: '14px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {contact.lastMessage ?? 'Tap to chat'}
                </span>
                {(contact.unread ?? 0) > 0 && (
                  <div style={{
                    backgroundColor: '#25d366', color: '#111b21',
                    fontSize: '12px', fontWeight: 700,
                    borderRadius: '12px', padding: '1px 7px',
                    minWidth: '20px', textAlign: 'center', marginLeft: '6px', flexShrink: 0,
                  }}>
                    {contact.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // CHAT AREA
  // ─────────────────────────────────────────────────────────────────────────
  const chatAreaJSX = (onBack?: () => void) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#202c33',
        height: '60px', flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 8px 0 4px', gap: '4px',
        borderBottom: '1px solid #2a3942',
      }}>
        {/* Back / toggle */}
        <button
          className="cw-btn"
          style={iconBtnStyle}
          onClick={onBack ?? (() => setShowSidebar(s => !s))}
        >
          <BackIcon />
        </button>

        {/* Avatar */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          backgroundColor: '#374955', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: '4px',
        }}>
          <UserIcon size={22} />
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: '#e9edef', fontSize: '16px', fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {activeContact?.name ?? 'Select a contact'}
          </div>
          <div style={{ color: '#8696a0', fontSize: '13px' }}>
            {isConnected ? (activeContact?.online ? 'online' : `${onlineCount} online`) : connectionStatus}
          </div>
        </div>

        {/* Action icons */}
        <button className="cw-btn" style={iconBtnStyle}><PhoneIcon /></button>
        <button className="cw-btn" style={iconBtnStyle}><VideoIcon /></button>
        <button className="cw-btn" style={iconBtnStyle}><SearchIcon /></button>
        <button className="cw-btn" style={iconBtnStyle}><DotsIcon /></button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', minHeight: 0,
        backgroundColor: '#0b141a',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23182229' fill-opacity='0.9'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        padding: '8px 4px',
      }}>
        <MessageList messages={messages} currentUserId={currentUser?.userId ?? ''} />
      </div>

      {/* Typing indicator */}
      {isTyping && typingUser && (
        <div style={{
          padding: '6px 16px', backgroundColor: '#0b141a',
          display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
        }}>
          <div style={{
            backgroundColor: '#202c33', borderRadius: '12px 12px 12px 0',
            padding: '8px 12px', display: 'flex', gap: '4px', alignItems: 'center',
          }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <span key={i} style={{
                width: '7px', height: '7px', borderRadius: '50%',
                backgroundColor: '#8696a0', display: 'inline-block',
                animation: `bounce 1.4s infinite ease-in-out ${d}s`,
              }} />
            ))}
          </div>
          <span style={{ color: '#8696a0', fontSize: '13px', fontStyle: 'italic' }}>
            {typingUser} is typing
          </span>
        </div>
      )}

      {/* Input */}
      <div style={{ backgroundColor: '#202c33', borderTop: '1px solid #2a3942', flexShrink: 0 }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={() => notifyTyping(selectedContact)}
          onStopTyping={() => notifyStopTyping(selectedContact)}
          disabled={!isConnected}
        />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  // MOBILE
  if (isMobile) {
    return (
      <div style={{ width: '100%', height: '100dvh', position: 'relative', overflow: 'hidden', backgroundColor: '#111b21' }}>
        <GlobalStyles />

        {/* Contacts screen */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: mobileView === 'contacts' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          zIndex: mobileView === 'contacts' ? 2 : 1,
        }}>
          {contactListJSX}
        </div>

        {/* Chat screen */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: mobileView === 'chat' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          zIndex: mobileView === 'chat' ? 2 : 1,
        }}>
          {chatAreaJSX(() => setMobileView('contacts'))}
        </div>
      </div>
    );
  }

  // DESKTOP
  return (
    <div style={{
      display: 'flex', width: '100%', height: '100vh',
      backgroundColor: '#111b21', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <GlobalStyles />

      {showSidebar && (
        <div style={{
          width: '380px', minWidth: '320px', flexShrink: 0,
          borderRight: '1px solid #222d34', height: '100%',
        }}>
          {contactListJSX}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
        {chatAreaJSX()}
      </div>
    </div>
  );
};

// ─── Shared style ─────────────────────────────────────────────────────────────

const iconBtnStyle: CSSProperties = {
  background: 'transparent', border: 'none',
  cursor: 'pointer', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '40px', height: '40px', flexShrink: 0,
};

export default ChatWindow;