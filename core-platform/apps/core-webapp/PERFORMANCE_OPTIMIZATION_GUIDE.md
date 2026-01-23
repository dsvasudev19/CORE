# Performance Optimization Guide

## Overview

This application now uses **TanStack Query (React Query)** for server state management and **Valtio** for client/UI state management. This combination provides optimal performance, better developer experience, and cleaner code architecture.

---

## 🚀 TanStack Query (React Query)

### What is it?
TanStack Query is a powerful data-fetching and state management library for handling server state. It provides:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Pagination & infinite scroll support
- Automatic garbage collection

### When to Use
Use TanStack Query for **ALL server data**:
- ✅ Fetching employees, projects, tasks
- ✅ API calls to backend services
- ✅ Data that comes from the server
- ✅ Data that needs to be cached and synchronized

### Configuration

Located in `src/lib/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
  },
});
```

### Query Keys

Centralized query keys in `src/lib/queryClient.ts`:

```typescript
export const queryKeys = {
  employees: {
    all: ['employees'],
    list: (filters) => ['employees', 'list', filters],
    detail: (id) => ['employees', 'detail', id],
  },
  projects: {
    all: ['projects'],
    list: (filters) => ['projects', 'list', filters],
    detail: (id) => ['projects', 'detail', id],
  },
  // ... more keys
};
```

### Usage Examples

#### 1. Fetching Data (Query)

```typescript
import { useEmployees } from '../hooks/useEmployees';

function EmployeeList() {
  const { data: employees, isLoading, error } = useEmployees();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {employees?.map(emp => (
        <div key={emp.id}>{emp.firstName}</div>
      ))}
    </div>
  );
}
```

#### 2. Creating Data (Mutation)

```typescript
import { useCreateEmployee } from '../hooks/useEmployees';

function AddEmployeeForm() {
  const createEmployee = useCreateEmployee();
  
  const handleSubmit = async (data) => {
    try {
      await createEmployee.mutateAsync(data);
      toast.success('Employee created!');
    } catch (error) {
      toast.error('Failed to create employee');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createEmployee.isPending}>
        {createEmployee.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### 3. Updating Data with Optimistic Updates

```typescript
import { useUpdateEmployee } from '../hooks/useEmployees';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';

function UpdateEmployee({ id }) {
  const queryClient = useQueryClient();
  const updateEmployee = useUpdateEmployee();
  
  const handleUpdate = async (data) => {
    await updateEmployee.mutateAsync(
      { id, data },
      {
        // Optimistic update
        onMutate: async (newData) => {
          // Cancel outgoing refetches
          await queryClient.cancelQueries({ 
            queryKey: queryKeys.employees.detail(id) 
          });
          
          // Snapshot previous value
          const previous = queryClient.getQueryData(
            queryKeys.employees.detail(id)
          );
          
          // Optimistically update
          queryClient.setQueryData(
            queryKeys.employees.detail(id),
            (old) => ({ ...old, ...newData.data })
          );
          
          return { previous };
        },
        // Rollback on error
        onError: (err, newData, context) => {
          queryClient.setQueryData(
            queryKeys.employees.detail(id),
            context.previous
          );
        },
      }
    );
  };
  
  return <button onClick={handleUpdate}>Update</button>;
}
```

#### 4. Dependent Queries

```typescript
function ProjectDetails({ projectId }) {
  // First query
  const { data: project } = useProject(projectId);
  
  // Second query depends on first
  const { data: tasks } = useProjectTasks(projectId, {
    enabled: !!project, // Only run if project exists
  });
  
  return <div>{/* render */}</div>;
}
```

#### 5. Pagination

```typescript
function EmployeeListPaginated() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.employees.list({ page }),
    queryFn: () => employeeService.getEmployees({ page }),
    keepPreviousData: true, // Keep old data while fetching new
  });
  
  return (
    <div>
      {data?.employees.map(emp => <div key={emp.id}>{emp.name}</div>)}
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(p => p + 1)}>
        Next
      </button>
    </div>
  );
}
```

---

## 🎯 Valtio

### What is it?
Valtio is a proxy-based state management library for client/UI state. It's simple, fast, and requires minimal boilerplate.

### When to Use
Use Valtio for **client-side/UI state**:
- ✅ Sidebar open/closed
- ✅ Theme preferences
- ✅ Active modals/drawers
- ✅ Form state (temporary)
- ✅ UI filters (before applying)
- ✅ Loading overlays
- ❌ NOT for server data (use TanStack Query)

### Stores

#### App Store (`src/stores/appStore.ts`)
Global application state:
- User authentication
- Theme
- Sidebar state
- Active filters
- Notifications count

#### UI Store (`src/stores/uiStore.ts`)
UI-specific state:
- Modals
- Drawers
- Toasts
- Loading overlays
- Confirmation dialogs

### Usage Examples

#### 1. Reading State

```typescript
import { useSnapshot } from 'valtio';
import { appStore } from '../stores/appStore';

function Sidebar() {
  const snap = useSnapshot(appStore);
  
  return (
    <div className={snap.sidebarOpen ? 'open' : 'closed'}>
      {/* sidebar content */}
    </div>
  );
}
```

#### 2. Updating State

```typescript
import { appActions } from '../stores/appStore';

function SidebarToggle() {
  return (
    <button onClick={appActions.toggleSidebar}>
      Toggle Sidebar
    </button>
  );
}
```

#### 3. Modal Management

```typescript
import { useSnapshot } from 'valtio';
import { uiStore, uiActions } from '../stores/uiStore';

