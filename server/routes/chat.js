const express = require("express");
const { getChatResponse, streamChatResponse } = require("../controllers/chatController.js");

const router = express.Router();

// JSON 回應 (POST 請求)
router.post("/", getChatResponse);

// SSE (流式回應, GET 請求)
router.get("/", streamChatResponse);

module.exports = router;
