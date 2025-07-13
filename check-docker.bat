@echo off
echo 🔍 Checking Docker status...

docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running!
    echo.
    echo 📋 To fix this:
    echo 1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo 2. Start Docker Desktop
    echo 3. Wait for Docker to fully start (green icon in system tray)
    echo 4. Try running start-monitor.bat again
    echo.
    echo 💡 If Docker Desktop is already installed:
    echo - Check if it's running in your system tray
    echo - Restart Docker Desktop if needed
    echo - Make sure WSL 2 is enabled (Windows 10/11)
    pause
    exit /b 1
)

echo ✅ Docker is running!
echo.
echo 📊 Docker version:
docker version --format "table {{.Client.Version}}\t{{.Server.Version}}"
echo.
echo 🐳 Docker Compose version:
docker-compose --version
echo.
echo ✅ Ready to start the monitor!
pause 