const fs = require("fs");
const yaml = require("js-yaml");
const nodemailder = require("nodemailer");
const mailConfig = yaml.load(
    fs.readFileSync(`${__dirname}/email.yaml`, "utf-8"),
);

const transport = nodemailder.createTransport({
    service: "qq", // 使用哪个邮件服务商，这里是 QQ 邮箱 如果指定了 service，通常可以不用再手动写 host 和 port。
    port: 587, // SMTP 端口号（587 一般用于 STARTTLS 加密）
    host: "smtp.qq.com", // QQ 邮箱的 SMTP 服务器地址
    secure: true, // 是否使用 SSL/TLS 加密
    auth: {
        // 认证信息
        pass: mailConfig.pass, // 授权码（不是邮箱登录密码）
        user: mailConfig.user, // 你的 QQ 邮箱地址
    },
});

const sendEmail = (req, res) => {
    transport.sendMail({
        to: "",
        from: mailConfig.user,
        subject: "邮件标题",
        text: "邮件内容",
    });
    res.send("邮件发送成功");
};
module.exports = {
    sendEmail,
};
