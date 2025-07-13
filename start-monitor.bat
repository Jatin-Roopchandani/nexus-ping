@echo off
echo 🐳 Starting Uptime Monitor with Docker...

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running!
    echo Please start Docker Desktop and try again.
    echo You can download Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker is running...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please create a .env file with your Supabase credentials:
    echo SUPABASE_URL=your_supabase_url
    echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    pause
    exit /b 1
)

echo ✅ Environment file found...

REM Build and start the container
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo ❌ Failed to start monitor!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo ✅ Monitor started!
echo 📊 Check logs with: docker-compose logs -f uptime-monitor
echo 🛑 Stop with: docker-compose down
pause 