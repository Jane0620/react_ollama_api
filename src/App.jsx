import { useState } from "react";
import React from "react";
import "./App.css";

const functionUrl = "http://localhost:5000/chat"; // Express 後端 API

function App() {
  const [newInputValue, setNewInputValue] = useState(""); // 用戶輸入框的狀態
  const [messages, setMessages] = useState([]); // 訊息狀態
  // const [aiResponse, setAiResponse] = useState(""); // 暫存 AI 回應

  // 發送請求並處理 AI 回應
  const newMessage = async (e) => {
    e.preventDefault();
    if (!newInputValue.trim()) return; // 防止發送空訊息

    // 更新 UI，顯示用戶訊息
    const newMessages = [...messages, { text: newInputValue, sender: "user" }];
    setMessages(newMessages);
    setNewInputValue(""); // 清空輸入框

    // setAiResponse(""); // 清空之前的 AI 回應

    try {
      const eventSource = new EventSource(`${functionUrl}?message=${encodeURIComponent(newInputValue)}`);
      
      // 添加一個空的AI訊息，之後我們會更新它
      setMessages(prevMessages => [...prevMessages, { sender: "ai", text: "" }]);
      let accumulatedResponse = "";
      
      eventSource.onmessage = (event) => {
        if (event.data === "[END]") {
          eventSource.close();
          return;
        }
        
        // 更新累積的回應
        accumulatedResponse += event.data;
        
        // 只更新最後一條訊息，也就是AI回應
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = { 
            sender: "ai", 
            text: accumulatedResponse 
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
      <div>
        {messages.map((message, index) => (
          <p key={index} className={"message " + message.sender}>{message.text}</p>
        ))}
      </div>
      <form className="input-form" onSubmit={newMessage}>
        <input
          type="text"
          placeholder="Message"
          value={newInputValue}
          onChange={(e) => setNewInputValue(e.target.value)}
        />
        <input className="glow-on-hover" type="submit" value="Send" />
      </form>
    </main>
  );
}

export default App;
