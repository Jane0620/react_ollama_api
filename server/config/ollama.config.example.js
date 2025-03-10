// config/ollama.config.example.js

// Ollama API 端點
const OLLAMA_ENDPOINT = "http://localhost:11434";

// 模型名稱
const MODEL_NAME = "model-name-here";

// 系統提示詞
const SYSTEM_PROMPT = `這裡是系統提示詞內容`;

module.exports = {
  OLLAMA_ENDPOINT,
  MODEL_NAME,
  SYSTEM_PROMPT
};