# Messaging API Testing Guide

## Prerequisites

1. Core-service running on `http://localhost:8080`
2. Messaging-service running on `http://localhost:3001`
3. Valid JWT token from core-service login
4. User with MESSAGING permissions

## Getting a JWT Token

```bash
# Login to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@system.com",
    "password": "Admin@123"
  }'

# Response will contain:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { ... }
# }

# Save the token for subsequent requests
export JWT_TOKEN="your-token-here"
```

## Channel Management Tests

### 1. Create a Public Channel

```bash
curl -X POST http://localhost:8080/api/messaging/channels \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "general",
    "description": "General discussion channel",
    "type": "public",
    "teamId": null
  }'
```

**Expected Response (201 Created):**

```json
{
  "id": 1,
  "name": "general",
  "description": "General discussion channel",
  "type": "public",
  "createdBy": "1",
  "organizationId": 1,
  "teamId": null,
  "isArchived": false,
  "createdAt": "2026-01-23T10:00:00Z",
  "updatedAt": "2026-01-23T10:00:00Z"
}
```

### 2. Create a Private Channel

```bash
curl -X POST http://localhost:8080/api/messaging/channels \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dev-team",
    "description": "Private channel for developers",
    "type": "private",
    "teamId": 5
  }'
```

### 3. List All Channels

```bash
curl -X GET http://localhost:8080/api/messaging/channels \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Expected Response (200 OK):**

```json
{
  "channels": [
    {
      "id": 1,
      "name": "general",
      "type": "public",
      "unreadCount": 0,
      ...
    },
    {
      "id": 2,
      "name": "dev-team",
      "type": "private",
      "unreadCount": 5,
      ...
    }
  ]
}
```

### 4. Get Channel Details

```bash
curl -X GET http://localhost:8080/api/messaging/channels/1 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 5. Update Channel

```bash
curl -X PUT http://localhost:8080/api/messaging/channels/1 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "general-chat",
    "description": "Updated description"
  }'
```

### 6. Archive Channel

```bash
curl -X POST http://localhost:8080/api/messaging/channels/1/archive \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 7. Unarchive Channel

```bash
curl -X POST http://localhost:8080/api/messaging/channels/1/unarchive \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 8. Add Members to Channel

```bash
curl -X POST http://localhost:8080/api/messaging/channels/1/members \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["2", "3", "4"]
  }'
```

### 9. Remove Member from Channel

```bash
curl -X DELETE http://localhost:8080/api/messaging/channels/1/members/2 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 10. Get or Create Direct Message

```bash
curl -X GET http://localhost:8080/api/messaging/channels/direct/2 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Message Management Tests

### 11. Send a Message

```bash
curl -X POST http://localhost:8080/api/messaging/messages \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": 1,
    "content": "Hello everyone! This is my first message.",
    "parentId": null,
    "mentions": []
  }'
```

**Expected Response (201 Created):**

```json
{
  "id": 1,
  "channelId": 1,
  "userId": "1",
  "userName": "admin",
  "content": "Hello everyone! This is my first message.",
  "parentId": null,
  "mentions": [],
  "attachments": [],
  "reactions": [],
  "isEdited": false,
  "isDeleted": false,
  "createdAt": "2026-01-23T10:05:00Z",
  "updatedAt": "2026-01-23T10:05:00Z"
}
```

### 12. Get Messages from Channel

```bash
# Get latest 50 messages
curl -X GET "http://localhost:8080/api/messaging/channels/1/messages?limit=50" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get messages before a specific message ID (pagination)
curl -X GET "http://localhost:8080/api/messaging/channels/1/messages?limit=50&before=100" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get messages after a specific message ID
curl -X GET "http://localhost:8080/api/messaging/channels/1/messages?limit=50&after=50" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Expected Response (200 OK):**

```json
{
  "messages": [
    {
      "id": 1,
      "channelId": 1,
      "content": "Hello everyone!",
      ...
    }
  ],
  "hasMore": false
}
```

### 13. Get Single Message

```bash
curl -X GET http://localhost:8080/api/messaging/messages/1 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 14. Update/Edit Message

```bash
curl -X PUT http://localhost:8080/api/messaging/messages/1 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello everyone! This is my edited message."
  }'
```

