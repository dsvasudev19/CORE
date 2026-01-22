# Startup Scripts

Quick scripts to start individual services or all services at once.

## Individual Service Scripts

### 1. Start Core Webapp (React + Vite)
```bash
./scripts/start-core-webapp.sh
```
- **Port**: 3002
- **URL**: http://localhost:3002
- **Tech**: React 19, Vite, TypeScript, Tailwind CSS

### 2. Start Core Service (Spring Boot)
```bash
./scripts/start-core-service.sh
```
- **Port**: 8080
- **URL**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html
- **Tech**: Java 17, Spring Boot 3.4.1

### 3. Start Messaging Service (Node.js)
```bash
./scripts/start-messaging-service.sh
```
- **Port**: 3001
- **URL**: http://localhost:3001
- **Tech**: Node.js, Express, Socket.IO

## Start All Services

### Option 1: Using the All-in-One Script (Recommended)
```bash
./scripts/start-all.sh
```

This will:
- Open each service in a separate terminal tab/window
- Start all three services automatically
- Works on macOS, Linux, and Windows

### Option 2: Using Turborepo (Alternative)
```bash
# From root directory
pnpm dev
```

This will:
- Start all services in a single terminal
- Use Turborepo's task orchestration
- Show combined logs

### Option 3: Manual (Three Terminals)

**Terminal 1 - Core Service:**
```bash
cd core-platform
./scripts/start-core-service.sh
```

**Terminal 2 - Messaging Service:**
```bash
cd core-platform
./scripts/start-messaging-service.sh
```

**Terminal 3 - Core Webapp:**
```bash
cd core-platform
./scripts/start-core-webapp.sh
```

## Service URLs

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| Core Webapp | http://localhost:3002 | Main React application |
| Core Service | http://localhost:8080 | Spring Boot REST API |
| Core Service Docs | http://localhost:8080/swagger-ui.html | API Documentation |
| Messaging Service | http://localhost:3001 | Real-time messaging API |
| Marketing Website | http://localhost:3000 | Next.js marketing site |

## Stopping Services

### If using start-all.sh:
- Close the terminal tabs/windows
- Or press `Ctrl+C` in each terminal

### If using pnpm dev:
- Press `Ctrl+C` once in the terminal

### Kill processes by port:
```bash
# macOS/Linux
lsof -ti:3002 | xargs kill -9  # Core Webapp
lsof -ti:8080 | xargs kill -9  # Core Service
lsof -ti:3001 | xargs kill -9  # Messaging Service

# Or use the stop script
./scripts/stop-all.sh
```

## Prerequisites

Before running the scripts, ensure:

1. **Dependencies installed:**
   ```bash
   pnpm install
   ```

2. **Database running:**
   ```bash
   docker-compose up -d mysql
   # or use local MySQL
   ```

3. **Environment files configured:**
   ```bash
   cp apps/core-webapp/.env.example apps/core-webapp/.env
   cp services/messaging-service/.env.example services/messaging-service/.env
   ```

4. **Database migrations run:**
   ```bash
   cd services/messaging-service
   pnpm db:migrate
   pnpm db:seed
   ```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3002  # or :8080, :3001

# Kill process
kill -9 <PID>
```

### Java Not Found
```bash
# Install Java 17
# macOS: brew install openjdk@17
# Linux: sudo apt install openjdk-17-jdk
# Windows: Download from https://adoptium.net/
```

### Database Connection Failed
```bash
# Check MySQL is running
docker-compose ps

# Or check local MySQL
mysql -u root -p
```

### Script Permission Denied
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

## Script Features

### start-core-webapp.sh
- ✅ Auto-installs dependencies if missing
- ✅ Starts Vite dev server with hot reload
- ✅ Shows URL and port

### start-core-service.sh
- ✅ Checks Java installation
- ✅ Shows Java version
- ✅ Runs Maven wrapper
- ✅ Shows API docs URL

### start-messaging-service.sh
- ✅ Auto-installs dependencies if missing
- ✅ Creates .env from example if missing
- ✅ Starts with nodemon for hot reload
- ✅ Shows URL and port

### start-all.sh
- ✅ Detects OS automatically
- ✅ Opens services in separate terminals
- ✅ Works on macOS, Linux, Windows
- ✅ Shows all service URLs
- ✅ Provides stop instructions

## Quick Reference

```bash
# Start everything
./scripts/start-all.sh

# Start individual services
./scripts/start-core-webapp.sh
./scripts/start-core-service.sh
./scripts/start-messaging-service.sh

# Alternative: Use pnpm
pnpm dev                # All services
pnpm dev:webapp         # Core webapp only
pnpm dev:core           # Core service only
pnpm dev:messaging      # Messaging service only

# Alternative: Use make
make dev                # All services
make dev-webapp         # Core webapp only
make dev-core           # Core service only
make dev-messaging      # Messaging service only
```

## Tips

1. **First Time Setup**: Run `./setup.sh` before using these scripts
2. **Development**: Use individual scripts to work on specific services
3. **Full Stack**: Use `start-all.sh` to test the complete system
4. **Production**: Use `pnpm build` to create production builds

## Notes

- Scripts automatically check for dependencies
- Services start with hot reload enabled
- Logs are shown in each terminal
- Press Ctrl+C to stop any service
- All scripts are cross-platform compatible
