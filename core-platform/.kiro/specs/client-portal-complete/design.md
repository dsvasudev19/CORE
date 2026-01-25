# Client Portal - Phase 1 Design Document

## 1. Overview

### 1.1 Purpose

Design a complete client portal system that enables external clients to access their projects, tasks, bugs, documents, and support tickets through a secure, user-friendly interface.

### 1.2 Architecture Approach

- **Backend**: RESTful API with Spring Boot
- **Frontend**: React with TypeScript
- **Authentication**: JWT-based with role-based access control
- **Database**: MySQL with proper indexing
- **File Storage**: Existing file storage service
- **Real-time**: WebSocket for notifications (future) or polling

### 1.3 Design Principles

- Security first: All client data must be properly scoped
- Performance: Optimize queries with proper indexing
- User experience: Intuitive navigation and clear feedback
- Maintainability: Clean separation of concerns
- Scalability: Design for growth

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Portal Frontend                   │
│  (React + TypeScript + TailwindCSS + React Router)          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Spring Boot Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │  Services    │  │ Repositories │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│  - Clients, Projects, Tasks, Bugs                           │
│  - Support Tickets, Documents, Notifications                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

**Backend Components:**

- ClientPortalController: Client-facing API endpoints
- SupportTicketController: Ticket management
- NotificationController: Notification management
- ClientInvitationService: Invitation workflow
- ClientPortalService: Client-specific data filtering
- SupportTicketService: Ticket CRUD and workflow
- NotificationService: Notification creation and delivery

**Frontend Components:**

- ClientLayout: Main layout with sidebar and header
- Dashboard widgets: Stats, activities, milestones
- Project/Task/Bug views: List and detail pages
- Support ticket components: List, create, detail
- Document viewer: Preview and download
- Notification center: Dropdown and preferences

---

## 3. Database Design

### 3.1 New Tables

#### Support Tickets Table

```sql
CREATE TABLE support_tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    client_id BIGINT NOT NULL,
    project_id BIGINT,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    assigned_to BIGINT,
    created_by BIGINT NOT NULL,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    organization_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    INDEX idx_client_status (client_id, status),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_at (created_at)
);
```

#### Support Ticket Comments Table

```sql
CREATE TABLE support_ticket_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_created_at (created_at)
);
```

#### Support Ticket Attachments Table

```sql
CREATE TABLE support_ticket_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    file_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_ticket_id (ticket_id)
);
```

#### Client Invitations Table

```sql
CREATE TABLE client_invitations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    client_id BIGINT NOT NULL,
    representative_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    temporary_password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    accepted_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (representative_id) REFERENCES client_representatives(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_token (invitation_token),
    INDEX idx_email (email),
    INDEX idx_status (status)
);
```

#### Notifications Table

```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created_at (created_at)
);
```

### 3.2 Existing Table Modifications

#### Users Table

- No changes needed, already has role support

#### Client Representatives Table

- Add `user_id` column to link representative to user account

```sql
ALTER TABLE client_representatives
ADD COLUMN user_id BIGINT,
ADD FOREIGN KEY (user_id) REFERENCES users(id);
```

---

## 4. API Design

### 4.1 Client Portal Endpoints

#### Dashboard

```
GET /api/client-portal/dashboard/stats
Response: {
  totalProjects: number,
  activeProjects: number,
  totalTasks: number,
  activeTasks: number,
  totalBugs: number,
  openBugs: number,
  openTickets: number,
  unreadMessages: number
}

GET /api/client-portal/dashboard/activities?limit=10
Response: Activity[]
```

#### Projects

```
GET /api/client-portal/projects
Query params: status, search, page, size
Response: Page<ProjectDTO>

GET /api/client-portal/projects/{id}
Response: ProjectDetailDTO

GET /api/client-portal/projects/{id}/tasks
Response: TaskDTO[]

GET /api/client-portal/projects/{id}/bugs
Response: BugDTO[]
```

#### Tasks

```
GET /api/client-portal/tasks
Query params: projectId, status, priority, search, page, size
Response: Page<TaskDTO>

GET /api/client-portal/tasks/{id}
Response: TaskDetailDTO

POST /api/client-portal/tasks/{id}/comments
Request: { comment: string }
Response: CommentDTO
```

#### Bugs

