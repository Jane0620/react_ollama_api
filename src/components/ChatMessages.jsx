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
      const userMessages = messagesContainer.querySelectorAll(".user-message");
      const containerHeight = messagesContainer.clientHeight;

      userMessages.forEach((message) => {
        const messageRect = message.getBoundingClientRect();
        const messageTop =
          messageRect.top - messagesContainer.getBoundingClientRect().top;
        const relativePosition = Math.max(
          0,
          Math.min(100, (messageTop / containerHeight) * 100)
        );
        message.style.backgroundPosition = `${relativePosition}% 50%`;
      });
    };

    messagesContainer.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      messagesContainer.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  const handleCopyCode = (e) => {
    const code = e.target.nextSibling.textContent;
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.sender === "user" ? "user-message" : "ai-message"
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ node, children }) {
                // 直接返回子元素，不生成 <p>
                return <>{children}</>;
              },
              pre({ node, children, ...props }) {
                return (
                  <div className="code-block">
                    {children}
                    <button onClick={handleCopyCode} className="copy-button">
                      複製
                    </button>
                  </div>
                );
              },
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
                      copy
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