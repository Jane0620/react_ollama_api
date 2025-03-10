import React from "react";
import "./ChatMessages.css"; // 如果需要樣式，建議獨立出來

const ChatMessages = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <p key={index} className={`message ${message.sender}`}>
          {message.text}
        </p>
      ))}
    </div>
  );
};

export default ChatMessages;