```
GET /api/client-portal/bugs
Query params: projectId, status, priority, search, page, size
Response: Page<BugDTO>

GET /api/client-portal/bugs/{id}
Response: BugDetailDTO

POST /api/client-portal/bugs
Request: BugCreateDTO
Response: BugDTO

POST /api/client-portal/bugs/{id}/comments
Request: { comment: string }
Response: CommentDTO

POST /api/client-portal/bugs/{id}/attachments
Request: MultipartFile
Response: AttachmentDTO
```

#### Support Tickets

```
GET /api/client-portal/tickets
Query params: status, category, priority, search, page, size
Response: Page<SupportTicketDTO>

POST /api/client-portal/tickets
Request: SupportTicketCreateDTO
Response: SupportTicketDTO

GET /api/client-portal/tickets/{id}
Response: SupportTicketDetailDTO

POST /api/client-portal/tickets/{id}/comments
Request: { comment: string, isInternal: false }
Response: TicketCommentDTO

POST /api/client-portal/tickets/{id}/attachments
Request: MultipartFile
Response: AttachmentDTO

PATCH /api/client-portal/tickets/{id}/close
Response: SupportTicketDTO
```

#### Documents

```
GET /api/client-portal/documents
Query params: category, search, page, size
Response: Page<ClientDocumentDTO>

GET /api/client-portal/documents/{id}/download
Response: File stream
```

#### Profile

```
GET /api/client-portal/profile
Response: ClientProfileDTO

PUT /api/client-portal/profile
Request: ClientProfileUpdateDTO
Response: ClientProfileDTO

PUT /api/client-portal/profile/password
Request: { currentPassword: string, newPassword: string }
Response: { success: boolean }
```

#### Notifications

```
GET /api/client-portal/notifications
Query params: unreadOnly, page, size
Response: Page<NotificationDTO>

GET /api/client-portal/notifications/unread-count
Response: { count: number }

PATCH /api/client-portal/notifications/{id}/read
Response: NotificationDTO

PATCH /api/client-portal/notifications/read-all
Response: { success: boolean }
```

#### Client Invitations (Admin)

```
POST /api/client/representatives/{id}/invite
Response: ClientInvitationDTO

POST /api/client/invitations/resend/{id}
Response: ClientInvitationDTO

POST /api/client/invitations/accept
Request: { token: string, newPassword: string, acceptTerms: boolean }
Response: { success: boolean, token: string }
```

---

## 5. Domain Models

### 5.1 Support Ticket Domain

```java
@Entity
@Table(name = "support_tickets")
public class SupportTicket extends BaseEntity {
    private String ticketNumber;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String subject;
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<SupportTicketComment> comments;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<SupportTicketAttachment> attachments;
}

public enum TicketCategory {
    TECHNICAL, BILLING, GENERAL, FEATURE_REQUEST
}

public enum TicketPriority {
    LOW, MEDIUM, HIGH, URGENT
}

public enum TicketStatus {
    OPEN, IN_PROGRESS, RESOLVED, CLOSED
}
```

### 5.2 Client Invitation Domain

```java
@Entity
@Table(name = "client_invitations")
public class ClientInvitation extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "representative_id")
    private ClientRepresentative representative;

    private String email;
    private String invitationToken;
    private String temporaryPassword;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    private LocalDateTime sentAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime expiresAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}

public enum InvitationStatus {
    PENDING, ACCEPTED, EXPIRED, CANCELLED
}
```

### 5.3 Notification Domain

```java
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;
    private String message;

    private String relatedEntityType;
    private Long relatedEntityId;

    private Boolean isRead = false;
    private LocalDateTime readAt;
}

public enum NotificationType {
    PROJECT_MILESTONE,
    TASK_ASSIGNED,
    TASK_UPDATED,
    BUG_STATUS_CHANGED,
    TICKET_REPLIED,
    MESSAGE_RECEIVED,
    DOCUMENT_UPLOADED
}
```

---

## 6. Service Layer Design

### 6.1 ClientPortalService

**Responsibilities:**

- Filter projects by client
- Filter tasks by client's projects
- Filter bugs by client's projects
- Get dashboard statistics
- Get recent activities

**Key Methods:**

```java
public interface ClientPortalService {
    Page<ProjectDTO> getClientProjects(Long clientId, Pageable pageable);
    ProjectDetailDTO getProjectDetail(Long projectId, Long clientId);
    Page<TaskDTO> getClientTasks(Long clientId, TaskFilterDTO filter, Pageable pageable);
    TaskDetailDTO getTaskDetail(Long taskId, Long clientId);
    Page<BugDTO> getClientBugs(Long clientId, BugFilterDTO filter, Pageable pageable);
    BugDetailDTO getBugDetail(Long bugId, Long clientId);
    BugDTO reportBug(Long clientId, BugCreateDTO dto);
    DashboardStatsDTO getDashboardStats(Long clientId);
    List<ActivityDTO> getRecentActivities(Long clientId, int limit);
}
```

