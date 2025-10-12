const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

// 🎬 播放视频（gzip 压缩，浏览器自动解压并播放）
const PlayVideo = (req, res) => {
    const filePath = path.join(__dirname, "test.mp4");
    res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Content-Encoding": "gzip", // 告诉浏览器这是 gzip 压缩的
    });

    const readStream = fs.createReadStream(filePath);
    const gzip = zlib.createGzip();

    readStream.pipe(gzip).pipe(res);

    readStream.on("error", (err) => {
        console.error("文件读取错误:", err);
        res.statusCode = 500;
        res.end("视频加载失败");
    });
};

// 💾 下载视频（gzip 压缩，浏览器保存 .gz 文件）
const DownloadVideo = (req, res) => {
    const filePath = path.join(__dirname, "test.mp4");

    // content-type application/octet-stream 表示二进制流 application/json||pdf||mp4等等
    // content-disposition 在网页打开图片或者视频 直接去预览而不是下载默认inline
    // attachment = 文件当作一个附件去下载

    // res.writeHead(200, {
    //     "Content-Type": "application/octet-stream",
    //     "Content-Disposition": "attachment; filename=test.mp4", // attachment = 强制下载
    // });

    res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Content-Disposition": "inline; filename=test.mp4", // inline 表示浏览器内预览
    });

    const readStream = fs.createReadStream(filePath);
    // const gzip = zlib.createGzip();

    readStream.pipe(res);

    readStream.on("error", (err) => {
        console.error("文件读取错误:", err);
        res.statusCode = 500;
        res.end("视频下载失败");
    });
};

module.exports = {
    PlayVideo,
    DownloadVideo,
};
