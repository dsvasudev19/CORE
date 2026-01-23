# Messaging Service Integration - Requirements (API Gateway Pattern)

## Overview

Integrate the messaging service with core-service using an **API Gateway pattern**. All client requests will go through core-service, which handles authentication and authorization, then proxies requests to the messaging service. The messaging service becomes a pure messaging engine without authentication concerns.

## Architecture Pattern: API Gateway

```
┌─────────────────┐
│ Frontend (React)│
│  (JWT Token)    │
└────────┬────────┘
         │ HTTPS + JWT
         ▼
┌─────────────────────────────────┐
│   Core-Service (Java/Spring)    │
│   - Validates JWT               │
│   - Extracts user context       │
│   - Checks permissions          │
│   - Proxies to messaging        │
└────────┬────────────────────────┘
         │ HTTP + User Context Headers
         ▼
┌─────────────────────────────────┐
│ Messaging-Service (Node.js)     │
│   - No authentication           │
│   - Trusts core-service         │
│   - Pure messaging logic        │
└─────────────────────────────────┘
```

**Key Principle:**

- Frontend → Core-Service (with JWT authentication)
- Core-Service → Messaging-Service (with user context, no auth needed)
- Messaging-Service trusts core-service completely (internal network only)

## Current State Analysis

### What Exists ✅

1. **Messaging Service (Node.js/Express/Socket.IO)**
   - Real-time messaging with Socket.IO
   - Channel-based communication (public, private, direct)
   - Message threading and replies
   - Reactions with emoji support
   - Typing indicators
   - Message editing and deletion
   - @mentions for notifications
   - File attachments support
   - Message search functionality
   - Unread message tracking
   - Channel archiving
   - Member management
   - Complete REST API
   - Socket.IO real-time events

2. **Database Models** (7 models)
   - Message, Channel, ChannelMember
   - MessageAttachment, MessageMention
   - MessageReaction, UserPresence

### What Needs Implementation 🔧

1. **Core-Service HTTP Client**
   - RestTemplate/WebClient configuration
   - Connection pooling and timeouts
   - Error handling and retries
   - Circuit breaker pattern

2. **Core-Service Controllers**
   - MessagingController with proxy endpoints
   - Authentication/authorization before proxying
   - User context extraction and forwarding

3. **Core-Service DTOs**
   - Mirror messaging-service models in Java
   - JSON serialization/deserialization
   - Request/response mappers

4. **Messaging Service Simplification**
   - Remove JWT authentication middleware
   - Accept user context from headers
   - Trust incoming requests (internal only)

## User Stories

### US-1: API Gateway Pattern

**As a** developer  
**I want** all messaging requests to go through core-service  
**So that** authentication and authorization are centralized

**Acceptance Criteria:**

1. Frontend calls core-service endpoints (e.g., `/api/messaging/channels`)
2. Core-service validates JWT token and extracts user info
3. Core-service proxies request to messaging-service with user context
4. Messaging-service processes request without authentication
5. Response flows back through core-service to frontend
6. All authorization checks happen in core-service

### US-2: Core-Service HTTP Client

**As a** core-service  
**I want** to communicate with messaging-service via HTTP client  
**So that** I can proxy messaging requests efficiently

**Acceptance Criteria:**

1. RestTemplate/WebClient configured for messaging-service
2. Connection pooling enabled for performance
3. Timeout configuration (connect: 5s, read: 30s)
4. Retry logic for transient failures (3 retries with backoff)
5. Circuit breaker pattern for service unavailability
6. Request/response logging for debugging

### US-3: Messaging Controllers in Core-Service

**As a** core-service  
**I want** to expose messaging endpoints  
**So that** frontend can access messaging features through authenticated endpoints

**Acceptance Criteria:**

1. `MessagingController` created with all messaging endpoints
2. All endpoints require authentication (`@PreAuthorize`)
3. User context extracted from SecurityContext
4. Requests proxied to messaging-service with user info
5. Responses mapped back to frontend
6. Error handling for messaging-service failures

