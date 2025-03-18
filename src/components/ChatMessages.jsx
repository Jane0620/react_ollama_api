import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatMessages.css"; // 如果需要樣式，建議獨立出來

function ChatMessages({ messages }) {
  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender === "ai" ? "ai-message" : "user-message"}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;
