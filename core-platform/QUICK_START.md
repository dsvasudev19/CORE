# Quick Start Guide

Get the Core Platform monorepo up and running in minutes.

## Prerequisites

Ensure you have these installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- pnpm 9+ (`npm install -g pnpm`)
- Java 17 ([Download](https://adoptium.net/))
- MySQL 8+ ([Download](https://dev.mysql.com/downloads/))

## 1. Install Dependencies

```bash
cd core-platform
pnpm install
```

This installs all dependencies for all apps and services in the monorepo.

## 2. Setup Databases

### Option A: Using Docker (Easiest)

```bash
# Start MySQL
docker-compose up -d mysql

# Wait 10 seconds for MySQL to initialize
sleep 10

# Run migrations
cd services/messaging-service
pnpm db:migrate
pnpm db:seed
```

### Option B: Manual MySQL Setup

```bash
# Login to MySQL
mysql -u root -p

# Create databases
CREATE DATABASE core_db;
CREATE DATABASE messaging_app_dev;
exit;

# Run migrations
cd services/messaging-service
pnpm db:migrate
pnpm db:seed
```

## 3. Configure Environment Variables

### Core Webapp
```bash
cd apps/core-webapp
cp .env.example .env
# Edit .env if needed (defaults should work)
```

### Messaging Service
```bash
cd services/messaging-service
cp .env.example .env
# Update DB credentials if needed
```

### Core Service
Edit `services/core-service/src/main/resources/application.properties`:
```properties
spring.datasource.password=your_mysql_password
```

## 4. Start All Services

From the root directory:

```bash
pnpm dev
```

This starts:
- ✅ Core Webapp on http://localhost:3002
- ✅ Core Service on http://localhost:8080
- ✅ Messaging Service on http://localhost:3001
- ✅ Marketing Website on http://localhost:3000

## 5. Verify Everything Works

### Marketing Website
Open http://localhost:3000 - You should see the beautiful landing page

### Core Webapp
Open http://localhost:3002 - The main application

### Core Service API
Open http://localhost:8080/swagger-ui.html - API documentation

### Messaging Service
Open http://localhost:3001/health - Should return OK

## Common Commands

```bash
# Start all services
pnpm dev

# Start specific services
pnpm dev:webapp      # Frontend only
pnpm dev:core        # Core service only
pnpm dev:messaging   # Messaging service only

# Build everything
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Using Make (Alternative)

```bash
# Complete setup
make setup

# Start all services
make dev

# Start specific services
make dev-webapp
make dev-core
make dev-messaging

# Database operations
make db-up
make db-migrate
make db-seed

# Clean everything
make clean
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3002  # or :8080, :3001
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check MySQL is running
docker-compose ps
# or
mysql -u root -p

# Restart MySQL
docker-compose restart mysql
```

### Build Errors
```bash
# Clean and reinstall
rm -rf node_modules
pnpm install

# Clean Java build
cd services/core-service
./mvnw clean
```

### Turbo Cache Issues
```bash
rm -rf .turbo
pnpm build --force
```

## Next Steps

1. **Explore the Marketing Site**: http://localhost:3000
2. **Try the Main App**: http://localhost:3002
3. **Check API Docs**: http://localhost:8080/swagger-ui.html
4. **Read Full Documentation**: See `README.md` and `DEVELOPMENT.md`

## Project Structure

```
core-platform/
├── apps/
│   ├── core-webapp/     # Main React app (Port 3002)
│   └── web/             # Marketing site (Port 3000)
├── services/
│   ├── core-service/    # Spring Boot API (Port 8080)
│   └── messaging-service/ # Node.js messaging (Port 3001)
└── packages/            # Shared packages
```

## Getting Help

- 📖 Full docs: `README.md`
- 🛠️ Development guide: `DEVELOPMENT.md`
- ⚙️ Configuration: `CONFIGURATION.md`
- 🔄 Migration info: `MIGRATION_SUMMARY.md`

## Success! 🎉

You're all set! The Core Platform is now running locally. Start building amazing features!
