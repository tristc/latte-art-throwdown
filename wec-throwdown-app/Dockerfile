# WEC Throwdown Platform - Production Dockerfile

# Build stage for React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend code
COPY backend/ ./

# Copy built frontend from build stage
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the app
CMD ["npm", "start"]
