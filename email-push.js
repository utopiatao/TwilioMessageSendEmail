const nodemailer = require("nodemailer");

/**
 * 发送消息到邮箱
 * @param {Object} messageData - 包含SMS信息的对象
 * @param {string} messageData.from - 发送方号码
 * @param {string} messageData.to - 接收方号码
 * @param {string} messageData.message - 消息内容
 * @param {string} messageData.timestamp - 时间戳
 * @param {string} messageData.messageSid - 消息ID
 * @returns {boolean} 是否发送成功
 */
async function sendToEmail(messageData) {
  const { from, to, message, timestamp, messageSid } = messageData;

  // 检查邮件配置
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !process.env.EMAIL_TO
  ) {
    console.error("❌ 邮件配置不完整！请检查环境变量");
    return false;
  }

  try {
    // 创建邮件传输器
    const transporter = createTransporter();

    // 格式化邮件内容
    const emailContent = formatEmailContent(messageData);

    // 发送邮件
    const result = await transporter.sendMail(emailContent);

    console.log("✅ 邮件发送成功:", result.messageId);
    return true;
  } catch (error) {
    console.error("❌ 邮件发送失败:", error.message);
    return false;
  }
}

/**
 * 创建邮件传输器
 */
function createTransporter() {
  // 根据不同邮件服务商创建配置
  const emailHost = process.env.EMAIL_HOST.toLowerCase();

  let config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  // 预设常用邮件服务商配置
  if (emailHost.includes("gmail")) {
    config.service = "gmail";
    config.host = "smtp.gmail.com";
    config.port = 587;
    config.secure = false;
    // Gmail特殊配置
    config.tls = {
      rejectUnauthorized: false,
    };
  } else if (emailHost.includes("qq.com") || emailHost.includes("foxmail")) {
    config.service = "QQ";
    config.port = 587;
    config.secure = false;
  } else if (emailHost.includes("163.com")) {
    config.service = "163";
    config.port = 587;
    config.secure = false;
  } else if (emailHost.includes("126.com")) {
    config.service = "126";
    config.port = 587;
    config.secure = false;
  }

  console.log("📧 邮件配置:", {
    service: config.service || config.host,
    port: config.port,
    user: process.env.EMAIL_USER,
  });

  return nodemailer.createTransport(config);
}

/**
 * 格式化邮件内容
 */
function formatEmailContent(messageData) {
  const { from, to, message, timestamp, messageSid } = messageData;

  // 格式化发送方号码显示
  let displayFrom = from;
  if (from.startsWith("+1")) {
    displayFrom = `美国号码 ${from}`;
  } else if (from.startsWith("+86")) {
    displayFrom = `中国号码 ${from}`;
  }

  const subject = `📱 新SMS消息来自 ${displayFrom}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        📱 新的SMS消息
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #34495e; width: 100px;">🕐 时间:</td>
            <td style="padding: 8px; color: #2c3e50;">${timestamp}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #34495e;">📞 发送方:</td>
            <td style="padding: 8px; color: #2c3e50;">${displayFrom}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #34495e;">📱 接收方:</td>
            <td style="padding: 8px; color: #2c3e50;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #34495e;">🆔 消息ID:</td>
            <td style="padding: 8px; color: #7f8c8d; font-size: 12px;">${messageSid}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #ffffff; border: 1px solid #bdc3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">📝 消息内容:</h3>
        <p style="color: #34495e; font-size: 16px; line-height: 1.6; background-color: #ecf0f1; padding: 15px; border-radius: 5px;">
          ${message}
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #bdc3c7; text-align: center;">
        <p style="color: #7f8c8d; font-size: 12px;">
          此邮件由 Twilio SMS 转发服务自动生成<br>
          服务时间: ${new Date().toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
          })}
        </p>
      </div>
    </div>
  `;

  const textContent = `
📱 新的SMS消息

🕐 时间: ${timestamp}
📞 发送方: ${displayFrom}
📱 接收方: ${to}
📝 内容: ${message}
🆔 消息ID: ${messageSid}

---
此邮件由 Twilio SMS 转发服务自动生成
  `;

  return {
    from: `"Twilio SMS 转发" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };
}

/**
 * 测试邮件配置
 */
async function testEmailConfig() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ 邮件服务器连接成功");
    return true;
  } catch (error) {
    console.error("❌ 邮件服务器连接失败:", error.message);
    return false;
  }
}

module.exports = {
  sendToEmail,
  testEmailConfig,
};
