# Scripts Quick Reference Guide

## 🚀 Starting Services

### Start All Services (Recommended)
```bash
./scripts/start-all.sh
```
Opens each service in a separate terminal tab automatically.

### Start Individual Services

```bash
# Core Webapp (React + Vite) - Port 3002
./scripts/start-core-webapp.sh

# Core Service (Spring Boot) - Port 8080
./scripts/start-core-service.sh

# Messaging Service (Node.js) - Port 3001
./scripts/start-messaging-service.sh
```

## 🛑 Stopping Services

### Stop All Services
```bash
./scripts/stop-all.sh
```

### Stop Individual Services
Press `Ctrl+C` in the terminal running the service, or:
```bash
# Kill by port
lsof -ti:3002 | xargs kill -9  # Core Webapp
lsof -ti:8080 | xargs kill -9  # Core Service
lsof -ti:3001 | xargs kill -9  # Messaging Service
```

## 📍 Service URLs

| Service | Port | URL |
|---------|------|-----|
| Core Webapp | 3002 | http://localhost:3002 |
| Core Service | 8080 | http://localhost:8080 |
| Core Service API Docs | 8080 | http://localhost:8080/swagger-ui.html |
| Messaging Service | 3001 | http://localhost:3001 |
| Marketing Website | 3000 | http://localhost:3000 |

## 🎯 Alternative Methods

### Using pnpm (Turborepo)
```bash
# All services in one terminal
pnpm dev

# Individual services
pnpm dev:webapp      # Core Webapp
pnpm dev:core        # Core Service
pnpm dev:messaging   # Messaging Service
```

### Using Make
```bash
# All services
make dev

# Individual services
make dev-webapp
make dev-core
make dev-messaging
```

## 📋 Prerequisites Checklist

Before running scripts:

- [ ] Dependencies installed: `pnpm install`
- [ ] Database running: `docker-compose up -d mysql`
- [ ] Environment files: Copy `.env.example` to `.env`
- [ ] Migrations run: `cd services/messaging-service && pnpm db:migrate`

## 🔧 Quick Setup

First time? Run this:
```bash
./setup.sh
```

Then start services:
```bash
./scripts/start-all.sh
```

## 💡 Tips

1. **Development Workflow**: Use individual scripts to work on specific services
2. **Full Stack Testing**: Use `start-all.sh` to test everything together
3. **Logs**: Each service shows logs in its own terminal
4. **Hot Reload**: All services support hot reload - changes reflect automatically

## 🐛 Troubleshooting

### Port Already in Use
```bash
./scripts/stop-all.sh
./scripts/start-all.sh
```

### Script Permission Denied
```bash
chmod +x scripts/*.sh
```

### Database Connection Failed
```bash
docker-compose up -d mysql
sleep 10
cd services/messaging-service && pnpm db:migrate
```

## 📚 More Information

- Full documentation: `README.md`
- Script details: `scripts/README.md`
- Configuration: `CONFIGURATION.md`
- Quick start: `QUICK_START.md`

---

**Pro Tip**: Bookmark this file for quick reference! 🔖
