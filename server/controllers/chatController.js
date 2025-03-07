const axios = require("axios");

/**
 * 與 Ollama API 進行請求，回傳完整 JSON
 */
// 定義處理 POST 請求的函數
async function getChatResponse(req, res) {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "請輸入內容" });
  }

  try {
    const ollamaResponse = await axios.post("http://localhost:11434/api/chat", {
      model: "jslin/gemma2-it-tw:2b", // 你的模型名稱
      messages: [
        {
          role: "system", "content": "## 角色\n你是公務機關內資深的公文收文人員，熟悉機關內各單位的掌管業務，並依據來文的內容準備將公文分派給權責單位進行處理。\n\n## 背景\n以下 <單位職掌表/> 內容記錄機關內所轄單位的職掌表，你將熟記此職掌表，理解各單位所承辦的工作內容、業務範圍：\n<單位職掌表>\n{\n  \"綜合規劃組\": [\"策略規劃\", \"法制協調\", \"管制考核\", \"資訊安全\"],\n  \"地方稅及徵課組\": [\"地方稅系統規劃、維護、輔導\", \"徵課管理系統規劃、維護、輔導\", \"稅務檔案彙整、運用\", \"資訊標準訂定、維護\"],\n  \"系統設計及資理組\": [\"資料處理、掃描、查調、登錄\", \"系統設計及測試\", \"辦公室自動化系統規劃、維護\"],\n  \"支援服務室\": [\"財政部管理資訊規劃、維護、輔導\"],\n  \"主計室\": [\"歲計\", \"會計\", \"統計\"],\n  \"政風室\": [\"政風查核\"],\n  \"國稅組\": [\"國稅系統規劃、維護、輔導\", \"共用服務—國稅戶政資訊運用系統規劃、維護\"],\n  \"資通營運組\": [\"電腦系統操作、管理\", \"程式館、資料庫管理\", \"網路規劃與管理\"],\n  \"電子發票組\": [\"電子發票業務規劃、應用、推廣、輔導\"],\n  \"秘書室\": [\"文書\", \"總務\", \"出納\"],\n  \"人事室\": [\"人事管理\"]\n}\n\n## 任務\n- 你會嘗試對來文內容進行解析，分析來文意圖並與各單位職掌進行比對，如果來文內容符合某單位職掌時，你會回覆該單位的名稱以便將公文指派給該單位處理\n- 如果你無法識別出公文內容屬於哪個單位的職掌時，你必須回覆你不知道，不做任何建議\n- *請注意* ：你只需要回覆指派給哪個單位即可，推理過程或喃喃自語都不必要。"
        },
        { role: "user", content: userMessage }
      ]
    });

    const aiResponse = ollamaResponse.data.message.content;
    res.send(aiResponse); // 只回傳 `content`

  } catch (error) {
    console.error("Error calling Ollama API:", error);
    res.status(500).json({ error: "Ollama API 呼叫失敗" });
  }
}

module.exports = { getChatResponse }; // 確保正確匯出

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
    const ollamaResponse = await axios.post("http://localhost:11434/api/chat", {
      model: "jslin/gemma2-it-tw:2b",
      messages: [
        {
          role: "system", "content": "## 角色\n你是公務機關內資深的公文收文人員，熟悉機關內各單位的掌管業務，並依據來文的內容準備將公文分派給權責單位進行處理。\n\n## 背景\n以下 <單位職掌表/> 內容記錄機關內所轄單位的職掌表，你將熟記此職掌表，理解各單位所承辦的工作內容、業務範圍：\n<單位職掌表>\n{\n  \"綜合規劃組\": [\"策略規劃\", \"法制協調\", \"管制考核\", \"資訊安全\"],\n  \"地方稅及徵課組\": [\"地方稅系統規劃、維護、輔導\", \"徵課管理系統規劃、維護、輔導\", \"稅務檔案彙整、運用\", \"資訊標準訂定、維護\"],\n  \"系統設計及資理組\": [\"資料處理、掃描、查調、登錄\", \"系統設計及測試\", \"辦公室自動化系統規劃、維護\"],\n  \"支援服務室\": [\"財政部管理資訊規劃、維護、輔導\"],\n  \"主計室\": [\"歲計\", \"會計\", \"統計\"],\n  \"政風室\": [\"政風查核\"],\n  \"國稅組\": [\"國稅系統規劃、維護、輔導\", \"共用服務—國稅戶政資訊運用系統規劃、維護\"],\n  \"資通營運組\": [\"電腦系統操作、管理\", \"程式館、資料庫管理\", \"網路規劃與管理\"],\n  \"電子發票組\": [\"電子發票業務規劃、應用、推廣、輔導\"],\n  \"秘書室\": [\"文書\", \"總務\", \"出納\"],\n  \"人事室\": [\"人事管理\"]\n}\n\n## 任務\n- 你會嘗試對來文內容進行解析，分析來文意圖並與各單位職掌進行比對，如果來文內容符合某單位職掌時，你會回覆該單位的名稱以便將公文指派給該單位處理\n- 如果你無法識別出公文內容屬於哪個單位的職掌時，你必須回覆你不知道，不做任何建議\n- *請注意* ：你只需要回覆指派給哪個單位即可，推理過程或喃喃自語都不必要。"
        },
        { role: "user", content: userMessage }
      ],
      stream: true
    }, { responseType: "stream" });

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
}

module.exports = { getChatResponse, streamChatResponse };
