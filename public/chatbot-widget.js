const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: window.innerWidth - 70, y: window.innerHeight - 70 });
  
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            left: position.x + "px",
            top: position.y + "px",
            width: "50px",
            height: "50px",
            backgroundColor: "#007bff",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            cursor: "pointer", // 改為 pointer 游標，讓它看起來可點擊
            userSelect: "none",
            zIndex: 1000,
          },
          onClick: () => setIsOpen(!isOpen),
        },
        React.createElement("img", {
          src: "test.png", // 圖示檔案路徑
          alt: "Chatbot Icon", // 提供圖片的替代文字
          style: {
            width: "50px", // 圖片寬度，可以根據需要調整
            height: "50px", // 圖片高度，與寬度保持一致以保持圓形外觀
          },
        })
      ),
      isOpen &&
        React.createElement(
          "div",
          {
            style: {
              position: "fixed",
              bottom: "80px",
              right: "20px",
              width: "300px",
              height: "400px",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 999,
            },
          },
          React.createElement("iframe", {
            src: "http://localhost:5000",
            style: { width: "100%", height: "100%", border: "none" },
          })
        )
    );
  };
  
  const container = document.getElementById("chatbot-container");
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(ChatbotWidget));
  