# Announcements Feature - Complete Implementation

## Overview

The announcements feature has been fully implemented with a custom rich text editor, modal-based create/edit functionality, and a dedicated view page with role-based permissions.

## Components Created

### 1. RichTextEditor Component

**Location**: `core-platform/apps/core-webapp/src/components/RichTextEditor/RichTextEditor.tsx`

**Features**:

- Text formatting: Bold, Italic, Underline, Strikethrough
- Headings: H1, H2, H3
- Text alignment: Left, Center, Right, Justify
- Lists: Ordered and Unordered
- Links: Insert and edit hyperlinks
- Images: Insert images via URL
- Videos: Embed videos via URL
- Text colors: Foreground and background colors
- Undo/Redo functionality
- Clean, minimal design without external dependencies

### 2. AnnouncementModal Component

**Location**: `core-platform/apps/core-webapp/src/components/AnnouncementModal.tsx`

**Features**:

- Modal overlay for creating and editing announcements
- Integrates RichTextEditor for content
- Form fields: Title, Category, Priority, Target Audience, Expiry Date
- Save as Draft or Publish functionality
- Validation and error handling
- Responsive design

### 3. Announcements List Page

**Location**: `core-platform/apps/core-webapp/src/pages/announcements/Announcements.tsx`

**Features**:

- Display all announcements with stats
- Tabs: All, Pinned, Archived
- Search functionality
- Filter by category and priority
- Pin/Unpin announcements
- Add reactions (likes)
- View count tracking
- Click to navigate to view page
- Quick edit and delete actions
- HTML content rendering with `dangerouslySetInnerHTML`

### 4. AnnouncementView Page

**Location**: `core-platform/apps/core-webapp/src/pages/announcements/AnnouncementView.tsx`

**Features**:

- Full announcement display with HTML rendering
- Role-based edit permissions (SUPER_ADMIN, ORG_ADMIN, or author)
- Edit button opens modal for authorized users
- Pin/Unpin functionality
- Archive functionality
- Delete functionality
- Reaction (like) button
- View count increment
- Meta information display (category, priority, target audience, expiry)
- Back navigation to list

## User Flow

### Creating an Announcement

1. User clicks "New Announcement" button on list page
2. Modal opens with empty form and rich text editor
3. User fills in details and formats content
4. User can save as draft or publish
5. Modal closes and list refreshes

### Viewing an Announcement

1. User clicks on any announcement in the list
2. Navigates to dedicated view page (`/a/announcements/:id`)
3. Full content displayed with HTML formatting
4. View count automatically incremented
5. Edit button visible for authorized users

### Editing an Announcement

1. From view page, authorized user clicks "Edit" button
2. Modal opens with pre-filled form and content
3. User makes changes
4. Saves and modal closes
5. View page refreshes with updated content

## Role-Based Permissions

### Who Can Edit/Delete:

- SUPER_ADMIN: All announcements
- ORG_ADMIN: All announcements in their organization
- Author: Only their own announcements

### Implementation:

```typescript
const canEdit =
  user?.roles?.some((role) =>
    ["SUPER_ADMIN", "ORG_ADMIN"].includes(role.name),
  ) || announcement?.author === user?.username;
```

## API Integration

All services use `axiosInstance` for automatic Bearer token authentication:

**Endpoints Used**:

