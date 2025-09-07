const express = require("express");
const path = require("path");
const { convertVideoToGif } = require("./ffemeng.js"); // 注意改成 .js

const app = express();
const PORT = process.env.PORT || 5050;

app.get("/", (req, res) => {
    res.send("Hello, JavaScript and Express!");
});

app.get("/gif", async (req, res) => {
    try {
        const mp4Path = path.join(__dirname, "../test.mp4"); // 改后缀 mp4
        const buffer = await convertVideoToGif(mp4Path);
        res.setHeader("Content-Type", "image/gif");
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("转换失败: " + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
