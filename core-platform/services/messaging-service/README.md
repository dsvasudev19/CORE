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

This service is designed to work within a microservices architecture:
- **User details** are fetched from User Service
- **Team details** are fetched from Team Service  
- **Employee details** are fetched from Employee Service
- This service focuses solely on messaging functionality

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MySQL** - Relational database
- **Sequelize** - ORM for MySQL
- **JWT** - Authentication
- **Winston** - Logging

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
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=messaging_app_dev

# External Services
USER_SERVICE_URL=http://localhost:3001
TEAM_SERVICE_URL=http://localhost:3002
EMPLOYEE_SERVICE_URL=http://localhost:3003

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3001
```

4. Run database migrations:
```bash
npm run db:migrate
```

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

All API endpoints require JWT authentication via `Authorization: Bearer <token>` header.

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

Connect with JWT token:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

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

The app integrates with external services for:
- **User details** - Username, email, profile
- **Team membership** - Team access verification
- **Employee information** - Employee metadata

Configure service URLs in `.env` file.

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
