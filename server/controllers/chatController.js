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
    const requestData = prepareRequestData(userMessage);
    requestData.stream = true;

    const ollamaResponse = await axios.post(
      `${config.OLLAMA_ENDPOINT}/api/chat`,
      requestData,
      { responseType: "stream" }
    );

    ollamaResponse.data.on("data", (chunk) => {
      const jsonData = chunk.toString();
      try {
        const parsedData = JSON.parse(jsonData);
        if (parsedData.message?.content) {
          res.write(`data: ${parsedData.message.content}\n\n`);
        }
      } catch (err) {
        console.error("解析流式回應失敗:", err.message);
      }
    });

    ollamaResponse.data.on("end", () => {
      res.write("data: [END]\n\n");
      res.end();
    });
  } catch (error) {
    console.error("Error calling Ollama API:", error.message);
    res.write("data: [ERROR]\n\n");
    res.end();
  }
  // 修改 streamChatResponse 解析邏輯
  const parsedData = JSON.parse(jsonData);
  if (parsedData.done) {
    res.write("data: [END]\n\n");
    res.end();
  } else if (parsedData.message?.content) {
    // 轉義特殊字符
    const escapedContent = parsedData.message.content
      .replace(/\n/g, "\\n") // 保留換行符
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
    res.write(`data: ${JSON.stringify({ content: escapedContent })}\n\n`);
  }

  // 在後端流式回應處理中增加HTML結構驗證
  const validateHTMLStructure = (content) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.querySelector('p > div') === null;
  };
}

module.exports = { getChatResponse, streamChatResponse };
