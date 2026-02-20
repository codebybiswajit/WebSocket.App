import { useContext } from "react";
import { ChatContext } from "./ChatContextObject";

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
};