### 15. Delete Message

```bash
curl -X DELETE http://localhost:8080/api/messaging/messages/1 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 16. Reply in Thread

```bash
curl -X POST http://localhost:8080/api/messaging/messages \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": 1,
    "content": "This is a reply in the thread",
    "parentId": 1,
    "mentions": []
  }'
```

### 17. Get Thread Replies

```bash
curl -X GET "http://localhost:8080/api/messaging/messages/1/thread?limit=50&offset=0" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 18. Add Reaction to Message

```bash
curl -X POST http://localhost:8080/api/messaging/messages/1/reactions \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emoji": "👍"
  }'
```

### 19. Remove Reaction from Message

```bash
# URL encode the emoji (👍 = %F0%9F%91%8D)
curl -X DELETE "http://localhost:8080/api/messaging/messages/1/reactions/%F0%9F%91%8D" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### 20. Search Messages

```bash
curl -X POST http://localhost:8080/api/messaging/messages/search \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "hello",
    "channelId": 1,
    "limit": 50
  }'
```

### 21. Mark Messages as Read

```bash
curl -X POST http://localhost:8080/api/messaging/messages/mark-read \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": 1,
    "messageId": 10
  }'
```

## Authorization Tests

### Test Unauthorized Access (No Token)

```bash
curl -X GET http://localhost:8080/api/messaging/channels
# Expected: 401 Unauthorized
```

### Test Forbidden Access (No MESSAGING Permission)

```bash
# Login as a user without MESSAGING permissions
# Then try to access messaging endpoints
curl -X GET http://localhost:8080/api/messaging/channels \
  -H "Authorization: Bearer $JWT_TOKEN_WITHOUT_PERMISSION"
# Expected: 403 Forbidden
```

## Error Scenarios

### Invalid Channel ID

```bash
curl -X GET http://localhost:8080/api/messaging/channels/99999 \
  -H "Authorization: Bearer $JWT_TOKEN"
# Expected: 404 Not Found or 500 with error message
```

### Invalid Message ID

```bash
curl -X GET http://localhost:8080/api/messaging/messages/99999 \
  -H "Authorization: Bearer $JWT_TOKEN"
# Expected: 404 Not Found or 500 with error message
```

### Messaging Service Down

```bash
# Stop messaging-service
# Then try any endpoint
curl -X GET http://localhost:8080/api/messaging/channels \
  -H "Authorization: Bearer $JWT_TOKEN"
# Expected: 503 Service Unavailable or 500 with connection error
```

## Postman Collection

You can import this as a Postman collection:

1. Create a new collection "Messaging API"
2. Add environment variable `JWT_TOKEN`
3. Add environment variable `BASE_URL` = `http://localhost:8080`
4. Create requests for each endpoint above
5. Use `{{JWT_TOKEN}}` in Authorization header
6. Use `{{BASE_URL}}` in request URLs

## Expected Logs

When testing, you should see logs in core-service like:

```
INFO  c.d.c.controller.MessagingController : Creating channel: general
INFO  c.d.c.client.MessagingServiceClient  : Creating channel: general for user: 1
INFO  c.d.c.client.MessagingServiceClient  : Channel created successfully with ID: 1
```

And in messaging-service:

```
INFO: POST /api/channels - User: 1 (admin@system.com)
INFO: Channel created: general (ID: 1)
```

## Troubleshooting

### 401 Unauthorized

- Check JWT token is valid and not expired
- Verify Authorization header format: `Bearer <token>`
- Check core-service logs for authentication errors

### 403 Forbidden

- Verify user has MESSAGING permissions
- Check role assignments in database
- Review SystemSeederService logs for permission creation

### 500 Internal Server Error

- Check core-service logs for detailed error
- Verify messaging-service is running
- Check network connectivity between services
- Verify database connections

### Connection Refused

- Ensure messaging-service is running on port 3001
- Check `messaging.service.url` in application-mysql.properties
- Verify firewall rules allow communication

## Next Steps

Once all tests pass:

1. ✅ Authentication works correctly
2. ✅ Authorization enforced properly
3. ✅ All endpoints return expected responses
4. ✅ Error handling works as expected

Then proceed to **Phase 3: Messaging-Service Simplification**
