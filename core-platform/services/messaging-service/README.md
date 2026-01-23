# Messaging App

A real-time messaging application built with Node.js, Express, Socket.IO, and MySQL. This service handles all chat functionality including channels, direct messages, threads, reactions, and more.

## Features

- **Real-time messaging** with Socket.IO
- **Channel-based communication** (public, private, direct)
- **Message threading** for organized conversations
- **Reactions** with emoji support
- **Typing indicators** for real-time presence
- **Message editing and deletion**
- **@mentions** for user notifications
- **File attachments** support
- **Message search** functionality
- **Unread message tracking**
- **Channel archiving**
- **Member management** (add/remove)
- **Integration with external services** for user/team/employee data

## Architecture

This service is designed to work within a microservices architecture using an **API Gateway pattern**:

- **Core-Service** handles ALL authentication and authorization
- **Core-Service** proxies requests to this messaging-service with user context
- This service trusts core-service completely (internal network only)
- User context is passed via headers (X-User-Id, X-User-Name, X-User-Email, X-Organization-Id)
- **No JWT authentication** in this service - it's handled upstream by core-service

```
Frontend → Core-Service (JWT Auth) → Messaging-Service (User Context Headers)
```

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MySQL** - Relational database
- **Sequelize** - ORM for MySQL
- **Winston** - Logging
- **User Context Headers** - Authentication via core-service (no JWT in this service)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```
PORT=3001
NODE_ENV=development

# Security Configuration
INTERNAL_NETWORK_ONLY=true
TRUSTED_PROXY=core-service

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=messaging_app_dev

# External Services
CORE_SERVICE_URL=http://localhost:8080

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:5173
```

**Note:** JWT_SECRET is no longer needed as authentication is handled by core-service.
DB_NAME=messaging_app_dev

# External Services

USER_SERVICE_URL=http://localhost:3001
TEAM_SERVICE_URL=http://localhost:3002
EMPLOYEE_SERVICE_URL=http://localhost:3003

# Socket.IO Configuration

SOCKET_IO_CORS_ORIGIN=http://localhost:3001

````

4. Run database migrations:

```bash
npm run db:migrate
````

## Running the Application

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Service health status

### Messages

- `GET /api/messages/channel/:channelId` - Get channel messages
- `GET /api/messages/:messageId` - Get specific message
- `GET /api/messages/thread/:threadId` - Get thread messages
- `POST /api/messages/search` - Search messages

### Channels

- `POST /api/channels` - Create new channel
- `GET /api/channels/team/:teamId` - Get team channels
- `GET /api/channels/:channelId` - Get channel details
- `PUT /api/channels/:channelId` - Update channel
- `DELETE /api/channels/:channelId` - Delete channel
- `POST /api/channels/:channelId/members` - Add members
- `DELETE /api/channels/:channelId/members/:userId` - Remove member
- `POST /api/channels/:channelId/archive` - Archive channel
- `POST /api/channels/:channelId/unarchive` - Unarchive channel

All API endpoints expect user context headers from core-service:

- `X-User-Id`: User's ID
- `X-User-Name`: User's name
- `X-User-Email`: User's email
- `X-Organization-Id`: Organization ID

**Note:** This service should only be accessible from core-service (internal network). Direct access from frontend is not supported.

## Socket.IO Events

### Client → Server

- `join-channels` - Join multiple channels
- `send-message` - Send a new message
- `edit-message` - Edit existing message
- `delete-message` - Delete message
- `add-reaction` - Add emoji reaction
- `typing-start` - User started typing
- `typing-stop` - User stopped typing
- `mark-read` - Mark messages as read

### Server → Client

- `new-message` - New message received
- `message-edited` - Message was edited
- `message-deleted` - Message was deleted
- `reaction-added` - Reaction was added
- `user-typing` - User is typing
- `user-stopped-typing` - User stopped typing
- `messages-marked-read` - Messages marked as read
- `error` - Error occurred

## Socket.IO Authentication

Connect with user context (passed from core-service):

```javascript
const socket = io("http://localhost:3001", {
  auth: {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userAvatar: user.avatar,
  },
});
```

**Note:** In production, Socket.IO connections should also go through core-service or use a secure token mechanism.

## Database Models

### Message

- channelId, senderId, senderName, content
- messageType (text, image, file, system)
- attachments, mentions, reactions
- threadId, replyCount
- isEdited, isDeleted
- timestamps

### Channel

- name, description, type (public, private, direct)
- teamId, createdBy
- members (with roles)
- isArchived, lastMessageAt
- unreadCounts (per user)
- timestamps

## External Service Integration

This service integrates with core-service for:

- **User context** - Passed via headers from core-service
- **Authentication** - Handled entirely by core-service
- **Authorization** - Enforced by core-service before proxying requests

All requests to this service should come from core-service only (internal network).

## Error Handling

All errors are logged with Winston and returned with appropriate HTTP status codes:

- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Internal server error

## Logging

Logs are stored in the `logs/` directory:

- `error.log` - Error-level logs only
- `combined.log` - All logs

Console output is enabled in development mode.

## Development

Run tests:

```bash
npm test
```

## Project Structure

```
messaging-app/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── channelController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Channel.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── channelRoutes.js
│   │   └── messageRoutes.js
│   ├── services/
│   │   └── externalServices.js
│   ├── sockets/
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── auth.js
│   │   └── logger.js
│   └── server.js
├── logs/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License

ISC
