import type { CSSProperties } from "react";
import type { Message } from "../../Types/CommonTypes";
import type ThemeConfig from "../../Utils/ThemeConfig";
import MessageBubble from "./MessageBubble";

// Chat Preview Component
const ChatPreview = ({
  messages,
  colors,
}: {
  messages: Message[];
  colors: typeof ThemeConfig.light;
}) => {
  const previewStyle: CSSProperties = {
    margin: "4rem auto",
    maxWidth: "900px",
    borderRadius: "24px",
    overflow: "hidden",
    background: colors.glassBg,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid ${colors.glassBorder}`,
    boxShadow: `0 8px 32px ${colors.glassShadow}`,
  };

  const headerStyle: CSSProperties = {
    padding: "1.5rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    borderBottom: `1px solid ${colors.glassBorder}`,
  };

  const avatarStyle: CSSProperties = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, #667eea, #764ba2)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: "1.2rem",
  };

  const infoStyle: CSSProperties = {
    flex: 1,
  };

  const nameStyle: CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.2rem",
    marginBottom: "0.25rem",
  };

  const statusStyle: CSSProperties = {
    color: colors.textTertiary,
    fontSize: "0.9rem",
  };

  const messagesContainerStyle: CSSProperties = {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    maxHeight: "400px",
    overflowY: "auto",
  };

  return (
    <div style={previewStyle}>
      <div style={headerStyle}>
        <div style={avatarStyle}>SM</div>
        <div style={infoStyle}>
          <h3 style={nameStyle}>Sarah Miller</h3>
          <p style={statusStyle}>Active now</p>
        </div>
      </div>
      <div style={messagesContainerStyle}>
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} colors={colors} />
        ))}
      </div>
    </div>
  );
};
export default ChatPreview;
