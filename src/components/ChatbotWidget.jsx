import React, { useState, useEffect } from "react";
import "./ChatbotWidget.css"; // 引入 CSS

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({
        x: window.innerWidth - 70,
        y: window.innerHeight - 70,
    });

    useEffect(() => {
        const handleResize = () => {
            setPosition({
                x: window.innerWidth - 70,
                y: window.innerHeight - 70,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
            <div
                className="chatbot-icon"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>click</span>
            </div>
            {isOpen && (
                <div className="chatbot-container">
                    <iframe src="http://localhost:5000" title="Chatbot"></iframe>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