function AddEmployeeButton() {
  return (
    <button onClick={() => uiActions.openModal('addEmployee')}>
      Add Employee
    </button>
  );
}

function AddEmployeeModal() {
  const snap = useSnapshot(uiStore);
  const isOpen = snap.modals.addEmployee?.isOpen;
  
  if (!isOpen) return null;
  
  return (
    <Modal onClose={() => uiActions.closeModal('addEmployee')}>
      {/* modal content */}
    </Modal>
  );
}
```

#### 4. Toast Notifications

```typescript
import { uiActions } from '../stores/uiStore';

function SomeComponent() {
  const handleSuccess = () => {
    uiActions.addToast({
      type: 'success',
      message: 'Operation completed!',
      duration: 3000,
    });
  };
  
  const handleError = () => {
    uiActions.addToast({
      type: 'error',
      message: 'Something went wrong!',
    });
  };
  
  return <div>{/* component */}</div>;
}
```

#### 5. Confirmation Dialogs

```typescript
import { uiActions } from '../stores/uiStore';

function DeleteButton({ employeeId }) {
  const handleDelete = () => {
    uiActions.showConfirmDialog(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      async () => {
        // On confirm
        await deleteEmployee(employeeId);
      },
      () => {
        // On cancel (optional)
        console.log('Cancelled');
      }
    );
  };
  
  return <button onClick={handleDelete}>Delete</button>;
}
```

---

## 📋 Migration Checklist

### For Each Component:

1. **Identify State Type**
   - Server data? → Use TanStack Query
   - UI state? → Use Valtio

2. **Replace useState for Server Data**
   ```typescript
   // ❌ Before
   const [employees, setEmployees] = useState([]);
   useEffect(() => {
     fetchEmployees().then(setEmployees);
   }, []);
   
   // ✅ After
   const { data: employees } = useEmployees();
   ```

3. **Replace useEffect for Data Fetching**
   ```typescript
   // ❌ Before
   useEffect(() => {
     fetchData().then(setData);
   }, [dependency]);
   
   // ✅ After
   const { data } = useQuery({
     queryKey: ['key', dependency],
     queryFn: fetchData,
   });
   ```

4. **Use Mutations for Updates**
   ```typescript
   // ❌ Before
   const handleCreate = async (data) => {
     setLoading(true);
     try {
       await createItem(data);
       await refetchItems();
     } finally {
       setLoading(false);
     }
   };
   
   // ✅ After
   const createItem = useCreateItem();
   const handleCreate = (data) => {
     createItem.mutate(data); // Auto-invalidates and refetches
   };
   ```

---

## 🎨 Best Practices

### TanStack Query

1. **Always use query keys from `queryKeys` object**
   ```typescript
   // ✅ Good
   queryKey: queryKeys.employees.detail(id)
   
   // ❌ Bad
   queryKey: ['employees', id]
   ```

2. **Invalidate related queries after mutations**
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
   }
   ```

3. **Use `enabled` option for conditional queries**
   ```typescript
   const { data } = useQuery({
     queryKey: queryKeys.employees.detail(id),
     queryFn: () => fetchEmployee(id),
     enabled: !!id, // Only run if id exists
   });
   ```

4. **Handle loading and error states**
   ```typescript
   const { data, isLoading, error, isError } = useQuery(...);
   
   if (isLoading) return <Spinner />;
   if (isError) return <Error message={error.message} />;
   ```

### Valtio

1. **Always use `useSnapshot` to read state**
   ```typescript
   // ✅ Good
   const snap = useSnapshot(appStore);
   console.log(snap.user);
   
   // ❌ Bad (won't trigger re-renders)
   console.log(appStore.user);
   ```

2. **Use actions for state updates**
   ```typescript
   // ✅ Good
   appActions.setUser(user);
   
   // ⚠️ Works but not recommended
   appStore.user = user;
   ```

3. **Keep stores focused**
   - One store per domain (app, ui, etc.)
   - Don't mix concerns

---

## 🔧 DevTools

### React Query Devtools
- Automatically included in development mode
- Access via floating icon in bottom-right corner
- View all queries, their status, and cached data
- Manually trigger refetches
- Inspect query details

### Valtio Devtools
- Install browser extension: [Valtio Devtools](https://github.com/pmndrs/valtio-devtools)
- Track state changes in real-time
- Time-travel debugging

---

## 📊 Performance Benefits

1. **Automatic Caching**: Data fetched once is reused across components
2. **Background Refetching**: Stale data is updated in the background
3. **Request Deduplication**: Multiple components requesting same data = 1 request
4. **Optimistic Updates**: UI updates immediately, rolls back on error
5. **Automatic Garbage Collection**: Unused data is cleaned up
6. **Minimal Re-renders**: Valtio only re-renders components using changed state
7. **No Prop Drilling**: Access state anywhere without passing props

---

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Valtio Docs](https://github.com/pmndrs/valtio)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

---

## ✅ Status

- ✅ TanStack Query installed and configured
- ✅ Valtio installed and configured
- ✅ Query client setup with optimized defaults
- ✅ Centralized query keys
- ✅ App store created
- ✅ UI store created
- ✅ Example hooks created (useEmployees, useProjects)
- ✅ App.tsx updated with QueryClientProvider
- ✅ DevTools enabled in development

**Next Steps**: Migrate existing components to use these new patterns!
