const express = require("express");
const path = require("path");
const fs = require("fs");

const { convertVideoToGif } = require("./src/ffemeng.js");
const { MarkdownToHtml } = require("./src/markdown-to-html/index.js");
const { PlayVideo, DownloadVideo } = require("./src/video/index.js");
const app = express();
const PORT = process.env.PORT || 5050;
const { createProxyMiddleware } = require("http-proxy-middleware");
const { sendEmail } = require("./src/email-server/index.js");
app.use(
    "/api",
    createProxyMiddleware({
        target: "http://localhost:3000", // 目标服务器
        changeOrigin: true, // 修改请求头中的 host
        pathRewrite: { "^/api": "" }, // 可选：去掉前缀 /api
    }),
);

app.get("/", (req, res) => {
    res.send("Hello, JavaScript and Express!");
});

app.get("/gif", async (req, res) => {
    try {
        const mp4Path = path.join(__dirname, "test.mp4"); // 改后缀 mp4
        const buffer = await convertVideoToGif(mp4Path);
        res.setHeader("Content-Type", "image/gif");
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("转换失败: " + err.message);
    }
});

app.get("/play-video", PlayVideo);
app.get("/download", DownloadVideo);

app.get("/markdown-to-html", MarkdownToHtml);

app.get("/send-email", sendEmail);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
