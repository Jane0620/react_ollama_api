import React, { useState } from "react";
import "./ChatInput.css";

const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue(""); // 清空輸入框
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止默認換行行為
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input" onSubmit={handleSubmit}>
      <textarea
        type="text"
        placeholder="Message"
        cols={50}
        rows={3}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown} // 綁定鍵盤事件
      />
      <button type="submit">Send</button>
    </div>
  );
};

export { ChatInput }; // 確保命名匯出
