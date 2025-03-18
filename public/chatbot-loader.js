document.addEventListener('DOMContentLoaded', function () {
    const chatbotContainer = document.getElementById("chatbot-container");
    if (chatbotContainer) return;
  
    const newChatbotContainer = document.createElement("div");
    newChatbotContainer.id = "chatbot-container";
    document.body.appendChild(newChatbotContainer);
  
    const reactScript = document.createElement("script");
    reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
    reactScript.onload = () => {
      const reactDomScript = document.createElement("script");
      reactDomScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
      // reactDomScript.onload = () => {
      //   const chatbotScript = document.createElement("script");
      //   chatbotScript.src = "http://localhost:5000/chatbot-widget.js";
      //   document.body.appendChild(chatbotScript);
      // };
      // document.body.appendChild(reactDomScript);
    };
    document.body.appendChild(reactScript);
  });
  