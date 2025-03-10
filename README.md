# 本地模型聊天機器人嵌入系統
為了快速建立動態前端畫面及盡可能不改動系統，我使用這個方法嘗試製作，這裡記錄我自己製作的過程

## 專案套件
> - 專案拉下來後，要執行`npm install`
> - 因為我將後端程式塞在server資料夾，所以這裡也要裝套件，也許未來我會解決這個麻煩。

## 環境設置
本專案使用環境變量來配置不同環境的API URL。
> 1. 複製 `.env.example` 為 `.env.development` 和 `.env.production`
> 2. 根據實際環境修改文件中的設置
> 3. 開發環境運行 `npm run dev`，生產環境運行 `npm run build`(dist)

## 設置模型與提示詞
> 1. 複製`ollama.config.example.js`為`ollama.config.js`
> 2. 在`ollama.config.js`中修改使用的模型及提示詞

## 嵌入系統
> - 實作嵌入JSP中
> - ```
>   <script src="http://localhost:5000/chatbot-loader.js"></script>
>   ```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


<iframe src="http://localhost:5000" width="600" height="400" frameborder="0" z-index="999">click</iframe>
