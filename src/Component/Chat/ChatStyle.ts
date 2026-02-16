// ChatStyles.ts

// ChatStyles.ts
import type { CSSProperties } from 'react';

interface ChatStylesType {
    // App Container
    appContainer: CSSProperties;

    // Chat Container
    chatContainer: CSSProperties;

    // Header
    chatHeader: CSSProperties;
    title: CSSProperties;
    headerInfo: CSSProperties;
    onlineCount: CSSProperties;
    connectionStatus: CSSProperties;
    connected: CSSProperties;
    connecting: CSSProperties;
    disconnected: CSSProperties;

    // Message List
    messageList: CSSProperties;
    message: CSSProperties;
    ownMessage: CSSProperties;
    systemMessage: CSSProperties;
    messageHeader: CSSProperties;
    username: CSSProperties;
    usernameOwn: CSSProperties;
    timestamp: CSSProperties;
    timestampOwn: CSSProperties;
    messageText: CSSProperties;
    messageTextOwn: CSSProperties;

    // Typing Indicator
    typingIndicator: CSSProperties;

    // Message Form
    messageForm: CSSProperties;
    messageInput: CSSProperties;
    messageInputDisabled: CSSProperties;
    sendButton: CSSProperties;
    sendButtonDisabled: CSSProperties;

    // Modal
    modal: CSSProperties;
    modalContent: CSSProperties;
    modalTitle: CSSProperties;
    modalForm: CSSProperties;
    usernameInput: CSSProperties;
    error: CSSProperties;
    joinButton: CSSProperties;
}

const ChatStyles: ChatStylesType = {
    // ============================================
    // APP CONTAINER
    // ============================================
    appContainer: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },

    // ============================================
    // CHAT CONTAINER
    // ============================================
    chatContainer: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '800px',
        height: '90vh',
        maxHeight: '700px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: '0 auto',
    },

    // ============================================
    // HEADER
    // ============================================
    chatHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },

    title: {
        fontSize: '24px',
        fontWeight: 600,
        margin: 0,
    },

    headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '5px',
    },

    onlineCount: {
        fontSize: '14px',
        opacity: 0.9,
    },

    connectionStatus: {
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '4px',
        background: 'rgba(255, 255, 255, 0.2)',
        textTransform: 'capitalize',
    },

    connected: {
        background: 'rgba(76, 175, 80, 0.8)',
    },

    connecting: {
        background: 'rgba(255, 193, 7, 0.8)',
    },

    disconnected: {
        background: 'rgba(244, 67, 54, 0.8)',
    },

    // ============================================
    // MESSAGE LIST
    // ============================================
    messageList: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        // background: '#f5f5f5',
    },

    message: {
        marginBottom: '15px',
        padding: '12px 15px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },

    ownMessage: {
        marginBottom: '15px',
        padding: '12px 15px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginLeft: 'auto',
        maxWidth: '70%',
    },

    systemMessage: {
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.05)',
        color: '#666',
        fontSize: '13px',
        fontStyle: 'italic',
        padding: '8px',
        marginBottom: '10px',
        borderRadius: '4px',
    },

    messageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
    },

    username: {
        color: '#667eea',
        fontSize: '14px',
        fontWeight: 600,
    },

    usernameOwn: {
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
    },

    timestamp: {
        color: '#999',
        fontSize: '12px',
    },

    timestampOwn: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px',
    },

    messageText: {
        color: '#333',
        fontSize: '15px',
        wordWrap: 'break-word',
    },

    messageTextOwn: {
        color: 'white',
        fontSize: '15px',
        wordWrap: 'break-word',
    },

    // ============================================
    // TYPING INDICATOR
    // ============================================
    typingIndicator: {
        padding: '10px 20px',
        color: '#666',
        fontSize: '13px',
        fontStyle: 'italic',
        background: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
    },

    // ============================================
    // MESSAGE FORM
    // ============================================
    messageForm: {
        display: 'flex',
        padding: '20px',
        // background: 'white',
        borderTop: '1px solid #e0e0e0',
    },

    messageInput: {
        flex: 1,
        padding: '12px 15px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
        transition: 'border-color 0.3s',
        outline: 'none',
    },

    messageInputDisabled: {
        flex: 1,
        padding: '12px 15px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
        background: '#f5f5f5',
        cursor: 'not-allowed',
    },

    sendButton: {
        marginLeft: '10px',
        padding: '12px 25px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },

    sendButtonDisabled: {
        marginLeft: '10px',
        padding: '12px 25px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 600,
        opacity: 0.5,
        cursor: 'not-allowed',
    },

    // ============================================
    // MODAL
    // ============================================
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modalContent: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
    },

    modalTitle: {
        marginBottom: '20px',
        color: '#333',
        fontSize: '24px',
        fontWeight: 600,
    },

    modalForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },

    usernameInput: {
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '16px',
        fontFamily: 'inherit',
        transition: 'border-color 0.3s',
        outline: 'none',
    },

    error: {
        color: '#d32f2f',
        fontSize: '14px',
        marginTop: '-10px',
    },

    joinButton: {
        padding: '12px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
};

export default ChatStyles;