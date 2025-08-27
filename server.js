const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
require("dotenv").config();

const { sendToEmail, testEmailConfig } = require("./email-push");

const app = express();
const port = process.env.PORT || 5520;

// 解析application/x-www-form-urlencoded (Twilio使用这种格式)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio webhook验证中间件
const validateTwilioSignature = (req, res, next) => {
  // 在生产环境中，你应该验证请求来自Twilio
  // const signature = req.headers['x-twilio-signature'];
  // const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  // const isValid = twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, signature, url, req.body);
  // if (!isValid) {
  //   return res.status(403).send('Unauthorized');
  // }
  next();
};

// 健康检查路由
app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "Twilio SMS to Email Forwarder",
    timestamp: new Date().toISOString(),
  });
});

// 接收Twilio SMS webhook
app.post("/sms-webhook", validateTwilioSignature, async (req, res) => {
  try {
    console.log("收到Twilio webhook:", req.body);

    // 提取SMS信息
    const {
      From: fromNumber,
      To: toNumber,
      Body: messageBody,
      MessageSid: messageSid,
    } = req.body;

    console.log(`收到来自 ${fromNumber} 的SMS: ${messageBody}`);

    // 构造要发送到邮箱的消息
    const emailMessage = {
      from: fromNumber,
      to: toNumber,
      message: messageBody,
      timestamp: new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
      }),
      messageSid: messageSid,
    };

    // 发送到邮箱
    const success = await sendToEmail(emailMessage);

    if (success) {
      console.log("消息已成功转发到邮箱");
      res.status(200).send("消息已转发");
    } else {
      console.error("邮件推送失败");
      res.status(500).send("邮件推送失败");
    }
  } catch (error) {
    console.error("处理SMS webhook时出错:", error);
    res.status(500).send("服务器内部错误");
  }
});

// 测试邮件推送的路由
app.post("/test-email", async (req, res) => {
  try {
    const testMessage = {
      from: "+1234567890",
      to: process.env.TWILIO_PHONE_NUMBER,
      message: "这是一条测试消息，用于验证邮件转发功能是否正常工作。",
      timestamp: new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
      }),
      messageSid: "TEST_MESSAGE_ID_" + Date.now(),
    };

    const success = await sendToEmail(testMessage);

    if (success) {
      res.json({ success: true, message: "测试消息已发送到邮箱" });
    } else {
      res.status(500).json({ success: false, message: "邮件推送失败" });
    }
  } catch (error) {
    console.error("测试邮件推送时出错:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 测试邮件配置的路由
app.get("/test-email-config", async (req, res) => {
  try {
    const isValid = await testEmailConfig();
    if (isValid) {
      res.json({ success: true, message: "邮件配置正确，服务器连接成功" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "邮件配置有误或服务器连接失败" });
    }
  } catch (error) {
    console.error("测试邮件配置时出错:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Twilio SMS转发服务器启动成功!`);
  console.log(`📱 监听端口: ${port}`);
  console.log(`🔗 Webhook URL: http://localhost:${port}/sms-webhook`);
  console.log(`📧 测试邮件推送: http://localhost:${port}/test-email`);
  console.log(`⚙️  测试邮件配置: http://localhost:${port}/test-email-config`);
  console.log(`📞 Twilio号码: ${process.env.TWILIO_PHONE_NUMBER}`);
});

// 优雅关闭
process.on("SIGINT", () => {
  console.log("\n👋 正在关闭服务器...");
  process.exit(0);
});