### 6.2 SupportTicketService

**Responsibilities:**

- Create support tickets
- Manage ticket lifecycle
- Add comments and attachments
- Assign tickets to employees
- Track ticket resolution

**Key Methods:**

```java
public interface SupportTicketService {
    SupportTicketDTO createTicket(Long clientId, SupportTicketCreateDTO dto);
    Page<SupportTicketDTO> getClientTickets(Long clientId, TicketFilterDTO filter, Pageable pageable);
    SupportTicketDetailDTO getTicketDetail(Long ticketId, Long clientId);
    TicketCommentDTO addComment(Long ticketId, Long userId, String comment, boolean isInternal);
    AttachmentDTO addAttachment(Long ticketId, Long userId, MultipartFile file);
    SupportTicketDTO closeTicket(Long ticketId, Long clientId);
    SupportTicketDTO assignTicket(Long ticketId, Long employeeId);
    SupportTicketDTO updateStatus(Long ticketId, TicketStatus status);
    String generateTicketNumber();
}
```

### 6.3 ClientInvitationService

**Responsibilities:**

- Create user accounts for cments: WHERE client_id = :clientId

**Security Checks:**
role 4. Token includes: userId, clientId, organizationId, roles 5. Frontend stores token in localStorage 6. All API requests include Authorization header

### 7.2 Authorization Rules

**Client Portal Access:**

- User must have CLIENT role
- User must be linked to a client
- User can only access data for their client

**Data Filtering:**

- Projects: WHERE client_id = :clientId
- Tasks: WHERE project.client_id = :clientId
- Bugs: WHERE project.client_id = :clientId
- Tickets: WHERE client_id = :clientId
- Docuw

1. Client logs in with email/password
2. Backend validates credentials
3. JWT token generated with CLIENT serId, boolean unreadOnly, Pageable pageable);
   int getUnreadCount(Long userId);
   NotificationDTO markAsRead(Long notificationId, Long userId);
   void markAllAsRead(Long userId);
   void notifyProjectMilestone(Long projectId);
   void notifyTaskUpdate(Long taskId);
   void notifyBugStatusChange(Long bugId);
   void notifyTicketReply(Long ticketId);
   }

```

---

## 7. Security Design

### 7.1 Authentication Flotive representative, String temporaryPassword);
}
```

### 6.4 NotificationService

**Responsibilities:**

- Create notifications for various events
- Mark notifications as read
- Get unread count
- Send email notifications (optional)

**Key Methods:**

