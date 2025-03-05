const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors()); // 允許前端請求
app.use(express.json());

// 提供 React 前端靜態文件
app.use(express.static(path.join(__dirname, "../dist")));

// 提供 chatbot-widget.js 和 chatbot-loader.js
app.use(express.static(path.join(__dirname, "../public")));

// Chat API，處理 EventSource 連線
app.get("/chat", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const userMessage = req.query.message;
  if (!userMessage) {
    res.write("data: 請輸入內容\n\n");
    res.end();
    return;
  }

  // 呼叫 Ollama 來產生 AI 回應
  const ollamaProcess = spawn("ollama", ["run", "jslin/gemma2-it-tw:2b"], { shell: true });

  ollamaProcess.stdin.write(userMessage + "\n");
  ollamaProcess.stdin.end();

  ollamaProcess.stdout.on("data", (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  ollamaProcess.on("close", () => {
    res.write("data: [END]\n\n");
    res.end();
  });
});

// 捕捉所有未匹配的路由，回傳 React 頁面
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// 啟動伺服器
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
