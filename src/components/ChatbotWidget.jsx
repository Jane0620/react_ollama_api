import React, { useState } from "react";
import { ChatInput } from "./ChatInput"; 
import ChatMessages from "./ChatMessages"; 
import "./ChatbotWidget.css";

const functionUrl = import.meta.env.VITE_API_URL;

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false); // 控制視窗顯示狀態

  // 發送訊息給後端
  const sendMessage = (userMessage) => {
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    try {
      const eventSource = new EventSource(`${functionUrl}?message=${encodeURIComponent(userMessage)}`);

      // 添加一個空的 AI 訊息，之後會更新
      setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
      let accumulatedResponse = "";

      eventSource.onmessage = (event) => {
        if (event.data === "[END]") {
          eventSource.close();
          return;
        }

        accumulatedResponse += event.data;
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            sender: "ai",
            text: accumulatedResponse,
          };
          return updatedMessages;
        });
      };

      eventSource.onerror = () => {
        console.error("SSE 連線錯誤");
        eventSource.close();
      };
    } catch (error) {
      console.error("發送訊息時發生錯誤:", error);
    }
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // 切換視窗顯示狀態
  };

  return (
    <>
      <button className="chatbot-toggle fixed-button" onClick={toggleVisibility}>
        {isVisible ? "close" : "open"}
      </button>
      {isVisible && (
        <div className="top-left-window">
          <div className="chatbot-header">
            <h3>Chat Bot</h3>
          </div>
          
            <ChatMessages messages={messages} />
          
          <div className="chat-input-container">
            <ChatInput onSendMessage={sendMessage} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
