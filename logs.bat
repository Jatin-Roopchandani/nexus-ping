@echo off
echo 📊 Showing Uptime Monitor logs...
echo Press Ctrl+C to stop following logs

docker-compose logs -f uptime-monitor 