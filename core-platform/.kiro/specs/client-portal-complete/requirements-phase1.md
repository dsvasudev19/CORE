# Client Portal - Phase 1 Implementation Requirements

## (Excluding Invoicing System)

## 1. Overview

### 1.1 Purpose

Build a complete client portal that allows external clients to access their projects, tasks, bugs, documents, and support tickets in a secure, user-friendly interface.

### 1.2 Scope

This specification covers:

- ✅ Client user account creation and invitation workflow
- ✅ Client-specific project, task, and bug views
- ✅ Support ticketing system
- ✅ Enhanced document management
- ✅ Messaging integration
- ✅ Dashboard with widgets
- ✅ Notification system
- ❌ **Invoicing system (deferred to Phase 2)**

### 1.3 Users

- **Primary**: External clients (CLIENT role)
- **Secondary**: Internal admins and project managers (for client management)

---

## 2. Priority Features (Must Have)

### 2.1 Client Onboarding & User Management

**US-1: As an admin, I want to create client user accounts when adding representatives**

- When admin adds a client representative with email
- System automatically creates a User account
- User is assigned CLIENT role
- User is linked to the client representative
- User account is initially inactive until invitation is accepted

**Acceptance Criteria:**

- [ ] User account is created automatically when representative is added
- [ ] User has CLIENT role assigned
- [ ] User is linked to client and representative
- [ ] User account status is PENDING until activated
- [ ] Email validation prevents duplicate accounts

**US-2: As an admin, I want to send portal invitations to client representatives**

- Admin clicks "Send Invitation" button on representative
- System generates unique invitation token (UUID)
- System generates temporary password
- System sends email with:
  - Welcome message
  - Portal URL with invitation token
  - Temporary credentials
  - Expiration notice (7 days)
- Invitation record is created with status PENDING

**Acceptance Criteria:**

- [ ] Invitation email is sent successfully
- [ ] Email contains all required information
- [ ] Invitation token is unique and secure
- [ ] Invitation expires after 7 days
- [ ] Admin can resend invitation if needed
- [ ] System tracks invitation status

**US-3: As a client, I want to accept my invitation and set up my account**

- Client clicks invitation link in email
- System validates invitation token
- Client is prompted to:
  - Change temporary password
  - Accept terms and conditions
  - Complete profile (phone, timezone, preferences)
- System activates user account
- Client is redirected to dashboard

**Acceptance Criteria:**

- [ ] Invitation link validation works correctly
- [ ] Expired invitations show appropriate error
- [ ] Password change enforces complexity rules
- [ ] Terms acceptance is mandatory
- [ ] Profile completion is guided
- [ ] Account is activated after setup
- [ ] Client can immediately access portal

### 2.2 Client Dashboard

**US-4: As a client, I want to see a dashboard overview**

- Dashboard shows key metrics:
  - Total projects count
  - Active tasks count
  - Open bugs count
  - Open support tickets count
  - Unread messages count
- Dashboard shows recent activities (last 10)
- Dashboard shows upcoming project milestones
- Dashboard has quick action buttons

**Acceptance Criteria:**

- [ ] All statistics are accurate and real-time
- [ ] Recent activities show correct data
- [ ] Milestones are sorted by date
- [ ] Quick actions navigate correctly
- [ ] Dashboard loads within 2 seconds
- [ ] Dashboard is responsive on mobile

### 2.3 Client-Specific Project Views

**US-5: As a client, I want to view only my assigned projects**

- Client sees list of projects where client is assigned
- Each project card shows:
  - Project name and description
  - Status (Active, Completed, On Hold)
  - Progress percentage
  - Team size
  - Start and end dates
- Client can filter by status
- Client can search by project name
- Client can sort by date or name

**Acceptance Criteria:**

- [ ] Client sees only their projects
- [ ] Cannot access other clients' projects
- [ ] Filtering works correctly
- [ ] Search is case-insensitive
- [ ] Sorting works correctly
- [ ] Project cards show accurate data

**US-6: As a client, I want to view project details**

- Client clicks project to see full details
- Details include:
  - Full description
  - Timeline with milestones
  - Team members (name, role)
  - Project status and progress
  - Recent activities
  - Links to tasks and bugs
- Client can navigate to project tasks
- Client can navigate to project bugs

**Acceptance Criteria:**

- [ ] All project details are displayed
- [ ] Team members list is accurate
- [ ] Progress calculation is correct
- [ ] Navigation links work correctly
- [ ] Recent activities are relevant

### 2.4 Client-Specific Task Views

**US-7: As a client, I want to view tasks from my projects**

- Client sees all tasks from their assigned projects
- Task list shows:
  - Task title
  - Project name
  - Status (To Do, In Progress, Done)
  - Priority (Low, Medium, High)
  - Assignee name
  - Due date
