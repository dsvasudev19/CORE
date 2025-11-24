# Messaging App API Documentation

## Overview

This document provides comprehensive API documentation for the messaging backend service. The API supports RESTful HTTP endpoints and real-time Socket.IO events.

**Base URL**: `http://localhost:3000`  
**Authentication**: All endpoints require JWT authentication via `Authorization: Bearer <token>` header

---

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The JWT should contain:
- `userId` or `id` - User identifier
- `userName` or `name` - User display name
- `userAvatar` or `avatar` - User avatar URL (optional)

---

## REST API Endpoints

### Health Check

#### GET /health
Check service health status

**Response**:
```json
{
  "status": "healthy",
  "service": "messaging-app",
  "database": "connected",
  "timestamp": "2025-01-24T15:30:00.000Z"
}
```

---

### Channels

#### POST /api/channels
Create a new channel

**Request Body**:
```json
{
  "name": "General Discussion",
  "description": "Team general chat",
  "type": "public",
  "teamId": "team-123",
  "memberIds": ["user-1", "user-2"]
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "name": "General Discussion",
  "type": "public",
  "createdBy": "user-1",
  "createdAt": "2025-01-24T15:30:00.000Z"
}
```

---

#### GET /api/channels
Get all channels for authenticated user

**Query Parameters**:
- `teamId` (optional) - Filter by team
- `type` (optional) - Filter by type (direct, public, private)

**Response**: `200 OK`
```json
{
  "channels": [
    {
      "id": 1,
      "name": "General Discussion",
      "type": "public",
      "unreadCount": 5,
      "lastMessageAt": "2025-01-24T15:30:00.000Z"
    }
  ]
}
```

---

