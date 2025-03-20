import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatMessages.css";

function ChatMessages({ messages }) {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    // 滾動事件處理函數
    const handleScroll = () => {
      // 獲取所有用戶消息元素
      const userMessages = messagesContainer.querySelectorAll('.user-message');

      // 獲取可視區域高度
      const containerHeight = messagesContainer.clientHeight;
      const containerScrollTop = messagesContainer.scrollTop;

      // 遍歷每條用戶消息
      userMessages.forEach(message => {
        // 計算消息在可視區域中的位置
        const messageRect = message.getBoundingClientRect();
        const messageTop = messageRect.top - messagesContainer.getBoundingClientRect().top;

        // 計算消息在可視區域的相對位置 (0-100%)
        const relativePosition = Math.max(0, Math.min(100,
          (messageTop / containerHeight) * 100));

        // 根據相對位置設置背景位置
        message.style.backgroundPosition = `${relativePosition}% 50%`;
      });
    };

    // 添加滾動事件監聽器
    messagesContainer.addEventListener('scroll', handleScroll);

    // 初始化執行一次，確保初始狀態也有效果
    handleScroll();

    // 清理函數
    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, [messages]); // 當消息更新時重新運行

  // 前端添加代碼複製功能
  const handleCopyCode = (e) => {
    const code = e.target.nextSibling.textContent;
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (inline) {
                  return (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="code-block">
                    <code {...props}>{children}</code>
                    <button onClick={handleCopyCode} className="copy-button">
                      複製
                    </button>
                  </pre>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;