- Client can filter by:
  - Project
  - Status
  - Priority
- Client can search by task title
- Client can sort by due date or priority

**Acceptance Criteria:**

- [ ] Client sees only tasks from their projects
- [ ] Cannot see tasks from other clients' projects
- [ ] All filters work correctly
- [ ] Search is functional
- [ ] Sorting works correctly
- [ ] Task data is accurate

**US-8: As a client, I want to view task details and add comments**

- Client clicks task to see details
- Details include:
  - Full description
  - Status and priority
  - Assignee and dates
  - Comments thread
  - Attachments (view only)
- Client can add comments
- Client receives notifications on task updates
- Comments show author and timestamp

**Acceptance Criteria:**

- [ ] Task details are complete
- [ ] Comment thread displays correctly
- [ ] Client can add comments successfully
- [ ] Comments are saved immediately
- [ ] Notifications are sent on updates
- [ ] Attachments are viewable

### 2.5 Client-Specific Bug Views

**US-9: As a client, I want to view bugs from my projects**

- Client sees all bugs from their assigned projects
- Bug list shows:
  - Bug title
  - Project name
  - Status (Open, In Progress, Resolved, Closed)
  - Priority (Low, Medium, High, Critical)
  - Reported date
  - Assignee name
- Client can filter by project, status, priority
- Client can search by bug title
- Client can sort by date or priority

**Acceptance Criteria:**

- [ ] Client sees only bugs from their projects
- [ ] Cannot see bugs from other clients' projects
- [ ] All filters work correctly
- [ ] Search is functional
- [ ] Sorting works correctly
- [ ] Bug data is accurate

**US-10: As a client, I want to report new bugs**

- Client clicks "Report Bug" button
- Form includes:
  - Title (required)
  - Description (required)
  - Project selection (required)
  - Priority selection (default: Medium)
  - Steps to reproduce
  - Expected vs actual behavior
  - File attachments (screenshots, logs)
- System creates bug with status "Open"
- System notifies project team
- Client receives confirmation

**Acceptance Criteria:**

- [ ] Form validation works correctly
- [ ] Required fields are enforced
- [ ] File upload works (max 10MB per file)
- [ ] Bug is created successfully
- [ ] Project team is notified
- [ ] Client receives confirmation
- [ ] Client can view newly created bug

**US-11: As a client, I want to view bug details and track progress**

- Client clicks bug to see details
- Details include:
  - Full description
  - Status and priority
  - Assignee and dates
  - Steps to reproduce
  - Comments and updates
  - Status history
  - Attachments
- Client can add comments
- Client receives notifications on bug updates
- Client can see when bug is resolved

**Acceptance Criteria:**

- [ ] Bug details are complete
- [ ] Status history shows all changes
- [ ] Comment thread displays correctly
- [ ] Client can add comments
- [ ] Notifications work correctly
- [ ] Attachments are viewable/downloadable

### 2.6 Support Ticketing System

**US-12: As a client, I want to create support tickets**

- Client clicks "Create Ticket" or "Get Support"
- Form includes:
  - Subject (required)
  - Description (required)
  - Category (Technical, Billing, General, Feature Request)
  - Priority (Low, Medium, High, Urgent)
  - Related project (optional)
  - File attachments
- System generates unique ticket number (e.g., TKT-2024-001)
- System creates ticket with status "Open"
- System notifies support team
- Client receives confirmation email

**Acceptance Criteria:**

- [ ] Form validation works correctly
- [ ] Ticket number is generated uniquely
- [ ] Ticket is created successfully
- [ ] Support team is notified
- [ ] Client receives confirmation
- [ ] File attachments work (max 10MB per file)

**US-13: As a client, I want to view my support tickets**

- Client sees list of all their tickets
- Ticket list shows:
  - Ticket number
  - Subject
  - Status (Open, In Progress, Resolved, Closed)
  - Priority
  - Category
  - Created date
  - Last updated date
- Client can filter by status, category, priority
- Client can search by subject or ticket number
- Client can sort by date or priority

**Acceptance Criteria:**

- [ ] Client sees only their tickets
- [ ] All filters work correctly
- [ ] Search is functional
- [ ] Sorting works correctly
- [ ] Ticket data is accurate
- [ ] Status badges are color-coded

**US-14: As a client, I want to view ticket details and communicate with support**

- Client clicks ticket to see details
- Details include:
  - Full description
  - Status and priority
  - Assigned team member (if assigned)
  - Conversation thread (chronological)
  - Attachments
- Client can add replies
- Client can upload additional attachments
- Client sees when support team responds
- Client receives email notifications on updates
- Client can close resolved tickets

**Acceptance Criteria:**

- [ ] Ticket details are complete
- [ ] Conversation thread displays correctly
- [ ] Client can add replies successfully
- [ ] File attachments work in replies
- [ ] Email notifications are sent
- [ ] Client can close tickets
- [ ] Closed tickets cannot be reopened by client