#### GET /api/channels/:channelId
Get channel details

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "General Discussion",
  "description": "Team general chat",
  "type": "public",
  "members": [
    {
      "userId": "user-1",
      "role": "owner",
      "joinedAt": "2025-01-24T15:00:00.000Z"
    }
  ]
}
```

---

#### PUT /api/channels/:channelId
Update channel details

**Request Body**:
```json
{
  "name": "Updated Channel Name",
  "description": "New description"
}
```

**Response**: `200 OK`

---

#### DELETE /api/channels/:channelId
Delete a channel (owner only)

**Response**: `204 No Content`

---

#### POST /api/channels/:channelId/archive
Archive a channel

**Response**: `200 OK`

---

#### POST /api/channels/:channelId/unarchive
Unarchive a channel

**Response**: `200 OK`

---

#### POST /api/channels/:channelId/members
Add members to channel

**Request Body**:
```json
{
  "userIds": ["user-3", "user-4"],
  "role": "member"
}
```

**Response**: `200 OK`

---

#### DELETE /api/channels/:channelId/members/:userId
Remove member from channel

**Response**: `204 No Content`

---

#### PUT /api/channels/:channelId/members/:userId
Update member role

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response**: `200 OK`

---

#### GET /api/channels/direct/:userId
Get or create direct message channel with user

**Response**: `200 OK`
```json
{
  "id": 5,
  "type": "direct",
  "members": ["user-1", "user-2"]
}
```

---

### Messages

#### GET /api/messages/channel/:channelId
Get messages for a channel (paginated)

**Query Parameters**:
- `limit` (default: 50) - Number of messages
- `before` (optional) - Message ID to fetch messages before (cursor pagination)
- `after` (optional) - Message ID to fetch messages after

**Response**: `200 OK`
```json
{
  "messages": [
    {
      "id": 100,
      "channelId": 1,
      "senderId": "user-1",
      "senderName": "John Doe",
      "content": "Hello team!",
      "messageType": "text",
      "reactions": [
        { "emoji": "👍", "userId": "user-2" }
      ],
      "createdAt": "2025-01-24T15:30:00.000Z"
    }
  ],
  "hasMore": true,
  "nextCursor": 50
}
```

---

#### GET /api/messages/:messageId
Get single message with details

**Response**: `200 OK`
```json
{
  "id": 100,
  "content": "Hello team!",
  "reactions": [],
  "mentions": [],
  "attachments": []
}
```

---

#### POST /api/messages
Send a new message

**Request Body**:
```json
{
  "channelId": 1,
  "content": "Hello everyone!",
  "messageType": "text",
  "parentMessageId": null,
  "mentions": ["user-2"],
  "attachments": []
}
```

**Response**: `201 Created`

---

#### PUT /api/messages/:messageId
Edit a message (sender only)

**Request Body**:
```json
{
  "content": "Updated message content"
}
```

**Response**: `200 OK`

---

#### DELETE /api/messages/:messageId
Delete a message (sender or admin)

**Response**: `204 No Content`

---

#### GET /api/messages/:messageId/thread
Get thread replies for a message

**Query Parameters**:
- `limit` (default: 50)
- `offset` (default: 0)

**Response**: `200 OK`
```json
{
  "replies": [
    {
      "id": 101,
      "parentMessageId": 100,
      "content": "Reply to thread"
    }
  ],
  "total": 5
}
```

---

#### POST /api/messages/:messageId/reactions
Add reaction to message

**Request Body**:
```json
{
  "emoji": "👍"
}
```

**Response**: `201 Created`

---

#### DELETE /api/messages/:messageId/reactions/:emoji
Remove reaction from message

**Response**: `204 No Content`

---

#### POST /api/messages/search
Search messages

**Request Body**:
```json
{
  "query": "search term",
  "channelId": 1,
  "limit": 50
}
```

**Response**: `200 OK`
```json
{
  "results": [
    {
      "id": 100,
      "content": "Message containing search term",
      "channelName": "General Discussion"
    }
  ]
}
```

---

#### GET /api/messages/mentions
Get user's mentions

**Query Parameters**:
- `unread` (optional) - Filter unread mentions only

**Response**: `200 OK`
```json
{
  "mentions": [
    {
      "messageId": 100,
      "channelId": 1,
      "senderId": "user-2",
      "isRead": false
    }
  ]
}
```

---

#### POST /api/messages/mark-read
Mark messages as read in a channel

**Request Body**:
```json
{
  "channelId": 1
}
```

**Response**: `200 OK`

---

### File Upload

#### POST /api/upload
Upload file attachment

**Request**: `multipart/form-data`
- `file` - File to upload

**Response**: `200 OK`
```json
{
  "fileUrl": "https://storage.example.com/files/abc123.pdf",
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000
}
```

---

## Socket.IO Events

### Connection

Connect with JWT authentication:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token_here'
  }
});
```

---

### Client → Server Events

#### join-channels
Join multiple channel rooms

**Payload**:
```json
{
  "channelIds": [1, 2, 3]
}
```

**Response Event**: `channels-joined`

---

#### leave-channel
Leave a channel room

**Payload**:
```json
{
  "channelId": 1
}
```

---

#### send-message
Send a new message

**Payload**:
```json
{
  "channelId": 1,
  "content": "Hello!",
  "messageType": "text",
  "parentMessageId": null,
  "mentions": ["user-2"],
  "attachments": []
}
```

**Broadcast Event**: `new-message` (to all channel members)

---

#### edit-message
Edit existing message

**Payload**:
```json
{
  "messageId": 100,
  "content": "Updated content"
}
```

**Broadcast Event**: `message-edited`

---

#### delete-message
Delete a message

**Payload**:
```json
{
  "messageId": 100
}
```

**Broadcast Event**: `message-deleted`

---

#### add-reaction
Add emoji reaction

**Payload**:
```json
{
  "messageId": 100,
  "emoji": "👍"
}
```

**Broadcast Event**: `reaction-added`

---

#### remove-reaction
Remove emoji reaction

**Payload**:
```json
{
  "messageId": 100,
  "emoji": "👍"
}
```

**Broadcast Event**: `reaction-removed`

