const { spawn } = require("child_process");

function convertVideoToGif(videoPath) {
    return new Promise((resolve, reject) => {
        const args = ["-i", videoPath, "-f", "gif", "pipe:1"];
        const ffmpeg = spawn("ffmpeg", args);

        let buffer = Buffer.alloc(0);

        ffmpeg.stdout.on("data", (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
        });

        ffmpeg.stderr.on("data", (data) => {
            console.error("ffmpeg:", data.toString());
        });

        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve(buffer);
            } else {
                reject(new Error("ffmpeg 转换失败"));
            }
        });
    });
}

module.exports = { convertVideoToGif };