**US-15: As an admin/employee, I want to manage client support tickets**

- Employee sees all client tickets (filtered by permission)
- Employee can assign tickets to team members
- Employee can change ticket status
- Employee can change ticket priority
- Employee can add internal notes (not visible to client)
- Employee can add public replies (visible to client)
- Employee can close tickets
- Employee can reopen closed tickets

**Acceptance Criteria:**

- [ ] Employee can view all tickets
- [ ] Assignment works correctly
- [ ] Status changes are tracked
- [ ] Internal notes are hidden from client
- [ ] Public replies are visible to client
- [ ] Notifications are sent appropriately
- [ ] Ticket history is maintained

### 2.7 Enhanced Document Management

**US-16: As a client, I want to view all documents shared with me**

- Client sees list of all documents
- Documents are categorized:
  - Contracts
  - Reports
  - Deliverables
  - Meeting Notes
  - General
- Each document shows:
  - Name
  - Category
  - Upload date
  - File size
  - Uploaded by
- Client can filter by category
- Client can search by document name
- Client can sort by date or name

**Acceptance Criteria:**

- [ ] Client sees only their documents
- [ ] Categories are displayed correctly
- [ ] All filters work correctly
- [ ] Search is functional
- [ ] Sorting works correctly
- [ ] File metadata is accurate

**US-17: As a client, I want to download and preview documents**

- Client clicks document to preview (if supported format)
- Client can download document
- System logs document access
- Supported preview formats: PDF, images
- Download works for all file types

**Acceptance Criteria:**

- [ ] Preview works for supported formats
- [ ] Download works for all files
- [ ] Access is logged
- [ ] File permissions are checked
- [ ] Download is secure

**US-18: As an admin, I want to upload documents for clients**

- Admin selects client
- Admin uploads document file
- Admin sets:
  - Document name
  - Category
  - Description
  - Visibility (specific projects or all)
- System stores document securely
- Client receives notification

**Acceptance Criteria:**

- [ ] File upload works (max 50MB)
- [ ] Metadata is saved correctly
- [ ] Document is accessible to client
- [ ] Client is notified
- [ ] File is stored securely

### 2.8 Messaging Integration

**US-19: As a client, I want to send messages to project team**

- Client can start new conversation
- Client can select recipients from project team
- Client can send text messages
- Client can attach files
- Client receives real-time notifications
- Client can see message read status
- Client can view message history

**Acceptance Criteria:**

- [ ] Message sending works correctly
- [ ] File attachments work
- [ ] Real-time notifications work
- [ ] Read status is accurate
- [ ] Message history is preserved
- [ ] Client can only message their project teams

**US-20: As a client, I want to receive messages from project team**

- Client sees unread message count in header
- Client receives browser notifications
- Client can view message history
- Client can reply to messages
- Client can search message history
- Messages are organized by conversation

**Acceptance Criteria:**

- [ ] Unread count is accurate
- [ ] Browser notifications work
- [ ] Message history displays correctly
- [ ] Reply functionality works
- [ ] Search is functional
- [ ] Conversations are organized

### 2.9 Notifications

**US-21: As a client, I want to receive notifications for important events**

- Client receives notifications for:
  - Project milestone completed
  - Task assigned or updated
  - Bug status changed
  - Support ticket replied
  - New message received
  - New document uploaded
- Notifications appear in notification dropdown
- Client can view notification history
- Client can mark notifications as read
- Client can configure notification preferences

**Acceptance Criteria:**

- [ ] All event types trigger notifications
- [ ] Notifications appear in real-time
- [ ] Notification history is maintained
- [ ] Mark as read works correctly
- [ ] Preferences are saved
- [ ] Email notifications work (if enabled)

### 2.10 Profile & Settings

**US-22: As a client, I want to manage my profile**

- Client can view profile information
- Client can update:
  - Name
  - Phone number
  - Timezone
  - Language preference
  - Profile picture
- Client can change password
- Changes are saved immediately

**Acceptance Criteria:**

- [ ] Profile displays current information
- [ ] All fields can be updated
- [ ] Password change enforces rules
- [ ] Profile picture upload works
- [ ] Changes are saved successfully
- [ ] Validation works correctly

**US-23: As a client, I want to configure notification settings**

- Client can enable/disable email notifications
- Client can enable/disable browser notifications
- Client can choose notification frequency
- Client can select which events trigger notifications
- Settings are saved per user

**Acceptance Criteria:**

- [ ] All settings are configurable
- [ ] Settings are saved correctly
- [ ] Settings take effect immediately
- [ ] Default settings are sensible
- [ ] Settings persist across sessions

---

## 3. Database Schema Requirements

### 3.1 Support Ticket Tables

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

