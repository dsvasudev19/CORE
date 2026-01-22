# Development Guide

## Quick Start

### 1. Prerequisites Installation

```bash
# Install Node.js 18+ and pnpm
npm install -g pnpm

# Verify installations
node --version  # Should be >= 18
pnpm --version  # Should be >= 9.0.0
java --version  # Should be 17
mvn --version   # Maven for Java builds
```

### 2. Clone and Setup

```bash
cd core-platform
pnpm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start MySQL
docker-compose up -d mysql

# Wait for MySQL to be ready, then run migrations
cd services/messaging-service
pnpm db:migrate
pnpm db:seed
```

#### Option B: Local MySQL

```bash
# Create databases
mysql -u root -p
CREATE DATABASE core_db;
CREATE DATABASE messaging_app_dev;

# Run migrations
cd services/messaging-service
pnpm db:migrate
pnpm db:seed
```

### 4. Environment Configuration

#### Core Webapp

```bash
cd apps/core-webapp
cp .env.example .env
# Edit .env if needed
```

#### Messaging Service

```bash
cd services/messaging-service
cp .env.example .env
# Update database credentials
```

#### Core Service

Edit `services/core-service/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/core_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 5. Start Development

```bash
# From root directory
pnpm dev

# Or start services individually:
pnpm dev:webapp      # Frontend on :3002
pnpm dev:core        # Java backend on :8080
pnpm dev:messaging   # Node backend on :3001
```

## Project Structure

```
core-platform/
├── apps/
│   ├── core-webapp/          # Main React application
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── services/     # API services
│   │   │   ├── contexts/     # React contexts
│   │   │   └── types/        # TypeScript types
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── web/                  # Next.js web app
│   └── docs/                 # Documentation site
│
├── services/
│   ├── core-service/         # Spring Boot backend
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   ├── pom.xml
│   │   └── package.json
│   │
│   └── messaging-service/    # Node.js messaging
│       ├── src/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   └── sockets/
│       └── package.json
│
├── packages/
│   ├── ui/                   # Shared components
│   ├── eslint-config/        # ESLint configs
│   └── typescript-config/    # TS configs
│
├── scripts/                  # Utility scripts
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Development Workflow

### Adding a New Feature

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** in the appropriate app/service

3. **Test locally**

   ```bash
   pnpm dev
   # Test your changes
   ```

4. **Run linting and tests**

   ```bash
   pnpm lint
   pnpm test
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

### Working with Multiple Services

Turborepo automatically handles dependencies between packages. When you change a shared package, dependent apps will rebuild automatically.

```bash
# Work on UI package
cd packages/ui
# Make changes...

# Apps using @repo/ui will auto-rebuild
```

### Database Migrations

#### Messaging Service (Sequelize)

```bash
cd services/messaging-service

# Create migration
npx sequelize-cli migration:generate --name your-migration-name

# Run migrations
pnpm db:migrate

# Rollback
pnpm db:migrate:undo
```

#### Core Service (Spring Boot)

Use Flyway or Liquibase migrations in `src/main/resources/db/migration/`

### API Development

#### Core Service (Spring Boot)

1. Create entity in `src/main/java/com/dev/core/entity/`
2. Create repository in `src/main/java/com/dev/core/repository/`
3. Create service in `src/main/java/com/dev/core/service/`
4. Create controller in `src/main/java/com/dev/core/controller/`
5. Test at http://localhost:8080/swagger-ui.html

#### Messaging Service (Express)

1. Create model in `src/models/`
2. Create service in `src/services/`
3. Create controller in `src/controllers/`
4. Add route in `src/routes/`
5. Test with Postman or curl

### Frontend Development

#### Adding a New Page

```bash
cd apps/core-webapp/src/pages
mkdir your-page
touch your-page/YourPage.tsx
```

#### Adding a Component

```bash
cd apps/core-webapp/src/components
mkdir your-component
touch your-component/YourComponent.tsx
```

#### Calling APIs

```typescript
// Use existing service or create new one
import { apiService } from "@/services/api.service";

const data = await apiService.get("/endpoint");
```

## Testing

### Frontend Tests

```bash
cd apps/core-webapp
pnpm test
```

### Backend Tests

#### Core Service

```bash
cd services/core-service
./mvnw test
```

#### Messaging Service

```bash
cd services/messaging-service
pnpm test
```

## Building for Production

### Build All

```bash
pnpm build
```

### Build Individual Services

#### Core Webapp

```bash
cd apps/core-webapp
pnpm build
# Output: dist/
```

#### Core Service

```bash
cd services/core-service
./mvnw clean package
# Output: target/core-service-0.0.1-SNAPSHOT.jar
```

#### Messaging Service

```bash
cd services/messaging-service
# No build needed, deploy as-is
NODE_ENV=production pnpm start
```

## Debugging

### Frontend (Chrome DevTools)

1. Open http://localhost:3002
2. Open Chrome DevTools (F12)
3. Use React DevTools extension

### Backend (Core Service)

1. Run with debug flag:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
   ```
2. Attach debugger to port 5005

### Backend (Messaging Service)

```bash
node --inspect src/server.js
# Attach Chrome DevTools to node process
```

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3002  # or :8080, :3001

# Kill process
kill -9 <PID>
```

### Database Connection Failed

- Check MySQL is running: `mysql -u root -p`
- Verify credentials in .env files
- Check port 3306 is not blocked

### Build Failures

```bash
# Clean everything
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf services/*/node_modules
rm -rf packages/*/node_modules

# Reinstall
pnpm install

# Clean Java build
cd services/core-service
./mvnw clean
```

### Turbo Cache Issues

```bash
# Clear turbo cache
rm -rf .turbo
pnpm build --force
```

## Performance Tips

1. **Use Turbo filters** to run specific apps:

   ```bash
   pnpm dev --filter=core-webapp
   ```

2. **Parallel execution** is automatic with Turborepo

3. **Cache is enabled** for builds - subsequent builds are faster

4. **Hot reload** is enabled for all services

## Code Style

- **Frontend**: ESLint + Prettier
- **Backend (Java)**: Google Java Style Guide
- **Backend (Node)**: ESLint + Prettier

Run formatters:

```bash
pnpm format
```

## Environment Variables

### Core Webapp (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_BASE=http://localhost:8080
VITE_MESSAGING_API_URL=http://localhost:3001
```

### Messaging Service (.env)

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_secret
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=messaging_app_dev
CORE_SERVICE_URL=http://localhost:8080
SOCKET_IO_CORS_ORIGIN=http://localhost:3002
```

### Core Service (application.properties)

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/core_db
spring.datasource.username=root
spring.datasource.password=
```

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Vite Docs](https://vitejs.dev/)
- [Socket.IO Docs](https://socket.io/docs/)
