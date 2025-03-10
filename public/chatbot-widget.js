const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({
      x: window.innerWidth - 70,
      y: window.innerHeight - 70,
  });

  // 監聽視窗大小變化
  React.useEffect(() => {
      const handleResize = () => {
          setPosition((prev) => ({
              x: window.innerWidth - 70,
              y: window.innerHeight - 70,
          }));
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                  backgroundColor: "#f76f91",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  cursor: "pointer",
                  userSelect: "none",
                  zIndex: 1000,
              },
              onClick: () => setIsOpen(!isOpen),
          }
      ),
      isOpen &&
          React.createElement(
              "div",
              {
                  style: {
                      position: "fixed",
                      bottom: "80px",
                      right: "20px",
                      width: "400px",
                      height: "600px",
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
