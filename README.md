# Twilio SMS 转邮件推送服务

🚀 将接收到的 Twilio SMS 消息自动转发到邮箱的服务

## ✨ 功能特点

- 📱 接收 Twilio SMS webhook
- 📧 支持多种邮件服务商（QQ 邮箱、Gmail、163 邮箱等）
- 🔄 实时消息转发
- 🛡️ 安全的 webhook 验证
- 📊 详细的日志记录
- 🧪 内置测试接口

## 🎯 适用场景

- 海外业务 SMS 通知转发到邮箱
- 重要系统消息的邮件提醒
- 客服消息的实时邮件推送
- 验证码和通知消息的邮件转发

## 📋 前置要求

1. **Node.js** (v14+)
2. **Twilio 账户** 和有效的电话号码
3. **邮箱账户** (支持 SMTP 发送)：
   - QQ 邮箱 (推荐，免费)
   - Gmail (需要应用密码)
   - 163 邮箱、126 邮箱等

## 🔧 安装和配置

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/twilio-sms-to-wechat.git
cd twilio-sms-to-wechat
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `env.template` 为 `.env` 并填入你的配置：

```bash
# Twilio 配置 (请填入你的真实凭证)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# 服务器配置
PORT=5520

# 微信推送配置 (选择一种方式)
# 企业微信机器人 (推荐)
WECHAT_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_WEBHOOK_KEY

# Server酱 (备选方案)
# SERVERCHAN_KEY=YOUR_SERVERCHAN_KEY

# PushDeer (备选方案)
# PUSHDEER_KEY=YOUR_PUSHDEER_KEY
```

## 📱 微信推送配置指南

### 方式 1: 企业微信机器人 (推荐)

1. 在企业微信中创建群聊
2. 添加机器人并获取 Webhook URL
3. 将 URL 设置到 `WECHAT_WEBHOOK_URL` 环境变量

**获取步骤:**

- 群聊 → 右上角 (...) → 群机器人 → 添加机器人
- 复制 Webhook 地址

### 方式 2: Server 酱

1. 访问 [Server 酱官网](https://sct.ftqq.com/)
2. 微信扫码登录
3. 获取 SendKey
4. 设置 `SERVERCHAN_KEY` 环境变量

### 方式 3: PushDeer

1. 下载 PushDeer App
2. 注册账户并获取 Key
3. 设置 `PUSHDEER_KEY` 环境变量

## 🚀 启动服务

### Windows 用户

双击运行 `start.bat`

### 其他系统

```bash
npm start
```

### 开发模式

```bash
npm run dev
```

## 🧪 测试功能

1. **健康检查**

   ```
   GET http://localhost:3000/
   ```

2. **测试微信推送**
   ```
   POST http://localhost:3000/test-wechat
   ```

## 🌐 部署到公网

### 方式 1: 使用 ngrok (开发测试)

```bash
# 安装ngrok
npm install -g ngrok

# 启动本地服务器
npm start

# 新开终端，创建隧道
ngrok http 3000
```

复制 ngrok 提供的 HTTPS URL，格式如：`https://abcd1234.ngrok.io`

### 方式 2: 云服务部署 (生产环境)

推荐使用：

- Vercel
- Railway
- Render
- 阿里云/腾讯云服务器

## ⚙️ Twilio Webhook 配置

1. 登录 [Twilio Console](https://console.twilio.com/)
2. 进入 **Phone Numbers** → **Manage** → **Active numbers**
3. 点击你的 Twilio 电话号码
4. 在 **Messaging** 部分，设置 **Webhook URL**：
   ```
   https://your-domain.com/sms-webhook
   ```
5. HTTP 方法选择 **POST**
6. 保存配置

## 📊 消息格式

收到的 SMS 会以以下格式推送到微信：

```
## 📱 新的SMS消息

**🕐 时间:** 2024-01-15 14:30:25
**📞 发送方:** +1234567890
**📱 接收方:** your_twilio_number
**📝 内容:** Hello, this is a test message
**🆔 消息ID:** SM1234567890abcdef
```

## 🔒 安全注意事项

1. **环境变量保护**: 不要将 `.env` 文件提交到版本控制
2. **HTTPS**: 生产环境务必使用 HTTPS
3. **Webhook 验证**: 可启用 Twilio 签名验证 (代码中已预留)
4. **访问控制**: 考虑添加 IP 白名单或 API 密钥认证

## 🐛 故障排除

### 常见问题

1. **微信推送失败**

   - 检查 webhook URL 是否正确
   - 验证网络连接
   - 查看控制台错误日志

2. **Twilio webhook 不触发**

   - 确认服务器可公网访问
   - 检查 Twilio 控制台中的 webhook URL 配置
   - 查看 Twilio 错误日志

3. **端口占用**
   - 修改 `.env` 中的 `PORT` 变量
   - 或关闭占用端口的其他服务

### 日志查看

服务器会输出详细日志，包括：

- 收到的 webhook 请求
- 微信推送状态
- 错误信息

## 📞 技术支持

如有问题，请检查：

1. 环境变量配置是否正确
2. 网络连接状态
3. 服务日志输出
4. Twilio 控制台错误信息

## 📝 许可证

ISC License
