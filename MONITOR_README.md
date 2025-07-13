# Uptime Monitor Docker Service

This directory contains the uptime monitoring service that runs in a Docker container for maximum reliability and portability.

## 🐳 Docker Setup

### Prerequisites

1. **Install Docker Desktop** from: https://www.docker.com/products/docker-desktop
2. **Start Docker Desktop** and wait for it to be ready

### Environment Setup

1. Create a `.env` file in the monitoring directory:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the Monitor

### Start the Monitor
```bash
.\start-monitor.bat
```

### Stop the Monitor
```bash
.\stop-monitor.bat
```

### View Logs
```bash
.\logs.bat
```

### Check Docker Status
```bash
.\check-docker.bat
```

## 🔧 Docker Features

- **Auto-restart**: Container automatically restarts if it crashes
- **Health checks**: Docker monitors container health
- **Volume mounting**: Logs are persisted to host machine
- **Environment variables**: Secure credential management
- **Isolated environment**: No conflicts with system dependencies

## 📊 Monitoring & Logs

### View Real-time Logs
```bash
.\logs.bat
```

### View Container Status
```bash
docker-compose ps
```

### Check Container Health
```bash
docker inspect uptime-monitor | findstr Health
```

### Access Container Shell
```bash
docker exec -it uptime-monitor sh
```

## 🛠️ Troubleshooting

### Container Won't Start
1. **Check environment variables**: Ensure `.env` file exists and has correct values
2. **Check Docker logs**: `.\logs.bat`
3. **Rebuild container**: `.\start-monitor.bat` (automatically rebuilds)

### Monitor Not Working
1. **Check database connection**: Verify Supabase credentials
2. **Check network**: Ensure container can reach external URLs
3. **Check logs**: `.\logs.bat`

### Performance Issues
1. **Check resource usage**: `docker stats uptime-monitor`
2. **Check memory**: Container has 1GB memory limit
3. **Check CPU**: Monitor CPU usage in Docker Desktop

## 🔄 Updates & Maintenance

### Update Monitor Code
```bash
# Stop container
.\stop-monitor.bat

# Rebuild and start
.\start-monitor.bat
```

### Update Dependencies
```bash
# Rebuild with new dependencies
.\start-monitor.bat
```

### Clean Up
```bash
# Remove old images
docker image prune

# Remove unused containers
docker container prune
```

## 📁 File Structure

```
monitoring/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Container orchestration
├── .dockerignore          # Files to exclude from build
├── utils/monitor.ts       # Monitor source code
├── tsconfig.monitor.json  # TypeScript config for monitor
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── logs/                  # Log files (created automatically)
├── dist/                  # Compiled JavaScript (created automatically)
├── start-monitor.bat      # Docker start script
├── stop-monitor.bat       # Docker stop script
├── logs.bat              # Docker logs script
└── check-docker.bat      # Docker status check
```

## 🎯 Benefits of Docker

- **Consistency**: Same environment across all machines
- **Isolation**: No conflicts with other applications
- **Portability**: Easy to deploy anywhere
- **Scalability**: Easy to run multiple instances
- **Reliability**: Built-in restart policies and health checks
- **Security**: Isolated from host system

## 🚀 Production Deployment

For production deployment, consider:

1. **Use Docker Swarm or Kubernetes** for orchestration
2. **Set up monitoring** with Prometheus/Grafana
3. **Configure log aggregation** with ELK stack
4. **Use secrets management** for sensitive data
5. **Set up automated backups** for logs and data 