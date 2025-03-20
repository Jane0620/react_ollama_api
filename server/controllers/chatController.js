// chatController.js
const axios = require("axios");
const config = require("../config/ollama.config"); // 引入配置文件

/**
 * 預備請求參數的函數
 */
function prepareRequestData(userMessage) {
  return {
    model: config.MODEL_NAME,
    messages: [
      { role: "system", content: config.SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  };
}

/**
 * 與 Ollama API 進行請求，回傳完整 JSON
 */
async function getChatResponse(req, res) {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "請輸入內容" });
  }

  try {
    const requestData = prepareRequestData(userMessage);
    const ollamaResponse = await axios.post(
      `${config.OLLAMA_ENDPOINT}/api/chat`,
      requestData
    );

    const aiResponse = ollamaResponse.data.message.content;
    res.send(aiResponse); // 只回傳 `content`
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    res.status(500).json({ error: "Ollama API 呼叫失敗" });
  }
}

/**
 * 透過 SSE (Server-Sent Events) 進行流式回應
 */
async function streamChatResponse(req, res) {
  try {
    const userMessage = req.query.message; // 從查詢參數中獲取訊息
    if (!userMessage) {
      res.status(400).write("data: 請提供訊息\n\n");
      res.end();
      return;
    }

    // 設定 SSE Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 向客戶端發送初始訊息
    console.log(res.write("data: 連線成功，開始處理訊息\n\n"));

    // 準備請求數據
    const requestData = prepareRequestData(userMessage);

    // 呼叫 Ollama API
    const response = await axios.post(
      `${config.OLLAMA_ENDPOINT}/api/chat`,
      requestData,
      {
        responseType: "stream", // 確保以流的方式接收回應
      }
    );

    // 處理流式回應
    response.data.on("data", (chunk) => {
      const data = chunk.toString();
      try {
        const parsedChunk = JSON.parse(data); // 假設每個 chunk 是 JSON 格式
        if (parsedChunk.done) {
          res.write("data: [END]\n\n");
          res.end();
        } else if (parsedChunk.message?.content) {
          res.write(`data: ${parsedChunk.message.content}\n\n`);
        }
      } catch (err) {
        console.error("解析流式回應時發生錯誤:", err);
      }
    });

    response.data.on("end", () => {
      res.write("data: [END]\n\n");
      res.end();
    });

    response.data.on("error", (err) => {
      console.error("流式回應錯誤:", err);
      res.write("data: [ERROR]\n\n");
      res.end();
    });
  } catch (error) {
    console.error("處理 SSE 時發生錯誤:", error);
    res.status(500).write("data: 伺服器錯誤\n\n");
    res.end();
  }
}

module.exports = { getChatResponse, streamChatResponse };
