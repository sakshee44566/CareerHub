@echo off
echo 🚀 Starting Career Hub deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Email Configuration
        echo EMAIL_USER=sakshee907@gmail.com
        echo EMAIL_PASS=your_app_password_here
        echo.
        echo # Server Configuration
        echo PORT=5000
    ) > .env
    echo ⚠️  Please edit .env file and add your Gmail App Password
    echo    Go to Google Account settings ^> Security ^> 2-Step Verification ^> App passwords
    echo    Generate an app password and replace 'your_app_password_here' in .env file
    pause
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    echo 🌐 Frontend: http://localhost:3000
    echo 🔧 Backend API: http://localhost:5000
    echo 📊 Admin Panel: http://localhost:3000/admin
    echo.
    echo 📧 To configure email:
    echo    1. Go to Google Account settings
    echo    2. Security ^> 2-Step Verification ^> App passwords
    echo    3. Generate an app password
    echo    4. Update EMAIL_PASS in .env file
    echo    5. Restart: docker-compose restart backend
) else (
    echo ❌ Deployment failed. Check logs with: docker-compose logs
)

pause



