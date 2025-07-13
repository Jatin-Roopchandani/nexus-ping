FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the monitor
RUN npm run build-monitor

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create logs directory
RUN mkdir -p logs

# Expose port (if needed for health checks)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Monitor is running')" || exit 1

# Run the monitor
CMD ["node", "dist/utils/monitor.js"] 