### US-4: Direct Messaging

**As a** user  
**I want** to send direct messages to other users  
**So that** I can have private conversations

**Acceptance Criteria:**

1. Can create DM channels with any user in organization
2. DM channels are private and only visible to participants
3. Can search for users to start DM
4. DM list shows recent conversations
5. Unread count displayed for each DM

### US-5: Channel Management

**As a** team admin  
**I want** to create and manage channels  
**So that** I can organize team communication

**Acceptance Criteria:**

1. Can create public/private channels for teams
2. Can add/remove members from channels
3. Can archive/unarchive channels
4. Can update channel name and description
5. Channel permissions enforced (owner, admin, member)

### US-6: Real-time Messaging

**As a** user  
**I want** to send and receive messages in real-time  
**So that** I can have instant communication

**Acceptance Criteria:**

1. Messages appear instantly for all channel members
2. Typing indicators show when others are typing
3. Message delivery status shown (sent, delivered, read)
4. Connection status displayed (online, offline, reconnecting)
5. Messages queued when offline and sent when reconnected

### US-7: Message Features

**As a** user  
**I want** rich messaging features  
**So that** I can communicate effectively

**Acceptance Criteria:**

1. Can format messages (bold, italic, code blocks)
2. Can attach files (images, documents, etc.)
3. Can react to messages with emojis
4. Can edit my own messages
5. Can delete my own messages
6. Can reply in threads
7. Can @mention other users
8. Can search messages across channels

### US-8: Notifications

**As a** user  
**I want** to receive notifications for important messages  
**So that** I don't miss important communication

**Acceptance Criteria:**

1. Notified when mentioned in a message
2. Notified for direct messages
3. Unread count displayed per channel
4. Can mark channels as read
5. Notification preferences configurable

## Technical Requirements

### TR-1: Request Flow (API Gateway Pattern)

```
1. Frontend → Core-Service: GET /api/messaging/channels (with JWT)
2. Core-Service: Validate JWT, extract user context
3. Core-Service → Messaging-Service: GET /api/channels (with user context headers)
4. Messaging-Service: Process request, return data
5. Core-Service → Frontend: Return response
```

### TR-2: Core-Service Components to Build

**1. HTTP Client Configuration**

```java
@Configuration
public class MessagingServiceConfig {
    @Value("${messaging.service.url}")
    private String messagingServiceUrl;

    @Bean
    public RestTemplate messagingServiceRestTemplate() {
        // Configure connection pooling, timeouts, interceptors
        HttpComponentsClientHttpRequestFactory factory =
            new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(30000);
        return new RestTemplate(factory);
    }
}
```

**2. Messaging Client Service**

```java
@Service
public class MessagingServiceClient {
    private final RestTemplate restTemplate;
    private final String messagingServiceUrl;

    // Methods to call messaging-service endpoints
    public ChannelDTO createChannel(CreateChannelRequest request, UserContext user);
    public List<ChannelDTO> getChannels(Long userId, Long organizationId);
    public List<MessageDTO> getMessages(Long channelId, Long userId);
    public MessageDTO sendMessage(SendMessageRequest request, UserContext user);
    // ... etc
}
```

**3. Messaging Controller**

```java
@RestController
@RequestMapping("/api/messaging")
@RequiredArgsConstructor
public class MessagingController {
    private final MessagingServiceClient messagingClient;
    private final AuthorizationService authorizationService;

    @PostMapping("/channels")
    @PreAuthorize("hasAuthority('MESSAGING_CREATE_CHANNEL')")
    public ResponseEntity<ChannelDTO> createChannel(
        @RequestBody CreateChannelRequest request
    ) {
        UserContext user = SecurityContextUtil.getCurrentUser();
        authorizationService.authorize("MESSAGING", "CREATE");
        return ResponseEntity.ok(messagingClient.createChannel(request, user));
    }

    // ... more endpoints
}
```

**4. DTOs (Data Transfer Objects)**
All messaging DTOs in Java:

