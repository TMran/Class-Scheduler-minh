# Docker Deployment Guide

This guide explains how to deploy the Class Scheduler application using Docker.

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose (usually included with Docker Desktop)

## Quick Start

1. **Clone and navigate to the project directory:**

   ```bash
   cd Class-Scheduler
   ```

2. **Build and run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

3. **Access the application:**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Individual Service Commands

### Backend Only

```bash
# Build backend image
docker build -t class-scheduler-backend ./backend

# Run backend container
docker run -p 8080:8080 -v $(pwd)/backend/Database:/app/Database class-scheduler-backend
```

### Frontend Only

```bash
# Build frontend image
docker build -t class-scheduler-frontend ./frontend

# Run frontend container
docker run -p 3000:80 class-scheduler-frontend
```

## Production Deployment

For production deployment, you may want to:

1. **Use environment variables for configuration:**

   ```bash
   # Create a .env file
   echo "NODE_ENV=production" > .env
   echo "REACT_APP_API_URL=https://your-api-domain.com" >> .env
   ```

2. **Use a reverse proxy like nginx for the frontend**
3. **Set up SSL certificates**
4. **Configure proper logging and monitoring**

## Database Persistence

The database file is mounted as a volume in the docker-compose.yml file, so your data will persist between container restarts. The database is located at `./backend/Database` on your host machine.

## Troubleshooting

### Common Issues:

1. **Port conflicts:** If ports 3000 or 8080 are already in use, modify the port mappings in docker-compose.yml

2. **Permission issues with database:**

   ```bash
   sudo chown -R $(whoami) ./backend/Database
   ```

3. **Network connectivity issues:** Make sure both services are on the same Docker network (handled automatically by docker-compose)

### Useful Commands:

```bash
# View running containers
docker ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild specific service
docker-compose build --no-cache backend
docker-compose build --no-cache frontend

# Clean up unused images
docker system prune -a
```

## Development vs Production

- **Development**: Uses `docker-compose up` for easy development with live reloading
- **Production**: Consider using `docker-compose -f docker-compose.prod.yml up` with optimized configurations

## Security Considerations

- Change default ports in production
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Set up SSL/TLS encryption
- Configure firewall rules appropriately
