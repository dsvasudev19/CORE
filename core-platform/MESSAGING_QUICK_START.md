# Messaging System - Quick Start Guide 🚀

Get the messaging system up and running in 5 minutes!

## Prerequisites

- Java 17+ installed
- Node.js 18+ installed
- MySQL running
- Git (to clone if needed)

## Step 1: Install Dependencies

```bash
# Frontend dependencies
cd core-platform/apps/core-webapp
npm install

# Messaging service dependencies (if not done)
cd ../../services/messaging-service
npm install
```

## Step 2: Configure Environment

### Core-Service

File: `core-platform/services/core-service/src/main/resources/application-mysql.properties`

```properties
# Should already be configured:
messaging.service.url=http://localhost:3001
messaging.service.connect-timeout=5000
messaging.service.read-timeout=30000
```

### Messaging-Service

File: `core-platform/services/messaging-service/.env`

```bash
PORT=3001
NODE_ENV=development
INTERNAL_NETWORK_ONLY=true
TRUSTED_PROXY=core-service

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=messaging_app_dev

CORE_SERVICE_URL=http://localhost:8080
SOCKET_IO_CORS_ORIGIN=http://localhost:5173
```

### Frontend

File: `core-platform/apps/core-webapp/.env`

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_BASE=http://localhost:8080
VITE_MESSAGING_SERVICE_URL=http://localhost:3001
```

## Step 3: Create Database

```bash
# Create messaging database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS messaging_app_dev;"

# Run migrations
cd core-platform/services/messaging-service
npm run db:migrate
```

## Step 4: Start Services

Open 3 terminal windows:

### Terminal 1: Core-Service

```bash
cd core-platform/services/core-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

Wait for: `Started CoreServiceApplication`

### Terminal 2: Messaging-Service

```bash
cd core-platform
./scripts/start-messaging-service.sh
```

Or manually:

```bash
cd core-platform/services/messaging-service
npm run dev
```

Wait for: `Messaging app running on port 3001`

### Terminal 3: Frontend

```bash
cd core-platform/apps/core-webapp
npm run dev
```

Wait for: `Local: http://localhost:5173`

## Step 5: Access the Application

1. **Open browser:** http://localhost:5173

2. **Login:**
   - Email: `admin@system.com`
   - Password: `Admin@123`

3. **Navigate to Messaging:**
   - Click on "Messaging" in sidebar, or
   - Go directly to: http://localhost:5173/a/messaging

## Step 6: Test It Out!

### Create a Test Channel (via API)

```bash
# Get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@system.com",
    "password": "Admin@123"
  }'

# Save the token
export JWT_TOKEN="your-token-here"

# Create a channel
curl -X POST http://localhost:8080/api/messaging/channels \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "general",
    "description": "General discussion",
    "type": "public"
  }'
```

### Send Messages

1. Refresh the messaging page
2. Click on the "general" channel
3. Type a message in the input box
4. Click "Send"
5. See your message appear!

### Test Real-time (Optional)

1. Open another browser window (or incognito)
2. Login as a different user (if you have one)
3. Navigate to messaging
4. Send a message from one window
5. See it appear in the other window instantly!

## Verification Checklist

- [ ] Core-service running on port 8080
- [ ] Messaging-service running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can login to application
- [ ] Can access messaging page
- [ ] See green connection indicator
- [ ] Can see channel list
- [ ] Can click on a channel
- [ ] Can send a message
- [ ] Message appears in chat

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port
lsof -ti:8080 | xargs kill -9  # Core-service
lsof -ti:3001 | xargs kill -9  # Messaging-service
lsof -ti:5173 | xargs kill -9  # Frontend
```

### Database Connection Error

```bash
# Check MySQL is running
mysql -u root -e "SELECT 1;"

# Create database if missing
mysql -u root -e "CREATE DATABASE IF NOT EXISTS messaging_app_dev;"
```

### Socket.IO Not Connecting

1. Check messaging-service is running
2. Check CORS configuration
3. Check browser console for errors
4. Verify `VITE_MESSAGING_SERVICE_URL` in .env

### No Channels Showing

```bash
# Create a test channel via API (see Step 6 above)
```

### 401 Unauthorized

1. Check you're logged in
2. Token might be expired - re-login
3. Check JWT_SECRET matches between services

### 403 Forbidden

1. Check user has MESSAGING permissions
2. Verify SystemSeederService ran
3. Check database for MESSAGING resource

## Next Steps

Once everything is working:

1. **Read the documentation:**
   - `MESSAGING_INTEGRATION_COMPLETE.md` - Full overview
   - `MESSAGING_API_TESTING_GUIDE.md` - API testing
   - `MESSAGING_INTEGRATION_FINAL_SUMMARY.md` - Summary

2. **Explore the code:**
   - Backend: `services/core-service/src/main/java/com/dev/core/controller/MessagingController.java`
   - Frontend: `apps/core-webapp/src/pages/messaging/Messaging.tsx`
   - Socket.IO: `apps/core-webapp/src/hooks/useMessaging.ts`

3. **Customize:**
   - Add more channels
   - Invite team members
   - Customize UI styling
   - Add more features

## Quick Commands Reference

```bash
# Start all services (3 terminals)
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql  # Terminal 1
./scripts/start-messaging-service.sh                      # Terminal 2
npm run dev                                                # Terminal 3

# Stop all services
Ctrl+C in each terminal

# View logs
tail -f services/messaging-service/logs/combined.log      # Messaging logs
tail -f services/core-service/logs/spring.log             # Core logs (if configured)

# Rebuild frontend
cd apps/core-webapp
npm run build

# Run tests
cd services/messaging-service
npm test
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in each service
3. Check the documentation files
4. Verify all environment variables are set correctly

## Success! 🎉

If you can send and receive messages, congratulations! Your messaging system is working perfectly.

Enjoy your new real-time messaging platform! 💬