- ChannelDTO, MessageDTO, UserPresenceDTO
- CreateChannelRequest, SendMessageRequest
- AddReactionRequest, MarkReadRequest
- etc.

### TR-3: User Context Headers

Core-service will pass user context to messaging-service via headers:

```
X-User-Id: 123
X-User-Name: John Doe
X-User-Email: john@example.com
X-Organization-Id: 456
X-User-Roles: ADMIN,USER
```

Messaging-service will extract these headers and use them instead of JWT validation.

### TR-4: Messaging-Service Simplification

**Remove:**

- `src/middleware/auth.js` - JWT authentication
- `src/utils/auth.js` - Token validation
- `src/services/externalServices.js` - External API calls

**Add:**

- New middleware to extract user context from headers
- Trust all incoming requests (internal network only)

**Example:**

```javascript
// New: src/middleware/userContext.js
exports.extractUserContext = (req, res, next) => {
  req.user = {
    userId: req.headers["x-user-id"],
    userName: req.headers["x-user-name"],
    email: req.headers["x-user-email"],
    organizationId: req.headers["x-organization-id"],
    roles: req.headers["x-user-roles"]?.split(",") || [],
  };
  next();
};
```

### TR-5: Core-Service Endpoints to Create

**Channel Management:**

- `POST /api/messaging/channels` - Create channel
- `GET /api/messaging/channels` - List user's channels
- `GET /api/messaging/channels/{id}` - Get channel details
- `PUT /api/messaging/channels/{id}` - Update channel
- `DELETE /api/messaging/channels/{id}` - Delete channel
- `POST /api/messaging/channels/{id}/members` - Add members
- `DELETE /api/messaging/channels/{id}/members/{userId}` - Remove member
- `POST /api/messaging/channels/{id}/archive` - Archive channel
- `POST /api/messaging/channels/{id}/unarchive` - Unarchive channel
- `GET /api/messaging/channels/direct/{userId}` - Get/create DM

**Message Management:**

- `GET /api/messaging/channels/{id}/messages` - Get messages (paginated)
- `POST /api/messaging/messages` - Send message
- `PUT /api/messaging/messages/{id}` - Edit message
- `DELETE /api/messaging/messages/{id}` - Delete message
- `GET /api/messaging/messages/{id}` - Get single message
- `GET /api/messaging/messages/{id}/thread` - Get thread replies
- `POST /api/messaging/messages/{id}/reactions` - Add reaction
- `DELETE /api/messaging/messages/{id}/reactions/{emoji}` - Remove reaction
- `POST /api/messaging/messages/search` - Search messages
- `POST /api/messaging/messages/mark-read` - Mark as read
- `GET /api/messaging/messages/mentions` - Get user mentions

**File Upload:**

- `POST /api/messaging/upload` - Upload file attachment

### TR-6: Security Requirements

- All core-service endpoints require authentication
- Authorization checks before proxying to messaging-service
- Messaging-service accessible only from core-service (network isolation)
- User context passed via internal headers (not exposed to frontend)
- File upload validation and scanning
- Rate limiting on core-service endpoints
- Input validation on all requests

### TR-7: Performance Requirements

- Core-service proxy overhead < 20ms
- Connection pooling for messaging-service calls (min: 10, max: 50)
- Async processing where possible
- Circuit breaker to prevent cascade failures
- Response caching for read-heavy endpoints (optional)
- Database connection pooling in messaging-service

### TR-8: Error Handling

- Messaging-service errors mapped to appropriate HTTP status codes
- Detailed error logging in core-service
- Generic error messages to frontend (no internal details)
- Retry logic for transient failures (3 retries with exponential backoff)
- Fallback responses when messaging-service unavailable
- Circuit breaker opens after 5 consecutive failures

## Non-Functional Requirements

### NFR-1: Scalability

- Horizontal scaling support for both services
- Redis for Socket.IO adapter (multi-instance support)
- Database connection pooling
- Load balancing for messaging-service instances

