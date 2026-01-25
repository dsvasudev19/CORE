# Client Portal - Phase 1 Implementation Tasks

## Phase 1A: Foundation (Weeks 1-2)

### 1. Database Setup

- [ ] 1.1 Create database migration script for support_tickets table
- [ ] 1.2 Create database migration script for support_ticket_comments table
- [ ] 1.3 Create database migration script for support_ticket_attachments table
- [ ] 1.4 Create database migration script for client_invitations table
- [ ] 1.5 Create database migration script for notifications table
- [ ] 1.6 Add user_id column to client_representatives table
- [ ] 1.7 Run migrations and verify schema

### 2. Domain Models & Enums

- [ ] 2.1 Create SupportTicket entity with relationships
- [ ] 2.2 Create SupportTicketComment entity
- [ ] 2.3 Create SupportTicketAttachment entity
- [ ] 2.4 Create ClientInvitation entity
- [ ] 2.5 Create Notification entity
- [ ] 2.6 Create TicketCategory enum (TECHNICAL, BILLING, GENERAL, FEATURE_REQUEST)
- [ ] 2.7 Create TicketPriority enum (LOW, MEDIUM, HIGH, URGENT)
- [ ] 2.8 Create TicketStatus enum (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- [ ] 2.9 Create InvitationStatus enum (PENDING, ACCEPTED, EXPIRED, CANCELLED)
- [ ] 2.10 Create NotificationType enum

### 3. DTOs

- [ ] 3.1 Create SupportTicketDTO
- [ ] 3.2 Create SupportTicketDetailDTO
- [ ] 3.3 Create SupportTicketCreateDTO
- [ ] 3.4 Create TicketCommentDTO
- [ ] 3.5 Create ClientInvitationDTO
- [ ] 3.6 Create NotificationDTO
- [ ] 3.7 Create DashboardStatsDTO
- [ ] 3.8 Create ActivityDTO
- [ ] 3.9 Create ClientProfileDTO
- [ ] 3.10 Create ClientProfileUpdateDTO

### 4. Repositories

- [ ] 4.1 Create SupportTicketRepository with custom queries
  - [ ] 4.1.1 findByClientIdAndStatus
  - [ ] 4.1.2 findByClientId with pagination
  - [ ] 4.1.3 findByAssignedTo
- [ ] 4.2 Create SupportTicketCommentRepository
- [ ] 4.3 Create SupportTicketAttachmentRepository
- [ ] 4.4 Create ClientInvitationRepository
  - [ ] 4.4.1 findByInvitationToken
  - [ ] 4.4.2 findByEmailAndStatus
  - [ ] 4.4.3 findExpiredInvitations
- [ ] 4.5 Create NotificationRepository
  - [ ] 4.5.1 findByUserIdAndIsRead
  - [ ] 4.5.2 countByUserIdAndIsReadFalse

### 5. Client Invitation Service & Workflow

- [ ] 5.1 Implement ClientInvitationService interface
- [ ] 5.2 Implement sendInvitation method
  - [ ] 5.2.1 Generate unique invitation token (UUID)
  - [ ] 5.2.2 Generate temporary password
  - [ ] 5.2.3 Create user account with CLIENT role
  - [ ] 5.2.4 Link user to client representative
  - [ ] 5.2.5 Create invitation record
  - [ ] 5.2.6 Send invitation email
- [ ] 5.3 Implement acceptInvitation method
  - [ ] 5.3.1 Validate invitation token
  - [ ] 5.3.2 Check expiration (7 days)
  - [ ] 5.3.3 Validate new password
  - [ ] 5.3.4 Update user password
  - [ ] 5.3.5 Activate user account
  - [ ] 5.3.6 Update invitation status to ACCEPTED
- [ ] 5.4 Implement resendInvitation method
- [ ] 5.5 Implement expireOldInvitations scheduled task
- [ ] 5.6 Write unit tests for ClientInvitationService
- [ ] 5.7 Write property test: Invitation tokens are unique
- [ ] 5.8 Write property test: Expired invitations cannot be accepted

### 6. Client Invitation API Endpoints

- [ ] 6.1 Add POST /api/client/representatives/{id}/invite endpoint
- [ ] 6.2 Add POST /api/client/invitations/resend/{id} endpoint
- [ ] 6.3 Add POST /api/client/invitations/accept endpoint (public)
- [ ] 6.4 Add authorization checks for admin-only endpoints
- [ ] 6.5 Write integration tests for invitation endpoints

### 7. Client Profile Management

- [ ] 7.1 Implement ClientPortalService.getProfile method
- [ ] 7.2 Implement ClientPortalService.updateProfile method
- [ ] 7.3 Implement ClientPortalService.changePassword method
- [ ] 7.4 Add GET /api/client-portal/profile endpoint
- [ ] 7.5 Add PUT /api/client-portal/profile endpoint
- [ ] 7.6 Add PUT /api/client-portal/profile/password endpoint
- [ ] 7.7 Write unit tests for profile management
- [ ] 7.8 Write property test: Password complexity validation

---

## Phase 1B: Core Features (Weeks 3-4)

### 8. Client Portal Service - Projects

- [ ] 8.1 Implement getClientProjects method with filtering
- [ ] 8.2 Implement getProjectDetail method with security check
- [ ] 8.3 Add GET /api/client-portal/projects endpoint
- [ ] 8.4 Add GET /api/client-portal/projects/{id} endpoint
- [ ] 8.5 Write unit tests for project methods
- [ ] 8.6 Write property test: Client can only access their projects

### 9. Client Portal Service - Tasks

- [ ] 9.1 Implement getClientTasks method with filtering
- [ ] 9.2 Implement getTaskDetail method with security check
- [ ] 9.3 Implement addTaskComment method
- [ ] 9.4 Add GET /api/client-portal/tasks endpoint
- [ ] 9.5 Add GET /api/client-portal/tasks/{id} endpoint
- [ ] 9.6 Add POST /api/client-portal/tasks/{id}/comments endpoint
- [ ] 9.7 Write unit tests for task methods
- [ ] 9.8 Write property test: Client can only access tasks from their projects
- [ ] 9.9 Write property test: Task comments are visible to clients

### 10. Client Portal Service - Bugs

- [ ] 10.1 Implement getClientBugs method with filtering
- [ ] 10.2 Implement getBugDetail method with security check
- [ ] 10.3 Implement reportBug method with project validation
- [ ] 10.4 Implement addBugComment method
- [ ] 10.5 Implement addBugAttachment method
- [ ] 10.6 Add GET /api/client-portal/bugs endpoint
- [ ] 10.7 Add GET /api/client-portal/bugs/{id} endpoint
- [ ] 10.8 Add POST /api/client-portal/bugs endpoint
- [ ] 10.9 Add POST /api/client-portal/bugs/{id}/comments endpoint
- [ ] 10.10 Add POST /api/client-portal/bugs/{id}/attachments endpoint
- [ ] 10.11 Write unit tests for bug methods
- [ ] 10.12 Write property test: Client can only report bugs for their projects
- [ ] 10.13 Write property test: Client can only access bugs from their projects

### 11. Dashboard Service

- [ ] 11.1 Implement getDashboardStats method
  - [ ] 11.1.1 Count total projects
  - [ ] 11.1.2 Count active projects
  - [ ] 11.1.3 Count total tasks
  - [ ] 11.1.4 Count active tasks
  - [ ] 11.1.5 Count total bugs
  - [ ] 11.1.6 Count open bugs
  - [ ] 11.1.7 Count open tickets
  - [ ] 11.1.8 Count unread messages
- [ ] 11.2 Implement getRecentActivities method
- [ ] 11.3 Add GET /api/client-portal/dashboard/stats endpoint
- [ ] 11.4 Add GET /api/client-portal/dashboard/activities endpoint
- [ ] 11.5 Write unit tests for dashboard methods

### 12. Frontend - Client Portal Services

- [ ] 12.1 Create clientPortal.service.ts
  - [ ] 12.1.1 getProjects method
  - [ ] 12.1.2 getProjectDetail method
  - [ ] 12.1.3 getTasks method
  - [ ] 12.1.4 getTaskDetail method
  - [ ] 12.1.5 addTaskComment method
  - [ ] 12.1.6 getBugs method
  - [ ] 12.1.7 getBugDetail method
  - [ ] 12.1.8 reportBug method
  - [ ] 12.1.9 addBugComment method
  - [ ] 12.1.10 getDashboardStats method
  - [ ] 12.1.11 getRecentActivities method
- [ ] 12.2 Create clientProfile.service.ts
  - [ ] 12.2.1 getProfile method
  - [ ] 12.2.2 updateProfile method
  - [ ] 12.2.3 changePassword method

### 13. Frontend - Dashboard

- [ ] 13.1 Create Dashboard.tsx page
- [ ] 13.2 Create StatsWidget.tsx component
- [ ] 13.3 Create ActivityFeed.tsx component
- [ ] 13.4 Create MilestonesWidget.tsx component (placeholder)
- [ ] 13.5 Implement dashboard data fetching
- [ ] 13.6 Add loading and error states
- [ ] 13.7 Style dashboard with theme colors

### 14. Frontend - Projects

- [ ] 14.1 Create ProjectList.tsx page
- [ ] 14.2 Create ProjectDetail.tsx page
- [ ] 14.3 Create ProjectCard.tsx component
- [ ] 14.4 Implement project filtering (status, search)
- [ ] 14.5 Implement project sorting
- [ ] 14.6 Add pagination
- [ ] 14.7 Add loading and error states
- [ ] 14.8 Style with theme colors

### 15. Frontend - Tasks

- [ ] 15.1 Create TaskList.tsx page
- [ ] 15.2 Create TaskDetail.tsx page
- [ ] 15.3 Create TaskCard.tsx component
- [ ] 15.4 Implement task filtering (project, status, priority)
- [ ] 15.5 Implement task search
- [ ] 15.6 Implement task sorting
- [ ] 15.7 Add comment thread component
- [ ] 15.8 Add comment form
- [ ] 15.9 Add pagination
- [ ] 15.10 Style with theme colors

### 16. Frontend - Bugs

- [ ] 16.1 Update BugList.tsx for client portal
- [ ] 16.2 Create BugDetail.tsx page
- [ ] 16.3 Create BugReportForm.tsx component
- [ ] 16.4 Implement bug filtering (project, status, priority)
- [ ] 16.5 Implement bug search
- [ ] 16.6 Implement bug sorting
- [ ] 16.7 Add comment thread component
- [ ] 16.8 Add file attachment upload
- [ ] 16.9 Add pagination
- [ ] 16.10 Style with theme colors

---

## Phase 1C: Support System (Weeks 5-6)

### 17. Support Ticket Service

- [ ] 17.1 Implement SupportTicketService interface
- [ ] 17.2 Implement createTicket method
  - [ ] 17.2.1 Generate unique ticket number
  - [ ] 17.2.2 Validate project ownership
  - [ ] 17.2.3 Create ticket with OPEN status
  - [ ] 17.2.4 Send notification to support team
- [ ] 17.3 Implement getClientTickets method with filtering
- [ ] 17.4 Implement getTicketDetail method with security check
- [ ] 17.5 Implement addComment method
- [ ] 17.6 Implement addAttachment method
- [ ] 17.7 Implement closeTicket method
- [ ] 17.8 Implement assignTicket method (admin only)
- [ ] 17.9 Implement updateStatus method (admin only)
- [ ] 17.10 Implement generateTicketNumber method
- [ ] 17.11 Write unit tests for SupportTicketService
- [ ] 17.12 Write property test: Ticket numbers are unique
- [ ] 17.13 Write property test: Client can only access their tickets

### 18. Support Ticket API Endpoints

- [ ] 18.1 Create SupportTicketController
- [ ] 18.2 Add GET /api/client-portal/tickets endpoint
- [ ] 18.3 Add POST /api/client-portal/tickets endpoint
- [ ] 18.4 Add GET /api/client-portal/tickets/{id} endpoint
- [ ] 18.5 Add POST /api/client-portal/tickets/{id}/comments endpoint
- [ ] 18.6 Add POST /api/client-portal/tickets/{id}/attachments endpoint
- [ ] 18.7 Add PATCH /api/client-portal/tickets/{id}/close endpoint
- [ ] 18.8 Add authorization checks
- [ ] 18.9 Write integration tests for ticket endpoints

### 19. Admin Support Ticket Management

- [ ] 19.1 Add GET /api/support-tickets endpoint (admin)
- [ ] 19.2 Add PATCH /api/support-tickets/{id}/assign endpoint
- [ ] 19.3 Add PATCH /api/support-tickets/{id}/status endpoint
- [ ] 19.4 Add POST /api/support-tickets/{id}/internal-notes endpoint
- [ ] 19.5 Write integration tests for admin endpoints

### 20. Frontend - Support Ticket Service

- [ ] 20.1 Create supportTicket.service.ts
  - [ ] 20.1.1 getTickets method
  - [ ] 20.1.2 createTicket method
  - [ ] 20.1.3 getTicketDetail method
  - [ ] 20.1.4 addComment method
  - [ ] 20.1.5 addAttachment method
  - [ ] 20.1.6 closeTicket method

### 21. Frontend - Support Ticket UI

- [ ] 21.1 Create TicketList.tsx page
- [ ] 21.2 Create CreateTicket.tsx page
- [ ] 21.3 Create TicketDetail.tsx page
- [ ] 21.4 Create TicketCard.tsx component
- [ ] 21.5 Implement ticket filtering (status, category, priority)
- [ ] 21.6 Implement ticket search
- [ ] 21.7 Implement ticket sorting
- [ ] 21.8 Add comment thread component
- [ ] 21.9 Add file attachment upload
- [ ] 21.10 Add status badges with colors
- [ ] 21.11 Add pagination
- [ ] 21.12 Style with theme colors

---

## Phase 1D: Polish & Enhancement (Weeks 7-8)

### 22. Notification Service

- [ ] 22.1 Implement NotificationService interface
- [ ] 22.2 Implement createNotification method
- [ ] 22.3 Implement getUserNotifications method
- [ ] 22.4 Implement getUnreadCount method
- [ ] 22.5 Implement markAsRead method
- [ ] 22.6 Implement markAllAsRead method
- [ ] 22.7 Implement event-specific notification methods
  - [ ] 22.7.1 notifyProjectMilestone
  - [ ] 22.7.2 notifyTaskUpdate
  - [ ] 22.7.3 notifyBugStatusChange
  - [ ] 22.7.4 notifyTicketReply
- [ ] 22.8 Write unit tests for NotificationService
- [ ] 22.9 Write property test: Notifications are delivered correctly

### 23. Notification API Endpoints

- [ ] 23.1 Create NotificationController
- [ ] 23.2 Add GET /api/client-portal/notifications endpoint
- [ ] 23.3 Add GET /api/client-portal/notifications/unread-count endpoint
- [ ] 23.4 Add PATCH /api/client-portal/notifications/{id}/read endpoint
- [ ] 23.5 Add PATCH /api/client-portal/notifications/read-all endpoint
- [ ] 23.6 Write integration tests for notification endpoints

### 24. Frontend - Notification Service

- [ ] 24.1 Create notification.service.ts
  - [ ] 24.1.1 getNotifications method
  - [ ] 24.1.2 getUnreadCount method
  - [ ] 24.1.3 markAsRead method
  - [ ] 24.1.4 markAllAsRead method
- [ ] 24.2 Create useNotifications hook
- [ ] 24.3 Implement polling for new notifications (every 30s)

### 25. Frontend - Notification UI

- [ ] 25.1 Update ClientLayout notification dropdown
- [ ] 25.2 Display real notification data
- [ ] 25.3 Add mark as read functionality
- [ ] 25.4 Add mark all as read button
- [ ] 25.5 Add notification click navigation
- [ ] 25.6 Update unread count badge
- [ ] 25.7 Style with theme colors

### 26. Document Management Enhancements

- [ ] 26.1 Add category filtering to documents endpoint
- [ ] 26.2 Add search functionality to documents endpoint
- [ ] 26.3 Update ClientDocuments.tsx with filtering
- [ ] 26.4 Add document preview modal (PDF, images)
- [ ] 26.5 Add download tracking
- [ ] 26.6 Style with theme colors

### 27. Frontend - Profile & Settings

- [ ] 27.1 Create Profile.tsx page
- [ ] 27.2 Create PasswordChange.tsx component
- [ ] 27.3 Implement profile form with validation
- [ ] 27.4 Implement password change form
- [ ] 27.5 Add profile picture upload
- [ ] 27.6 Add notification preferences (placeholder)
- [ ] 27.7 Style with theme colors

### 28. Frontend - Invitation Acceptance

- [ ] 28.1 Create AcceptInvitation.tsx page (public route)
- [ ] 28.2 Implement token validation
- [ ] 28.3 Implement password change form
- [ ] 28.4 Implement terms acceptance checkbox
- [ ] 28.5 Implement profile completion form
- [ ] 28.6 Add success/error handling
- [ ] 28.7 Redirect to dashboard after completion

### 29. Admin - Client Invitation UI

- [ ] 29.1 Add "Send Invitation" button to representative list
- [ ] 29.2 Add invitation status indicator
- [ ] 29.3 Add "Resend Invitation" button
- [ ] 29.4 Add invitation history view
- [ ] 29.5 Show invitation expiration date

### 30. Search Functionality

- [ ] 30.1 Implement global search in ClientLayout
- [ ] 30.2 Search across projects, tasks, bugs, tickets, documents
- [ ] 30.3 Display search results with categories
- [ ] 30.4 Add keyboard shortcuts (Cmd+K)
- [ ] 30.5 Style search results

### 31. Testing & Bug Fixes

- [ ] 31.1 Run all unit tests and fix failures
- [ ] 31.2 Run all integration tests and fix failures
- [ ] 31.3 Run all property-based tests and fix failures
- [ ] 31.4 Perform manual testing of all workflows
- [ ] 31.5 Fix UI bugs and inconsistencies
- [ ] 31.6 Test on different screen sizes
- [ ] 31.7 Test with different browsers
- [ ] 31.8 Performance testing and optimization

### 32. Documentation

- [ ] 32.1 Update API documentation
- [ ] 32.2 Create user guide for clients
- [ ] 32.3 Create admin guide for client management
- [ ] 32.4 Document deployment steps
- [ ] 32.5 Create troubleshooting guide

---

## Summary

**Total Tasks**: 32 major tasks with 200+ subtasks  
**Estimated Effort**: 8 weeks  
**Team Size**: 2-3 developers  
**Priority**: High  
**Dependencies**: Email service, file storage service

**Phase Breakdown:**

- Phase 1A (Weeks 1-2): 7 major tasks - Foundation
- Phase 1B (Weeks 3-4): 9 major tasks - Core Features
- Phase 1C (Weeks 5-6): 5 major tasks - Support System
- Phase 1D (Weeks 7-8): 11 major tasks - Polish & Enhancement
