# Core Platform Monorepo

A comprehensive enterprise platform built with a modern monorepo architecture using Turborepo.

## Architecture

```
core-platform/
├── apps/
│   ├── core-webapp/      # React + Vite frontend (Port 3002)
│   ├── web/              # Next.js web app (Port 3000)
│   └── docs/             # Next.js documentation (Port 3001)
├── services/
│   ├── core-service/     # Spring Boot backend (Port 8080)
│   └── messaging-service/# Node.js messaging service (Port 3001)
└── packages/
    ├── ui/               # Shared UI components
    ├── eslint-config/    # Shared ESLint configs
    └── typescript-config/# Shared TypeScript configs
```

## Tech Stack

### Frontend

- **core-webapp**: React 19, Vite, TypeScript, Tailwind CSS
- **web/docs**: Next.js 16, React 19

### Backend

- **core-service**: Java 17, Spring Boot 3.4.1, PostgreSQL/MySQL
- **messaging-service**: Node.js, Express, Socket.IO, MySQL, Sequelize

## Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- Java 17 (for core-service)
- Maven (for core-service)
- MySQL (for databases)

## Getting Started

### 1. Install Dependencies

```bash
# Install all dependencies across the monorepo
pnpm install
```

### 2. Environment Setup

Copy environment files and configure:

```bash
# Core webapp
cp apps/core-webapp/.env.example apps/core-webapp/.env

# Messaging service
cp services/messaging-service/.env.example services/messaging-service/.env
```

### 3. Database Setup

#### Core Service (Spring Boot)

Configure `services/core-service/src/main/resources/application.properties`

#### Messaging Service

```bash
cd services/messaging-service
pnpm db:migrate
pnpm db:seed
```

### 4. Run Development Servers

```bash
# Run all services
pnpm dev

# Run specific services
pnpm dev:webapp          # Core webapp only
pnpm dev:core            # Core service only
pnpm dev:messaging       # Messaging service only
pnpm dev:services        # All backend services
```

## Available Scripts

### Root Level

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm test` - Run tests across all apps
- `pnpm format` - Format code with Prettier

### Core Webapp (apps/core-webapp)

- `pnpm dev` - Start Vite dev server (Port 3002)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Core Service (services/core-service)

- `pnpm dev` - Start Spring Boot with hot reload (Port 8080)
- `pnpm build` - Build JAR file
- `pnpm test` - Run tests
- `pnpm clean` - Clean build artifacts

### Messaging Service (services/messaging-service)

- `pnpm dev` - Start with nodemon (Port 3001)
- `pnpm start` - Start production server
- `pnpm test` - Run tests with coverage
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database

## Service Ports

| Service           | Port | URL                   |
| ----------------- | ---- | --------------------- |
| Core Webapp       | 3002 | http://localhost:3002 |
| Core Service      | 8080 | http://localhost:8080 |
| Messaging Service | 3001 | http://localhost:3001 |
| Web App           | 3000 | http://localhost:3000 |
| Docs              | 3001 | http://localhost:3001 |

## API Documentation

- **Core Service**: http://localhost:8080/swagger-ui.html
- **Messaging Service**: See `services/messaging-service/API_DOCUMENTATION.md`

## Project Structure

### Apps

- **core-webapp**: Main enterprise web application with features for HR, project management, time tracking, etc.
- **web**: Marketing/public website
- **docs**: Internal documentation site

### Services

- **core-service**: Main backend API handling authentication, users, projects, tasks, employees, etc.
- **messaging-service**: Real-time messaging with Socket.IO for chat, channels, threads, reactions

### Packages

- **@repo/ui**: Shared React components
- **@repo/eslint-config**: Shared ESLint configurations
- **@repo/typescript-config**: Shared TypeScript configurations

## Development Workflow

1. Make changes in your app/service
2. Turborepo will automatically detect changes and rebuild dependencies
3. Hot reload is enabled for all services
4. Run tests before committing: `pnpm test`
5. Format code: `pnpm format`

## Building for Production

```bash
# Build all apps
pnpm build

# Build outputs:
# - core-webapp: apps/core-webapp/dist
# - core-service: services/core-service/target/*.jar
# - messaging-service: Ready to deploy as-is
```

## Troubleshooting

### Port Conflicts

If ports are already in use, update the port numbers in:

- `apps/core-webapp/package.json` (dev script)
- `services/messaging-service/.env` (PORT variable)
- `services/core-service/src/main/resources/application.properties`

### Database Connection Issues

- Ensure MySQL is running
- Check credentials in environment files
- Run migrations: `pnpm db:migrate` in messaging-service

### Build Failures

```bash
# Clean and reinstall
rm -rf node_modules
pnpm install

# Clean Java build
cd services/core-service
./mvnw clean
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Private - All rights reserved