### NFR-2: Reliability

- 99.9% uptime target
- Automatic reconnection for Socket.IO
- Message persistence in database
- Health check endpoints for monitoring

### NFR-3: Monitoring

- Application metrics (request rate, latency, errors)
- Database performance metrics
- Socket.IO connection metrics
- Circuit breaker status monitoring

### NFR-4: Documentation

- API documentation for core-service endpoints
- Integration guide for frontend
- Deployment guide
- Troubleshooting guide

## Implementation Phases

### Phase 1: Core-Service HTTP Client (2-3 days)

**Tasks:**

- Configure RestTemplate/WebClient
- Create MessagingServiceClient
- Implement connection pooling and error handling
- Add logging and monitoring
- Write unit tests

### Phase 2: Core-Service DTOs (1-2 days)

**Tasks:**

- Create all messaging DTOs in Java
- Add JSON serialization annotations
- Create request/response mappers
- Add validation annotations
- Write tests

### Phase 3: Core-Service Controllers (2-3 days)

**Tasks:**

- Create MessagingController
- Implement all proxy endpoints
- Add authentication/authorization
- Handle user context extraction
- Error handling and logging
- Write integration tests

### Phase 4: Messaging-Service Simplification (1-2 days)

**Tasks:**

- Remove JWT authentication middleware
- Create user context extraction middleware
- Update all routes to use new middleware
- Remove external service calls
- Test internal communication

### Phase 5: Testing & Documentation (2-3 days)

**Tasks:**

- Integration testing (core-service ↔ messaging-service)
- Performance testing (load testing)
- Security testing (penetration testing)
- Update API documentation
- Create deployment guide

**Total Estimate: 8-13 days (2-2.5 weeks)**

## Dependencies

- Core-service must be running and accessible
- Messaging-service must be running (internal network)
- MySQL database for messaging data
- Redis for Socket.IO scaling (optional but recommended)
- File storage service for attachments

## Success Criteria

1. ✅ All messaging endpoints accessible through core-service
2. ✅ Authentication/authorization handled by core-service
3. ✅ Messaging-service has no authentication logic
4. ✅ User context properly passed between services
5. ✅ Performance meets requirements (< 20ms proxy overhead)
6. ✅ Error handling comprehensive and user-friendly
7. ✅ Security requirements met (network isolation, validation)
8. ✅ Documentation complete and accurate

## Risks and Mitigations

| Risk                             | Impact | Mitigation                                  |
| -------------------------------- | ------ | ------------------------------------------- |
| Messaging-service downtime       | High   | Circuit breaker, health checks, monitoring  |
| Network latency between services | Medium | Connection pooling, async processing        |
| Data sync issues                 | Low    | Eventual consistency, retry logic           |
| Security vulnerabilities         | High   | Network isolation, input validation, audits |
| Performance degradation          | Medium | Load testing, caching, optimization         |

## Out of Scope

- Video/voice calling (future enhancement)
- Screen sharing (future enhancement)
- Message translation (future enhancement)
- AI-powered features (future enhancement)
- Mobile push notifications (future enhancement)

## Configuration Changes

### Core-Service application.properties

```properties
# Messaging Service Configuration
messaging.service.url=http://localhost:3001
messaging.service.connect-timeout=5000
messaging.service.read-timeout=30000
messaging.service.max-connections=50
messaging.service.circuit-breaker.enabled=true
```

### Messaging-Service .env

```bash
# Remove JWT_SECRET (no longer needed)
# Add internal network flag
INTERNAL_NETWORK_ONLY=true
TRUSTED_PROXY=core-service
```

## Next Steps

1. ✅ Review and approve requirements
2. Create detailed design document with:
   - Complete list of DTOs
   - Controller method signatures
   - HTTP client configuration
   - Error handling strategy
   - Sequence diagrams
3. Begin implementation with Phase 1 (HTTP Client)
4. Proceed through phases sequentially
5. Test thoroughly at each phase
6. Deploy and monitor
