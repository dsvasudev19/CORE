# Project Structure

This document outlines the organized folder structure for the CORE HR/Employee Management System.

## Overview

The project is organized by feature modules to improve maintainability, scalability, and developer experience.

## Directory Structure

```
src/
├── pages/                      # Feature-based page organization
│   ├── auth/                   # Authentication pages
│   │   ├── Login.tsx
│   │   └── index.ts
│   ├── dashboard/              # Dashboard pages
│   │   ├── Dashboard.tsx       # Admin dashboard
│   │   ├── EmployeeHome.tsx    # Employee dashboard
│   │   ├── EmployeeDashboard.tsx
│   │   └── index.ts
│   ├── employees/              # Employee management
│   │   ├── EmployeeList.tsx
│   │   ├── EmployeeDetails.tsx
│   │   ├── AddOrEditEmployee.tsx
│   │   ├── EmployeeOnboarding.tsx
│   │   └── index.ts
│   ├── teams/                  # Team management
│   │   ├── TeamManagement.tsx
│   │   ├── MyTeam.tsx
│   │   └── index.ts
│   ├── tasks/                  # Task management
│   │   ├── EmployeeTasks.tsx
│   │   ├── TaskDetails.tsx
│   │   ├── TodoManagement.tsx
│   │   └── index.ts
│   ├── projects/               # Project management
│   │   ├── MyProjects.tsx
│   │   └── index.ts
│   ├── time-tracking/          # Time tracking features
│   │   ├── EmployeeTimeTracking.tsx
│   │   ├── TimeTrackingDashboard.tsx
│   │   └── index.ts
│   ├── attendance/             # Attendance management
│   │   ├── AttendanceDashboard.tsx
│   │   └── index.ts
│   ├── leave/                  # Leave management
│   │   ├── LeaveRequests.tsx
│   │   └── index.ts
│   ├── payroll/                # Payroll management
│   │   ├── PayrollManagement.tsx
│   │   └── index.ts
│   ├── performance/            # Performance reviews
│   │   ├── PerformanceReviews.tsx
│   │   └── index.ts
│   ├── recruitment/            # Recruitment & hiring
│   │   ├── Recruitment.tsx
│   │   └── index.ts
│   ├── training/               # Training & development
│   │   ├── TrainingDevelopment.tsx
│   │   └── index.ts
│   ├── documents/              # Document management
│   │   ├── Documents.tsx
│   │   ├── DocumentDetail.tsx
│   │   └── index.ts
│   ├── calendar/               # Calendar & events
│   │   ├── Calendar.tsx
│   │   └── index.ts
│   ├── messages/               # Messaging & chat
│   │   ├── Messages.tsx
│   │   └── index.ts
│   ├── announcements/          # Company announcements
│   │   ├── Announcements.tsx
│   │   └── index.ts
│   ├── notifications/          # Notification center
│   │   ├── NotificationsCenter.tsx
│   │   └── index.ts
│   ├── reports/                # Reports & analytics
│   │   ├── ReportsAnalytics.tsx
│   │   └── index.ts
│   ├── profile/                # User profile
│   │   ├── MyProfile.tsx
│   │   └── index.ts
│   └── settings/               # Application settings
│       ├── Settings.tsx
│       └── index.ts
│
├── components/                 # Reusable components organized by feature
│   ├── common/                 # Shared/common components
│   │   ├── MessageNotification.tsx
│   │   └── index.ts
│   ├── chat/                   # Chat-related components
│   │   ├── AIAgent.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatToggle.tsx
│   │   ├── ChatFeatureInfo.tsx
│   │   └── index.ts
│   ├── timer/                  # Timer components
│   │   ├── TimerWidget.tsx
│   │   └── index.ts
│   ├── dashboard/              # Dashboard-specific components
│   │   └── employee-home/      # Employee home widgets
│   │       ├── HeroSection.tsx
│   │       ├── QuickLinksGrid.tsx
│   │       ├── QuickLinkCard.tsx
│   │       ├── NewsFeed.tsx
│   │       ├── FeedItem.tsx
│   │       ├── FeedItemSkeleton.tsx
│   │       ├── FeedFilters.tsx
│   │       ├── MyTasksWidget.tsx
│   │       ├── UpcomingEventsWidget.tsx
│   │       ├── LeaveBalanceWidget.tsx
│   │       └── RecentDocumentsWidget.tsx
│   ├── employees/              # Employee-specific components (future)
│   ├── tasks/                  # Task-specific components (future)
│   ├── documents/              # Document-specific components (future)
│   ├── calendar/               # Calendar-specific components (future)
│   ├── messages/               # Message-specific components (future)
│   └── time-tracking/          # Time tracking components (future)
│
├── layouts/                    # Layout components
│   ├── DashboardLayout.tsx     # Admin layout
│   └── EmployeeLayout.tsx      # Employee layout
│
├── modals/                     # Modal components
│   ├── ClockInModal.tsx
│   ├── CreateEventModal.tsx
│   ├── LogTimeModal.tsx
│   ├── RequestLeaveModal.tsx
│   └── UploadDocumentModal.tsx
│
├── contexts/                   # React contexts
│   └── ChatContext.tsx
│
├── hooks/                      # Custom React hooks
│   └── useChat.ts
│
├── data/                       # Mock data & constants
│   └── mockFeedData.ts
│
├── assets/                     # Static assets
│   └── react.svg
│
├── App.tsx                     # Main app component
├── Router.tsx                  # Route definitions
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Import Conventions

### Using Index Files

Each feature folder has an `index.ts` file that exports all components from that folder. This allows for cleaner imports:

**Good:**

```typescript
import { Login } from "./pages/auth";
import { Dashboard, EmployeeHome } from "./pages/dashboard";
import { EmployeeList, EmployeeDetails } from "./pages/employees";
```

**Avoid:**

```typescript
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import EmployeeHome from "./pages/dashboard/EmployeeHome";
```

### Component Imports

Components follow the same pattern:

```typescript
import { AIAgent, ChatToggle } from "../components/chat";
import { TimerWidget } from "../components/timer";
import { MessageNotification } from "../components/common";
```

## Adding New Features

When adding a new feature module:

1. **Create the feature folder** in `src/pages/[feature-name]/`
2. **Add your page components** to the folder
3. **Create an index.ts** file that exports all components:
   ```typescript
   export { default as ComponentName } from "./ComponentName";
   ```
4. **Update Router.tsx** with the new imports and routes
5. **Create corresponding component folder** in `src/components/[feature-name]/` if needed

### Example: Adding Client Management

```bash
# Create folders
mkdir -p src/pages/clients
mkdir -p src/components/clients

# Create files
touch src/pages/clients/ClientList.tsx
touch src/pages/clients/ClientDetails.tsx
touch src/pages/clients/index.ts

# In src/pages/clients/index.ts
export { default as ClientList } from './ClientList';
export { default as ClientDetails } from './ClientDetails';

# In Router.tsx
import { ClientList, ClientDetails } from './pages/clients';
```

## Benefits of This Structure

1. **Scalability** - Easy to add new features without cluttering existing folders
2. **Maintainability** - Related files are grouped together
3. **Developer Experience** - Clear organization makes it easy to find files
4. **Code Splitting** - Feature-based structure enables better code splitting
5. **Team Collaboration** - Multiple developers can work on different features without conflicts
6. **Clean Imports** - Index files provide clean, organized imports

## Future Enhancements

As the application grows, consider:

- Adding `types/` folder for TypeScript interfaces
- Creating `services/` folder for API calls
- Adding `utils/` folder for helper functions
- Implementing `store/` for state management (Redux/Zustand)
- Creating `constants/` for application-wide constants
- Adding `styles/` for shared style utilities

## Migration Notes

All files have been reorganized from flat structure to feature-based structure. The Router.tsx has been updated with new import paths. All existing functionality remains intact.