---

#### typing-start
User started typing

**Payload**:
```json
{
  "channelId": 1
}
```

**Broadcast Event**: `user-typing` (to others in channel)

---

#### typing-stop
User stopped typing

**Payload**:
```json
{
  "channelId": 1
}
```

**Broadcast Event**: `user-stopped-typing`

---

#### mark-read
Mark messages as read

**Payload**:
```json
{
  "channelId": 1,
  "lastMessageId": 100
}
```

**Broadcast Event**: `messages-marked-read`

---

### Server → Client Events

#### new-message
New message received in channel

**Payload**:
```json
{
  "message": {
    "id": 100,
    "channelId": 1,
    "senderId": "user-1",
    "content": "Hello!",
    "createdAt": "2025-01-24T15:30:00.000Z"
  },
  "channelId": 1
}
```

---

#### message-edited
Message was edited

**Payload**:
```json
{
  "messageId": 100,
  "content": "Updated content",
  "isEdited": true,
  "updatedAt": "2025-01-24T15:31:00.000Z"
}
```

---

#### message-deleted
Message was deleted

**Payload**:
```json
{
  "messageId": 100,
  "channelId": 1
}
```

---

#### reaction-added
Reaction added to message

**Payload**:
```json
{
  "messageId": 100,
  "userId": "user-2",
  "emoji": "👍"
}
```

---

#### reaction-removed
Reaction removed from message

**Payload**:
```json
{
  "messageId": 100,
  "userId": "user-2",
  "emoji": "👍"
}
```

---

#### user-typing
User is typing in channel

**Payload**:
```json
{
  "channelId": 1,
  "userId": "user-2",
  "userName": "Jane Doe"
}
```

---

#### user-stopped-typing
User stopped typing

**Payload**:
```json
{
  "channelId": 1,
  "userId": "user-2"
}
```

---

#### messages-marked-read
Messages marked as read

**Payload**:
```json
{
  "channelId": 1,
  "userId": "user-2",
  "lastReadAt": "2025-01-24T15:30:00.000Z"
}
```

---

#### mentioned
User was mentioned in a message

**Payload**:
```json
{
  "messageId": 100,
  "channelId": 1,
  "senderId": "user-1",
  "senderName": "John Doe"
}
```

---

#### presence-changed
User online status changed

**Payload**:
```json
{
  "userId": "user-2",
  "status": "online"
}
```

---

#### error
Error occurred

**Payload**:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

- **Message sending**: 30 messages per minute per user
- **API requests**: 100 requests per minute per user

---

## Best Practices

1. **Pagination**: Always use cursor-based pagination for messages
2. **Typing Indicators**: Auto-stop after 3-5 seconds on client
3. **Reconnection**: Implement exponential backoff for Socket.IO reconnection
4. **Unread Tracking**: Update `last_read_at` when user views channel
5. **Presence**: Update presence on visibility change events

---

## Example Client Implementation

```javascript
// Initialize Socket.IO
const socket = io('http://localhost:3000', {
  auth: { token: userJWT }
});

// Join channels
socket.emit('join-channels', { channelIds: [1, 2, 3] });

// Send message
socket.emit('send-message', {
  channelId: 1,
  content: 'Hello team!',
  messageType: 'text'
});

// Listen for new messages
socket.on('new-message', (data) => {
  console.log('New message:', data.message);
  // Update UI
});

// Typing indicator
let typingTimeout;
inputField.addEventListener('input', () => {
  socket.emit('typing-start', { channelId: 1 });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing-stop', { channelId: 1 });
  }, 3000);
});
```

---

## Database Schema

See [implementation_plan.md](file:///Users/vasudevds/.gemini/antigravity/brain/059806e8-96ec-46e8-99b9-6afb98d86806/implementation_plan.md) for complete database schema details.

---

## Support

For issues or questions, please refer to the main [README.md](file:///Users/vasudevds/Downloads/CORE/messaging-app/README.md).
