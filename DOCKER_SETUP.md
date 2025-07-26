# Docker Setup Guide

This guide will help you run the Fleet Management System using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and start the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - API: http://localhost:3000
   - With Nginx proxy: http://localhost:80
   - Health check: http://localhost:3000/health
   - API Documentation: http://localhost:3000/api

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t fleet-management .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 -v $(pwd)/fleet_management.db:/app/fleet_management.db fleet-management
   ```

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to `production` in Docker
- `PORT`: Application port (default: 3000)
- `DATABASE_URL`: SQLite database file path

## Database Persistence

The SQLite database is mounted as a volume to ensure data persistence:
- Local file: `./fleet_management.db`
- Container path: `/app/fleet_management.db`

## Health Checks

The application includes health checks:
- Endpoint: `/health`
- Docker health check runs every 30 seconds
- Returns application status, timestamp, and uptime

## Development

For development with hot reload:

```bash
# Install dependencies locally
npm install

# Run in development mode
npm run start:dev
```

## Troubleshooting

1. **Port conflicts:** If port 3000 is in use, modify the port mapping in `docker-compose.yml`
2. **Database issues:** Ensure the SQLite file has proper permissions
3. **Build failures:** Clear Docker cache with `docker system prune`

## Production Deployment

For production deployment:

1. Set proper environment variables
2. Use a reverse proxy (Nginx included in docker-compose)
3. Configure SSL/TLS certificates
4. Set up proper logging and monitoring
5. Consider using a more robust database (PostgreSQL/MySQL)

## Services

The docker-compose setup includes:

- **fleet-management**: Main NestJS application
- **nginx**: Reverse proxy (optional, can be disabled)

## Logs

View application logs:
```bash
docker-compose logs -f fleet-management
```