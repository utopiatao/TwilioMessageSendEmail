@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   🚀 Twilio SMS转微信推送 - 快速设置
echo ==========================================
echo.
echo 📋 配置信息:
echo    端口: 5520
echo    Webhook URL格式: https://your-ngrok-domain.ngrok-free.app/sms-webhook
echo.

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo ✅ Node.js已安装
echo.

REM 安装依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

REM 创建.env文件
if not exist ".env" (
    echo 📝 创建配置文件...
    copy env.template .env >nul
    echo ✅ 已创建 .env 文件
    echo.
    echo ⚠️  重要: 请配置微信推送方式!
    echo.
    echo 📱 企业微信机器人 (推荐):
    echo    1. 创建企业微信群聊
    echo    2. 添加群机器人
    echo    3. 复制Webhook地址
    echo    4. 编辑 .env 文件，填入 WECHAT_WEBHOOK_URL
    echo.
    echo 🔧 或者使用Server酱:
    echo    1. 访问 https://sct.ftqq.com/
    echo    2. 获取SendKey
    echo    3. 编辑 .env 文件，填入 SERVERCHAN_KEY
    echo.
    
    set /p continue="是否已配置微信推送？(y/n): "
    if /i not "%continue%"=="y" (
        echo.
        echo 📝 请先配置微信推送，然后重新运行此脚本
        notepad .env
        pause
        exit /b 0
    )
)

echo.
echo 🧪 启动服务器并测试...
echo.

start "Twilio SMS转发服务" cmd /k "npm start"

timeout /t 3 >nul

echo 📤 测试微信推送...
curl -X POST https://your-ngrok-domain.ngrok-free.app/test-wechat 2>nul || (
    echo ⚠️  无法访问服务器，请检查:
    echo    1. 服务器是否启动成功
    echo    2. ngrok是否在运行: ngrok http 5520
    echo    3. ngrok地址是否正确
)

echo.
echo 📋 接下来需要配置Twilio Webhook:
echo.
echo 1. 访问: https://console.twilio.com/
echo 2. 进入: Phone Numbers → Manage → Active numbers  
echo 3. 点击: 你的Twilio号码
echo 4. 在Messaging部分，设置Webhook URL为:
echo    https://your-ngrok-domain.ngrok-free.app/sms-webhook
echo 5. 保存配置
echo.
echo 🎉 配置完成后，发送SMS到你的Twilio号码测试!
echo.

pause
