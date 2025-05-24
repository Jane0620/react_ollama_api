# 本地模型聊天機器人嵌入系統
快速建立動態前端畫面及盡可能不改動原系統，使用這個方法嘗試製作。

## 套件安裝
> - 專案拉下來後，執行`npm install`
> - 因為將後端塞在server資料夾，所以這裡也要執行`npm install`。
>   ```
>   cd server   
>   npm install 
>   ```
> - 後端是 node
>   ```
>   node app.js 
>   ```

## 環境設置
使用環境變量來配置不同環境的API URL。
> 1. 複製 `.env.example` 為 `.env.development` 和 `.env.production`
> 2. 根據實際環境修改文件中的設置
> 3. 開發環境運行 `npm run dev`，可以看到前端畫面
> 4. 生產環境運行 `npm run build`(dist)，會建立打包的dist資料夾，因為後端我使用express提供靜態文件，所以可以直接連http://localhost:${PORT}

## 設置模型與提示詞
> 1. 複製`ollama.config.example.js`為`ollama.config.js`
> 2. 在`ollama.config.js`中修改使用的模型及提示詞
> 3. ollama api 連結：[docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)

## 嵌入系統
> - 實作嵌入JSP中
> - ```
>   <script src="http://localhost:5000/chatbot-loader.js"></script>
>   ```
