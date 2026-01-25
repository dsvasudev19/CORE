# Error Handling System

This directory contains error pages and components for handling various error scenarios in the application.

## Components

### 1. NotFound (404 Page)

**File:** `NotFound.tsx`

Full-page 404 error displayed when a route doesn't exist.

**Features:**

- Large 404 illustration with search icon
- "Go Back" and "Go to Dashboard" buttons
- Helpful links to common pages (Projects, Tasks, Employees, Settings)
- Clean, user-friendly design

**Usage:**

```tsx
// In Router.tsx
<Route path="*" element={<NotFound />} />
```

### 2. ServerError (500 Page)

**File:** `ServerError.tsx`

Full-page 500 error displayed when a server error occurs.

**Features:**

- Large 500 illustration with alert icon
- "Refresh Page" and "Go to Dashboard" buttons
- Technical details section (expandable)
- Shows timestamp, error code, and current path

**Usage:**

```tsx
// Used by ErrorBoundary automatically
// Or manually:
import { ServerError } from "./pages/errors";
<Route path="/error" element={<ServerError />} />;
```

### 3. RestrictedAccess (403 Component)

**File:** `../../components/RestrictedAccess.tsx`

Flexible component for showing access denied messages. Can be used as full page or inline.

**Props:**

- `message?: string` - Custom access denied message
- `showBackButton?: boolean` - Show/hide back button (default: true)
- `fullPage?: boolean` - Full page or inline display (default: true)

**Usage:**

```tsx
// Full page
<RestrictedAccess
  message="You need ADMIN role to access this page."
  fullPage={true}
/>

// Inline (in a card/section)
<RestrictedAccess
  message="You don't have permission to edit this resource."
  fullPage={false}
  showBackButton={false}
/>
```

### 4. ServerErrorComponent

**File:** `../../components/ServerErrorComponent.tsx`

Reusable error component for displaying API errors inline or as full page.

**Props:**

- `error?: Error | string` - Error object or message
- `onRetry?: () => void` - Retry callback function
- `showHomeButton?: boolean` - Show/hide home button (default: true)
- `fullPage?: boolean` - Full page or inline display (default: false)

**Usage:**

```tsx
// Inline error in a page
{
  error && (
    <ServerErrorComponent
      error={error}
      onRetry={() => refetch()}
      showHomeButton={false}
    />
  );
}

// Full page error
<ServerErrorComponent
  error="Failed to load data"
  onRetry={() => window.location.reload()}
  fullPage={true}
/>;
```

### 5. ErrorBoundary

**File:** `../../components/ErrorBoundary.tsx`

React Error Boundary that catches JavaScript errors anywhere in the component tree.

**Features:**

- Catches runtime errors in child components
- Displays ServerError page by default
- Supports custom fallback UI
- Logs errors to console (can be extended to log to external service)

**Usage:**

```tsx
// Wrap entire app (in Router.tsx)
<ErrorBoundary>
  <BrowserRouter>
    <Routes>
      {/* routes */}
    </Routes>
  </BrowserRouter>
</ErrorBoundary>

// Wrap specific sections with custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <ComplexComponent />
</ErrorBoundary>
```

### 6. ProtectedRoute

**File:** `../../components/ProtectedRoute.tsx`

Component for protecting routes based on roles or permissions.

**Props:**

- `children: ReactNode` - Child components to render if authorized
- `requiredPermission?: string` - Required permission name
- `requiredRole?: string` - Required role name
- `fallback?: ReactNode` - Custom fallback UI (default: RestrictedAccess)

**Usage:**

```tsx
// Protect by role
<Route path="admin" element={
  <ProtectedRoute requiredRole="ADMIN">
    <AdminPage />
  </ProtectedRoute>
} />

// Protect by permission
<Route path="payroll" element={
  <ProtectedRoute requiredPermission="PAYROLL:READ">
    <PayrollPage />
  </ProtectedRoute>
} />

// Custom fallback
<Route path="sensitive" element={
  <ProtectedRoute
    requiredRole="SUPER_ADMIN"
    fallback={<CustomAccessDenied />}
  >
    <SensitivePage />
  </ProtectedRoute>
} />
```

## Integration Examples

### Example 1: API Error Handling in a Page

```tsx
import { ServerErrorComponent } from "../../components";

const MyPage = () => {
  const { data, error, isLoading, refetch } = useQuery("myData", fetchData);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <ServerErrorComponent
        error={error}
        onRetry={refetch}
        showHomeButton={false}
      />
    );
  }

  return <div>{/* render data */}</div>;
};
```

### Example 2: Permission-Based UI Elements

```tsx
import { RestrictedAccess } from "../../components";
import { useAuth } from "../../contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();
  const canEditSettings = user?.permissions?.some(
    (p) => p.name === "SETTINGS:UPDATE",
  );

  return (
    <div>
      <h1>Settings</h1>

      {canEditSettings ? (
        <SettingsForm />
      ) : (
        <RestrictedAccess
          message="You don't have permission to edit settings."
          fullPage={false}
          showBackButton={false}
        />
      )}
    </div>
  );
};
```

### Example 3: Protected Admin Routes

```tsx
import { ProtectedRoute } from "../../components";

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="access-control"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AccessControl />
          </ProtectedRoute>
        }
      />

      <Route
        path="payroll"
        element={
          <ProtectedRoute requiredPermission="PAYROLL:READ">
            <PayrollManagement />
          </ProtectedRoute>
        }
      />
    </>
  );
};
```

## Best Practices

1. **Use ErrorBoundary at the app level** - Wrap your entire app to catch all runtime errors
2. **Use ServerErrorComponent for API errors** - Show inline errors with retry functionality
3. **Use RestrictedAccess for permission checks** - Both full page and inline scenarios
4. **Use ProtectedRoute for route-level protection** - Protect entire pages based on roles/permissions
5. **Always provide retry functionality** - Give users a way to recover from errors
6. **Log errors to external service** - Extend ErrorBoundary to send errors to monitoring service
7. **Show user-friendly messages** - Avoid technical jargon in error messages
8. **Provide navigation options** - Always give users a way to navigate away from error pages

## Error Hierarchy

```
ErrorBoundary (catches all runtime errors)
  └─> Router
      ├─> Protected Routes (role/permission checks)
      │   └─> Pages
      │       └─> ServerErrorComponent (API errors)
      └─> NotFound (404 for unmatched routes)
```

## Styling

All error components use:

- Tailwind CSS for styling
- Lucide React for icons
- Gradient backgrounds for visual appeal
- Responsive design (mobile-friendly)
- Consistent color scheme (red for errors, blue for info)
