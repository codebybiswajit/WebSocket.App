import type { CSSProperties } from "react";
import type { Message } from "../../Types/CommonTypes";
import type ThemeConfig from "../../Utils/ThemeConfig";

// Message Bubble Component
const MessageBubble = ({ message, colors }: { message: Message; colors: typeof ThemeConfig.light }) => {
    const messageStyle: CSSProperties = {
        display: 'flex',
        gap: '1rem',
        flexDirection: message.sent ? 'row-reverse' : 'row',
    };

    const avatarStyle: CSSProperties = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        flexShrink: 0,
    };

    const contentStyle: CSSProperties = {
        background: message.sent
            ? `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.bgGradientEnd})`
            : colors.glassBg,
        padding: '1rem 1.25rem',
        borderRadius: '18px',
        maxWidth: '70%',
        backdropFilter: 'blur(10px)',
        color: message.sent ? 'white' : colors.textPrimary,
    };

    const textStyle: CSSProperties = {
        marginBottom: '0.5rem',
    };

    const timeStyle: CSSProperties = {
        fontSize: '0.75rem',
        opacity: 0.7,
    };

    return (
        <div style={messageStyle}>
            <img src={message.avatar} alt="Avatar" style={avatarStyle} />
            <div style={contentStyle}>
                <div style={textStyle}>{message.text}</div>
                <div style={timeStyle}>{message.time}</div>
            </div>
        </div>
    );
}
export default MessageBubble;