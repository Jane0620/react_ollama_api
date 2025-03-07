const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../public")));

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "請輸入內容" });
  }

  try {
    const ollamaResponse = await axios.post("http://localhost:11434/api/chat", {
      model: "jslin/gemma2-it-tw:2b", // 你的模型名稱
      messages: [
        { role: "system", content: "你是一個專業的 AI 助手，請用簡單易懂的方式回答問題。" }, // 加入提示詞
        { role: "user", content: userMessage }
      ]
    });

    // 只回傳 AI 回應的 `content`
    const aiResponse = ollamaResponse.data.message.content;
    res.send(aiResponse); // 只回傳 `content`，而不是整個 JSON

  } catch (error) {
    console.error("Error calling Ollama API:", error);
    res.status(500).json({ error: "Ollama API 呼叫失敗" });
  }
});

app.get("/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const userMessage = req.query.message;
  if (!userMessage) {
    res.write("data: 請輸入內容\n\n");
    res.end();
    return;
  }

  try {
    const ollamaResponse = await axios.post("http://localhost:11434/api/chat", {
      model: "jslin/gemma2-it-tw:2b",
      messages: [
        { role: "system", content: "你是一個有趣的 AI 助手，請用輕鬆的語氣回答問題。" }, // 提示詞
        { role: "user", content: userMessage }
      ],
      stream: true, // 使用流式輸出
    }, { responseType: "stream" });

    // 監聽 Ollama 回應
    ollamaResponse.data.on("data", (chunk) => {
      const jsonData = chunk.toString();
      try {
        const parsedData = JSON.parse(jsonData);
        if (parsedData.message?.content) {
          res.write(`data: ${parsedData.message.content}\n\n`);
        }
      } catch (err) {
        console.error("解析流式回應失敗:", err);
      }
    });

    ollamaResponse.data.on("end", () => {
      res.write("data: [END]\n\n");
      res.end();
    });

  } catch (error) {
    console.error("Error calling Ollama API:", error);
    res.write("data: [ERROR]\n\n");
    res.end();
  }
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