### 3.2 Client Invitation Table

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

### 3.3 Notification Table

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

---

## 4. API Endpoints to Implement

### 4.1 Client Portal Endpoints

```
# Client Projects
GET    /api/client-portal/projects              - Get client's projects
GET    /api/client-portal/projects/{id}         - Get project details
GET    /api/client-portal/projects/{id}/tasks   - Get project tasks
GET    /api/client-portal/projects/{id}/bugs    - Get project bugs

# Client Tasks
GET    /api/client-portal/tasks                 - Get all tasks for client's projects
GET    /api/client-portal/tasks/{id}            - Get task details
POST   /api/client-portal/tasks/{id}/comments   - Add task comment

# Client Bugs
GET    /api/client-portal/bugs                  - Get all bugs for client's projects
GET    /api/client-portal/bugs/{id}             - Get bug details
POST   /api/client-portal/bugs                  - Report new bug
POST   /api/client-portal/bugs/{id}/comments    - Add bug comment
POST   /api/client-portal/bugs/{id}/attachments - Upload bug attachment

# Support Tickets
GET    /api/client-portal/tickets               - Get client's tickets
POST   /api/client-portal/tickets               - Create new ticket
GET    /api/client-portal/tickets/{id}          - Get ticket details
POST   /api/client-portal/tickets/{id}/comments - Add ticket comment
POST   /api/client-portal/tickets/{id}/attachments - Upload attachment
PATCH  /api/client-portal/tickets/{id}/close    - Close ticket

# Dashboard
GET    /api/client-portal/dashboard/stats       - Get dashboard statistics
GET    /api/client-portal/dashboard/activities  - Get recent activities

# Documents
GET    /api/client-portal/documents             - Get client documents
GET    /api/client-portal/documents/{id}/download - Download document

# Profile
GET    /api/client-portal/profile               - Get client profile
PUT    /api/client-portal/profile               - Update client profile
PUT    /api/client-portal/profile/password      - Change password

# Notifications
GET    /api/client-portal/notifications         - Get notifications
PATCH  /api/client-portal/notifications/{id}/read - Mark as read
PATCH  /api/client-portal/notifications/read-all - Mark all as read
GET    /api/client-portal/notifications/unread-count - Get unread count

# Invitation
POST   /api/client/representatives/{id}/invite  - Send invitation
POST   /api/client/invitations/accept           - Accept invitation
POST   /api/client/invitations/resend/{id}      - Resend invitation
```

---

## 5. Technical Requirements

### 5.1 Backend

- Java Spring Boot 3.x
- MySQL 8.x database
- RESTful API design
- JWT authentication
- Role-based access control (RBAC)
- File storage service (existing)
- Email service integration
- Real-time notifications (WebSocket or polling)

### 5.2 Frontend

- React 18+ with TypeScript
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- File upload component
- Real-time updates

### 5.3 Performance

- API response time < 500ms
- Page load time < 2 seconds
- Support 100+ concurrent client users
- File upload size limit: 10MB per file (50MB for documents)
- Database queries optimized with indexes

### 5.4 Security

- HTTPS only
- Password complexity: min 8 chars, uppercase, lowercase, number, special char
- Session timeout after 30 minutes of inactivity
- CSRF protection
- XSS prevention
- SQL injection prevention
- File upload validation and virus scanning

---

## 6. Implementation Priority

### Phase 1A: Foundation (Week 1-2)

1. Client user account creation workflow
2. Client invitation system
3. Client authentication and first-time setup
4. Client profile management

### Phase 1B: Core Features (Week 3-4)

5. Client-specific project filtering
6. Client-specific task view
7. Client-specific bug view and reporting
8. Client dashboard with widgets

### Phase 1C: Support System (Week 5-6)

9. Support ticket entity and CRUD
10. Ticket creation and management UI
11. Ticket comments and attachments
12. Ticket assignment and notifications

### Phase 1D: Polish & Enhancement (Week 7-8)

13. Notification system
14. Document management improvements
15. Search functionality
16. Testing and bug fixes

---

## 7. Success Metrics

- 90% of clients actively using portal within 3 months
- Average client satisfaction score > 4.5/5
- Support ticket resolution time < 24 hours
- Client communication efficiency improved by 50%
- Bug reporting increased by 40% (better visibility)
- Project transparency score > 4.5/5

---

## 8. Out of Scope (Phase 2)

- Invoicing system (complete)
- Payment gateway integration
- Advanced analytics and reporting
- Mobile native apps
- Multi-language support
- Two-factor authentication
- API rate limiting
- Advanced search with Elasticsearch

---

**Document Version**: 2.0  
**Status**: Ready for Implementation  
**Last Updated**: January 25, 2026  
**Estimated Effort**: 8 weeks  
**Target Release**: Q2 2026
