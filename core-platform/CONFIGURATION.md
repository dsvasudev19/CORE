# Configuration Guide

Complete configuration reference for the Core Platform monorepo.

## Table of Contents
- [Service Ports](#service-ports)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [API Endpoints](#api-endpoints)
- [CORS Configuration](#cors-configuration)
- [Build Configuration](#build-configuration)

## Service Ports

| Service | Port | Protocol | URL |
|---------|------|----------|-----|
| Core Webapp | 3002 | HTTP | http://localhost:3002 |
| Core Service | 8080 | HTTP | http://localhost:8080 |
| Messaging Service | 3001 | HTTP/WS | http://localhost:3001 |
| Web App | 3000 | HTTP | http://localhost:3000 |
| Docs | 3001 | HTTP | http://localhost:3001 |
| MySQL | 3306 | TCP | localhost:3306 |
| PostgreSQL | 5432 | TCP | localhost:5432 |

## Environment Variables

### Core Webapp (`apps/core-webapp/.env`)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_BASE=http://localhost:8080
VITE_MESSAGING_API_URL=http://localhost:3001

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Messaging Service (`services/messaging-service/.env`)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=messaging_app_dev
DB_DIALECT=mysql

# External Services
CORE_SERVICE_URL=http://localhost:8080
USER_SERVICE_URL=http://localhost:8080/api/users
TEAM_SERVICE_URL=http://localhost:8080/api/teams
EMPLOYEE_SERVICE_URL=http://localhost:8080/api/employees

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3002
SOCKET_IO_PATH=/socket.io

# Logging
LOG_LEVEL=info
LOG_FILE=logs/messaging-service.log
```

### Core Service (`services/core-service/src/main/resources/application.properties`)

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/core_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your_jwt_secret_key_here_change_in_production
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads

# CORS
cors.allowed-origins=http://localhost:3002,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true

# Swagger/OpenAPI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

# Mail Configuration (Optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Logging
logging.level.root=INFO
logging.level.com.dev.core=DEBUG
logging.file.name=logs/core-service.log
```

### Alternative: PostgreSQL Configuration

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/core_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## Database Configuration

### MySQL Setup

#### Using Docker
```bash
docker-compose up -d mysql
```

#### Manual Setup
```sql
-- Create databases
CREATE DATABASE core_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE messaging_app_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'coreuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON core_db.* TO 'coreuser'@'localhost';
GRANT ALL PRIVILEGES ON messaging_app_dev.* TO 'coreuser'@'localhost';
FLUSH PRIVILEGES;
```

### PostgreSQL Setup

```bash
# Using Docker
docker-compose up -d postgres

# Or manually
createdb core_db
```

### Messaging Service Migrations

```bash
cd services/messaging-service

# Run migrations
pnpm db:migrate

# Seed data
pnpm db:seed

# Rollback
pnpm db:migrate:undo
```

## API Endpoints

### Core Service (Port 8080)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

#### Users
- `GET /api/users` - List users
- `GET /api/users/{id}` - Get user
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Get project
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Tasks
- `GET /api/tasks` - List tasks
- `GET /api/tasks/{id}` - Get task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

#### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/{id}` - Get employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee

### Messaging Service (Port 3001)

#### REST API
- `GET /api/channels` - List channels
- `POST /api/channels` - Create channel
- `GET /api/channels/{id}/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/direct-messages` - List DMs
- `POST /api/direct-messages` - Create DM

#### WebSocket Events
- `connection` - Client connects
- `join_channel` - Join a channel
- `leave_channel` - Leave a channel
- `send_message` - Send message
- `message_received` - Receive message
- `typing` - User typing indicator
- `reaction_added` - Reaction added
- `disconnect` - Client disconnects

## CORS Configuration

### Core Service (Spring Boot)

Edit `src/main/java/com/dev/core/config/CorsConfig.java`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:3002",
                        "http://localhost:3000"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Messaging Service (Express)

Edit `src/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3000'],
  credentials: true
}));

// Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

## Build Configuration

### Turborepo (`turbo.json`)

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "target/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Vite Configuration (`apps/core-webapp/vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
```

### Maven Configuration (`services/core-service/pom.xml`)

Key configurations:
- Java Version: 17
- Spring Boot: 3.4.1
- Build output: `target/core-service-0.0.1-SNAPSHOT.jar`

## Production Configuration

### Environment-Specific Files

Create separate environment files:
- `.env.development`
- `.env.staging`
- `.env.production`

### Core Webapp Production Build

```bash
cd apps/core-webapp
pnpm build
# Output: dist/

# Serve with nginx or any static server
```

### Core Service Production Build

```bash
cd services/core-service
./mvnw clean package -DskipTests
# Output: target/core-service-0.0.1-SNAPSHOT.jar

# Run
java -jar target/core-service-0.0.1-SNAPSHOT.jar
```

### Messaging Service Production

```bash
cd services/messaging-service
NODE_ENV=production pnpm start
```

## Security Considerations

### JWT Secrets
- Change default JWT secrets in production
- Use strong, random strings (minimum 32 characters)
- Store in environment variables, never commit to git

### Database Passwords
- Use strong passwords in production
- Rotate credentials regularly
- Use database user with minimal required privileges

### CORS Origins
- Restrict to specific domains in production
- Never use `*` for allowed origins with credentials

### File Uploads
- Validate file types and sizes
- Store uploads outside web root
- Scan for malware in production

## Monitoring & Logging

### Log Locations
- Core Service: `services/core-service/logs/core-service.log`
- Messaging Service: `services/messaging-service/logs/messaging-service.log`
- Docker logs: `docker-compose logs -f`

### Health Checks
- Core Service: `GET http://localhost:8080/actuator/health`
- Messaging Service: `GET http://localhost:3001/health`

## Troubleshooting

### Port Conflicts
```bash
# Find process using port
lsof -i :3002
lsof -i :8080
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database Connection Issues
- Verify database is running
- Check credentials in config files
- Ensure database exists
- Check firewall rules

### Build Failures
```bash
# Clear caches
rm -rf .turbo
rm -rf node_modules
pnpm install

# Java clean
cd services/core-service
./mvnw clean
```

## Additional Resources

- [Spring Boot Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
- [Vite Configuration](https://vitejs.dev/config/)
- [Sequelize Configuration](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Socket.IO Configuration](https://socket.io/docs/v4/server-options/)
