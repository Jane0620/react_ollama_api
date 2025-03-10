import React, { useState } from "react";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatbotWidget from "./components/ChatbotWidget";
import "./App.css";

const functionUrl = import.meta.env.VITE_API_URL;

function App() {
  const [messages, setMessages] = useState([]);
  
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

  return (
    <main>
      <h1>Practice Chat Bot</h1>
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={sendMessage} />

      <ChatbotWidget />
    </main>
  );
}

export default App;