````java
public interface NotificationService {
    NotificationDTO createNotification(Long userId, NotificationType type, String title, String message, String entityType, Long entityId);
    Page<NotificationDTO> getUserNotifications(Long ulient representatives
- Generate and send invitations
- Handle invitation acceptance
- Manage invitation lifecycle

**Key Methods:**
```java
public interface ClientInvitationService {
    ClientInvitationDTO sendInvitation(Long representativeId, Long createdBy);
    ClientInvitationDTO resendInvitation(Long invitationId);
    void acceptInvitation(String token, String newPassword, boolean acceptTerms);
    void expireOldInvitations();
    User createClientUser(ClientRepresenta

```java
public interface NotificationService {
    NotificationDTO createNotification(Long userId, NotificationType type, String title, String message, String entityType, Long entityId);
    Page<NotificationDTO> getUserNotifications(Long userId, boolean unreadOnly, Pageable pageable);
    int getUnreadCount(Long userId);
    NotificationDTO markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    void notifyProjectMilestone(Long projectId);
    void notifyTaskUpdate(Long taskId);
    void notifyBugStatusChange(Long bugId);
    void notifyTicketReply(Long ticketId);
}
````

---

## 7. Security Design

### 7.1 Authentication Flow

1. Client logs in with email/password
2. Backend validates credentials
3. JWT token generated with CLIENT role
4. Token includes: userId, clientId, organizationId, roles
5. Frontend stores token in localStorage
6. All API requests include Authorization header

### 7.2 Authorization Rules

**Client Portal Access:**

- User must have CLIENT role
- User must be linked to a client
- User can only access data for their client

**Data Filtering:**

- Projects: WHERE client_id = :clientId
- Tasks: WHERE project.client_id = :clientId
- Bugs: WHERE project.client_id = :clientId
- Tickets: WHERE client_id = :clientId
- Documents: WHERE client_id = :clientId

**Security Checks:**

```java
@PreAuthorize("hasRole('CLIENT')")
public ProjectDTO getProject(Long projectId) {
    Long clientId = securityContextUtil.getCurrentClientId();
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("Project not found"));

    if (!project.getClient().getId().equals(clientId)) {
        throw new ForbiddenException("Access denied");
    }

    return projectMapper.toDTO(project);
}
```

### 7.3 Password Policy

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot reuse last 3 passwords

---

## 8. Frontend Design

### 8.1 Component Structure

```
src/
├── pages/
│   └── client/
│       ├── dashboard/
│       │   ├── Dashboard.tsx
│       │   ├── StatsWidget.tsx
│       │   ├── ActivityFeed.tsx
│       │   └── MilestonesWidget.tsx
│       ├── projects/
│       │   ├── ProjectList.tsx
│       │   ├── ProjectDetail.tsx
│       │   └── ProjectCard.tsx
│       ├── tasks/
│       │   ├── TaskList.tsx
│       │   ├── TaskDetail.tsx
│       │   └── TaskCard.tsx
│       ├── bugs/
│       │   ├── BugList.tsx
│       │   ├── BugDetail.tsx
│       │   ├── BugReportForm.tsx
│       │   └── BugCard.tsx
│       ├── support/
│       │   ├── TicketList.tsx
│       │   ├── TicketDetail.tsx
│       │   ├── CreateTicket.tsx
│       │   └── TicketCard.tsx
│       ├── documents/
│       │   ├── DocumentList.tsx
│       │   └── DocumentViewer.tsx
│       └── profile/
│           ├── Profile.tsx
│           └── PasswordChange.tsx
├── services/
│   ├── clientPortal.service.ts
│   ├── supportTicket.service.ts
│   └── notification.service.ts
├── hooks/
│   ├── useClientPortal.ts
│   ├── useSupportTickets.ts
│   └── useNotifications.ts
└── types/
    ├── clientPortal.types.ts
    ├── supportTicket.types.ts
    └── notification.types.ts
```

### 8.2 State Management

Using React hooks and context:

- AuthContext: User authentication state
- NotificationContext: Real-time notifications
- Local state with useState for component-specific data
- React Query for server state management (optional)

### 8.3 Key UI Components

**Dashboard:**

- Stats cards with icons and counts
- Activity feed with timeline
- Upcoming milestones list
- Quick action buttons

**Project List:**

- Card grid layout
- Status badges (Active, Completed, On Hold)
- Progress bars
- Filter and search bar

**Task/Bug List:**

- Table layout with sortable columns
- Status and priority badges
- Assignee avatars
- Due date indicators

**Support Tickets:**

- List with ticket numbers
- Status workflow visualization
- Comment thread with timestamps
- File attachment support

---

## 9. Correctness Properties

### Property 1: Client Data Isolation

**Validates: Requirements 2.3, 2.4, 2.5**

**Property:** A client user can ONLY access data (projects, tasks, bugs, tickets, documents) that belongs to their client.

**Test Strategy:**

- Create multiple clients with different data
- Authenticate as client A
- Attempt to access client B's data via API
- Verify all requests return 403 Forbidden or empty results

**Implementation:**

- All repository queries must include client_id filter
- Service layer must validate client ownership
- Controller must extract clientId from security context

### Property 2: Ticket Number Uniqueness

**Validates: Requirements 2.6**

**Property:** Every support ticket must have a unique ticket number in the format TKT-YYYY-NNN.

**Test Strategy:**

- Generate 1000 ticket numbers concurrently
- Verify all numbers are unique
- Verify format matches TKT-YYYY-NNN pattern
- Verify sequential numbering within same year

**Implementation:**

- Use database sequence or atomic counter
- Format: TKT-{year}-{sequence}
- Handle year rollover correctly

### Property 3: Invitation Token Security

**Validates: Requirements 2.1**

**Property:** Invitation tokens must be cryptographically secure, unique, and expire after 7 days.

**Test Strategy:**

- Generate 10000 tokens
- Verify all tokens are unique
- Verify tokens are at least 32 characters
- Verify tokens expire exactly 7 days after creation
- Verify expired tokens cannot be used

**Implementation:**

- Use UUID.randomUUID() for token generation
- Set expiresAt = now + 7 days
- Check expiration before accepting invitation

### Property 4: Notification Delivery

**Validates: Requirements 2.9**

**Property:** When a ticket is replied to, the ticket creator must receive a notification.

**Test Strategy:**

- Create ticket as client user
- Add reply as employee user
- Verify notification is created for client user
- Verify notification contains correct ticket info
- Verify unread count increases

**Implementation:**

- Use event listeners or service callbacks
- Create notification in same transaction as reply
- Include ticket ID and title in notification

### Property 5: Bug Reporting Authorization

**Validates: Requirements 2.5**

**Property:** A client can only report bugs for projects assigned to their client.

**Test Strategy:**

- Create project A for client A
- Create project B for client B
- Authenticate as client A
- Attempt to report bug for project B
- Verify request is rejected with 403

**Implementation:**

- Validate project ownership before creating bug
- Extract clientId from security context
- Check project.client.id == clientId

### Property 6: Document Access Control

**Validates: Requirements 2.7**

**Property:** A client can only download documents that belong to their client.

**Test Strategy:**

- Upload document for client A
- Authenticate as client B
- Attempt to download client A's document
- Verify request is rejected with 403

**Implementation:**

- Check document.client.id == clientId before serving file
- Use secure file paths
- Log all document access attempts

### Property 7: Password Complexity

**Validates: Requirements 2.1, 2.10**

**Property:** All passwords must meet complexity requirements: min 8 chars, uppercase, lowercase, number, special char.

**Test Strategy:**

- Test passwords: "weak", "NoNumber!", "no-upper1", "NO-LOWER1", "Short1!"
- Verify all fail validation
- Test valid password: "Valid123!"
- Verify it passes

**Implementation:**

- Use regex pattern validation
- Validate on both frontend and backend
- Return clear error messages

### Property 8: Task Comment Visibility

**Validates: Requirements 2.4**

**Property:** Clients can view and add comments on tasks from their projects.

**Test Strategy:**

- Create task in client's project
- Add comment as client
- Verify comment is saved
- Verify comment appears in task detail
- Verify comment author is correct

**Implementation:**

- Allow CLIENT role to POST comments
- Filter comments by task ownership
- Include author information in response

---

## 10. Performance Considerations

### 10.1 Database Optimization

**Indexes:**

- support_tickets: (client_id, status), (assigned_to), (created_at)
- notifications: (user_id, is_read), (created_at)
- client_invitations: (invitation_token), (email), (status)

**Query Optimization:**

- Use pagination for all list endpoints
- Fetch only required columns
- Use JOIN FETCH for eager loading
- Implement caching for frequently accessed data

### 10.2 API Performance

**Response Times:**

- Dashboard stats: < 500ms
- List endpoints: < 1s
- Detail endpoints: < 500ms
- File downloads: Depends on file size

**Optimization Strategies:**

- Use database connection pooling
- Implement query result caching
- Use async processing for notifications
- Compress API responses

### 10.3 Frontend Performance

**Optimization:**

- Lazy load routes
- Implement virtual scrolling for long lists
- Cache API responses
- Debounce search inputs
- Optimize images and assets

---

## 11. Error Handling

### 11.1 Backend Error Responses

```json
{
  "timestamp": "2026-01-25T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "You do not have access to this resource",
  "path": "/api/client-portal/projects/123"
}
```

### 11.2 Frontend Error Handling

- Display user-friendly error messages
- Show toast notifications for errors
- Provide retry mechanisms
- Log errors for debugging
- Handle network failures gracefully

---

## 12. Testing Strategy

### 12.1 Unit Tests

- Service layer methods
- Repository queries
- Utility functions
- Validation logic

### 12.2 Integration Tests

- API endpoints
- Database operations
- File upload/download
- Authentication flow

### 12.3 Property-Based Tests

- Data isolation properties
- Security properties
- Business rule properties
- See section 9 for details

### 12.4 End-to-End Tests

- Complete user workflows
- Client onboarding
- Bug reporting
- Ticket creation and resolution

---

## 13. Deployment Considerations

### 13.1 Database Migration

- Create migration scripts for new tables
- Add indexes
- Update existing tables (client_representatives)
- Seed initial data (ticket categories, etc.)

### 13.2 Configuration

- Email service configuration
- File storage paths
- JWT secret keys
- Session timeout settings

### 13.3 Monitoring

- API response times
- Error rates
- User activity
- Database performance

---

**Document Version**: 1.0  
**Status**: Ready for Implementation  
**Last Updated**: January 25, 2026  
**Estimated Effort**: 8 weeks
