const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
let userId = 1; //模拟一个用户
let user = {
    id: 1,
    name: "张三",
};
const getQrCode = async (req, res) => {
    user[userId] = {
        token: null,
        time: Date.now(),
    };
    // 修改为你的实际IP地址
    const code = await qrcode.toDataURL(
        `http://192.168.199.150:5001/scan-auth-login?userId=${userId}`,
    );
    res.json({ code, userId });
};

const ScanAuthlogin = (req, res) => {
    const token = jwt.sign(req.params.userId, "secret");
    user[req.params.userId].token = token;
    user[req.params.userId].time = Date.now();
    res.json({
        token,
    });
};

//检查接口 这个接口要被轮询调用检查状态，0未授权 1已授权 2超时
const checkAuth = (req, res) => {
    if (Date.now() - user[userId].time > 1000 * 60 * 1) {
        return res.json({
            status: 2,
        });
    }
    //如果有token那就是验证成功
    else if (user[1].token) {
        return res.json({
            status: 1,
        });
    } else {
        return res.json({
            status: 0,
        });
    }
};
module.exports = { getQrCode, ScanAuthlogin, checkAuth };
