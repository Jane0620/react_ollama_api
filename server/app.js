const express = require("express");
const cors = require("cors");
const path = require("path");

const chatRoutes = require("./routes/chat.js");

const app = express();
app.use(cors());
app.use(express.json());

// 提供 React 前端靜態文件
app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../public")));

// 使用聊天路由
app.use("/chat", chatRoutes);

// 啟動伺服器
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
