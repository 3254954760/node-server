const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 配置multer用于处理文件上传，这个是中间件 处理了文件的存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 使用文件名创建临时目录存储分片
        const filename = req.body.filename || "unknown";
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        const tempDir = path.join(__dirname, "../temp", name);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        // 文件存放的目录
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // 使用文件名和索引创建唯一的分片文件名
        const filename = req.body.filename || "unknown";
        const index = req.body.index || "0";
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        // 小文件名称 拼接上索引 和 扩展名
        cb(null, `${name}_${index}${ext}`);
    },
});

const upload = multer({ storage: storage });

// 分片上传处理
const uploadFile = (req, res) => {
    try {
        const { filename, index, total } = req.body;
        console.log(
            `收到分片: ${filename || "未知文件"}, 索引: ${index}/${total}`,
        );
        // 检查是否所有分片都已上传
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        const tempDir = path.join(__dirname, "../temp", name);
        // 检查已上传的分片数量
        const uploadedChunks = fs
            .readdirSync(tempDir)
            .filter(
                (file) => file.startsWith(`${name}_`) && file.endsWith(ext),
            ).length;
        res.json({
            success: true,
            message: `分片 ${index} 上传成功`,
            uploaded: uploadedChunks,
            total: parseInt(total),
            completed: uploadedChunks >= parseInt(total),
        });
    } catch (error) {
        console.error("分片上传错误:", error);
        res.status(500).json({
            success: false,
            message: "分片上传失败",
            error: error.message,
        });
    }
};

// 文件合并处理
const mergeFile = (req, res) => {
    console.log("=== 合并文件请求 ===");
    console.log("请求方法:", req.method);
    console.log("请求路径:", req.path);
    console.log("请求体:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("==================");
    try {
        const { filename } = req.body;
        console.log("合并请求体:", filename);
        if (!filename) {
            return res.status(400).json({
                success: false,
                message: "缺少文件名参数",
            });
        }
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        const tempDir = path.join(__dirname, "../temp", name);
        const uploadsDir = path.join(__dirname, "../uploads");

        // 确保uploads目录存在
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        // 获取所有分片文件
        const chunks = fs
            .readdirSync(tempDir)
            .filter((file) => file.startsWith(`${name}_`) && file.endsWith(ext))
            .sort((a, b) => {
                const aIndex = parseInt(a.match(/_(\d+)\./)[1]);
                const bIndex = parseInt(b.match(/_(\d+)\./)[1]);
                return aIndex - bIndex;
            });
        if (chunks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "未找到分片文件",
            });
        }
        // 合并文件
        const finalPath = path.join(uploadsDir, filename);

        // 按顺序合并所有分片
        chunks.forEach((chunk, index) => {
            const chunkPath = path.join(tempDir, chunk);
            const chunkData = fs.readFileSync(chunkPath);

            if (index === 0) {
                // 第一个分片，创建新文件
                fs.writeFileSync(finalPath, chunkData);
            } else {
                // 后续分片，追加到文件
                fs.appendFileSync(finalPath, chunkData);
            }
        });

        // 清理临时分片文件
        chunks.forEach((chunk) => {
            fs.unlinkSync(path.join(tempDir, chunk));
        });

        // 删除临时目录
        fs.rmdirSync(tempDir);

        res.json({
            success: true,
            message: "文件合并成功",
            filename: filename,
            path: finalPath,
            size: fs.statSync(finalPath).size,
        });
    } catch (error) {
        console.error("文件合并错误:", error);
        res.status(500).json({
            success: false,
            message: "文件合并失败",
            error: error.message,
        });
    }
};

module.exports = {
    upload,
    uploadFile,
    mergeFile,
};