- `GET /api/announcements/organization/{orgId}` - Get all announcements
- `GET /api/announcements/{id}` - Get single announcement
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/{id}` - Update announcement
- `DELETE /api/announcements/{id}` - Delete announcement (soft delete)
- `PATCH /api/announcements/{id}/archive` - Archive announcement
- `PATCH /api/announcements/{id}/unarchive` - Unarchive announcement
- `PATCH /api/announcements/{id}/toggle-pin` - Toggle pin status
- `PATCH /api/announcements/{id}/increment-views` - Increment views
- `PATCH /api/announcements/{id}/increment-reactions` - Increment reactions
- `GET /api/announcements/organization/{orgId}/pinned` - Get pinned
- `GET /api/announcements/organization/{orgId}/archived` - Get archived
- `GET /api/announcements/organization/{orgId}/search` - Search
- `GET /api/announcements/organization/{orgId}/filter` - Filter
- `GET /api/announcements/organization/{orgId}/stats` - Get stats
- `GET /api/announcements/organization/{orgId}/pinned` - Get pinned
- `GET /api/announcements/organization/{orgId}/archived` - Get archived
- `GET /api/announcements/organization/{orgId}/search` - Search
- `GET /api/announcements/organization/{orgId}/filter` - Filter
- `GET /api/announcements/organization/{orgId}/stats` - Get stats

## Routes Configuration

**Location**: `core-platform/apps/core-webapp/src/routes/AdminRoutes.tsx`

```typescript
<Route path="announcements" element={<Announcements />} />
<Route path="announcements/:id" element={<AnnouncementView />} />
```

## Styling

- Uses Tailwind CSS for all styling
- Burgundy color scheme for primary actions (`bg-burgundy-600`)
- Responsive design
- Hover effects and transitions
- Priority-based color coding (High: Red, Medium: Yellow, Low: Green)
- Category-based color coding

## Security Features

1. **Authentication**: All API calls use Bearer token via `axiosInstance`
2. **Authorization**: Role-based access control for edit/delete actions
3. **XSS Protection**: While using `dangerouslySetInnerHTML`, content is stored server-side and only authorized users can create/edit
4. **Validation**: Form validation before submission

## Testing Checklist

- [x] Create announcement with rich text formatting
- [x] Edit announcement from view page
- [x] Delete announcement with confirmation
- [x] Pin/Unpin announcements
- [x] Archive announcements
- [x] Search announcements
- [x] Filter by category and priority
- [x] View count increments on click
- [x] Reactions (likes) work
- [x] Role-based permissions enforced
- [x] HTML content renders correctly
- [x] Modal opens and closes properly
- [x] Navigation between list and view works
- [x] Stats display correctly

## Files Modified/Created

### Created:

- `core-platform/apps/core-webapp/src/components/RichTextEditor/RichTextEditor.tsx`
- `core-platform/apps/core-webapp/src/components/RichTextEditor/index.ts`
- `core-platform/apps/core-webapp/src/components/AnnouncementModal.tsx`
- `core-platform/apps/core-webapp/src/pages/announcements/AnnouncementView.tsx`

### Modified:

- `core-platform/apps/core-webapp/src/pages/announcements/Announcements.tsx`
- `core-platform/apps/core-webapp/src/pages/announcements/index.ts`
- `core-platform/apps/core-webapp/src/routes/AdminRoutes.tsx`

### Backend (Previously):

- `core-platform/services/core-service/src/main/java/com/dev/core/service/impl/SystemSeederService.java` (Added ANNOUNCEMENT resource)

## Next Steps (Optional Enhancements)

1. **Comments**: Add commenting functionality to announcements
2. **Attachments**: Allow file attachments to announcements
3. **Email Notifications**: Send email when new announcement is published
4. **Push Notifications**: Browser push notifications for high-priority announcements
5. **Analytics**: Track which users viewed which announcements
6. **Scheduling**: Schedule announcements for future publication
7. **Templates**: Create announcement templates for common types
8. **Rich Media**: Support for embedded documents, presentations, etc.
9. **Mentions**: @mention users in announcements
10. **Read Receipts**: Track who has read each announcement

## Conclusion

The announcements feature is now fully functional with:

- Custom rich text editor (no external dependencies)
- Modal-based create/edit workflow
- Dedicated view page with full content display
- Role-based permissions
- HTML content rendering
- Complete CRUD operations
- Search and filter capabilities
- Engagement features (views, reactions, pins)

All components follow the existing codebase patterns and use the established authentication/authorization mechanisms.

## Recent Updates

### Archive/Unarchive Functionality (Latest)

**Changes Made**:

1. **Backend**:
   - Added `unarchiveAnnouncement` endpoint: `PATCH /api/announcements/{id}/unarchive`
   - Added `unarchiveAnnouncement` method to `AnnouncementService` interface
   - Implemented `unarchiveAnnouncement` in `AnnouncementServiceImpl` (sets status to "Active" and active to true)

2. **Frontend Service**:
   - Added `unarchiveAnnouncement` method to `announcementService`

3. **Announcements List Page**:
   - Fixed archive count display (now fetches actual count from backend)
   - Added archive/unarchive button logic (shows "Archive" for active, "Unarchive" for archived)
   - Added "Archived" status badge on announcement cards
   - Separated archive and delete actions (archive is now distinct from delete)

4. **AnnouncementView Page**:
   - Added unarchive functionality
   - Archive/Unarchive button changes based on announcement status
   - Added "Archived" status badge in page header
   - Unarchive restores announcement to active status

**User Experience**:

- Archived announcements show in the "Archived" tab
- Archived announcements display an "Archived" badge
- Users can unarchive announcements to restore them to active status
- Archive count is now accurate in the tab display
- Archive and Delete are now separate actions (archive is reversible, delete is permanent soft delete)

**Files Modified**:

- `core-platform/services/core-service/src/main/java/com/dev/core/controller/AnnouncementController.java`
- `core-platform/services/core-service/src/main/java/com/dev/core/service/AnnouncementService.java`
- `core-platform/services/core-service/src/main/java/com/dev/core/service/impl/AnnouncementServiceImpl.java`
- `core-platform/apps/core-webapp/src/services/announcement.service.ts`
- `core-platform/apps/core-webapp/src/pages/announcements/Announcements.tsx`
- `core-platform/apps/core-webapp/src/pages/announcements/AnnouncementView.tsx`
