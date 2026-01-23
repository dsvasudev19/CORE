# TanStack Query + Valtio Quick Start

## 🎯 Quick Decision Guide

**Is it server data?** → Use TanStack Query  
**Is it UI state?** → Use Valtio

---

## 📦 TanStack Query Cheat Sheet

### Basic Query

```typescript
import { useEmployees } from "../hooks/useEmployees";

const { data, isLoading, error } = useEmployees();
```

### Query with ID

```typescript
import { useEmployee } from "../hooks/useEmployees";

const { data: employee } = useEmployee(employeeId);
```

### Create Mutation

```typescript
import { useCreateEmployee } from "../hooks/useEmployees";

const createEmployee = useCreateEmployee();

const handleCreate = async (data) => {
  await createEmployee.mutateAsync(data);
};
```

### Update Mutation

```typescript
import { useUpdateEmployee } from "../hooks/useEmployees";

const updateEmployee = useUpdateEmployee();

const handleUpdate = async (id, data) => {
  await updateEmployee.mutateAsync({ id, data });
};
```

### Delete Mutation

```typescript
import { useDeleteEmployee } from "../hooks/useEmployees";

const deleteEmployee = useDeleteEmployee();

const handleDelete = async (id) => {
  await deleteEmployee.mutateAsync(id);
};
```

---

## 🎨 Valtio Cheat Sheet

### Read State

```typescript
import { useSnapshot } from "valtio";
import { appStore } from "../stores/appStore";

const snap = useSnapshot(appStore);
console.log(snap.user);
console.log(snap.sidebarOpen);
```

### Update State

```typescript
import { appActions } from "../stores/appStore";

// Toggle sidebar
appActions.toggleSidebar();

// Set user
appActions.setUser(userData);

// Set theme
appActions.setTheme("dark");
```

### Open Modal

```typescript
import { uiActions } from "../stores/uiStore";

uiActions.openModal("addEmployee", { someData: "value" });
```

### Close Modal

```typescript
uiActions.closeModal("addEmployee");
```

### Show Toast

```typescript
uiActions.addToast({
  type: "success",
  message: "Operation completed!",
  duration: 3000,
});
```

### Confirm Dialog

```typescript
uiActions.showConfirmDialog("Delete Item", "Are you sure?", () => {
  // On confirm
  deleteItem();
});
```

---

## 🔄 Migration Examples

### Example 1: Simple List

#### Before (useState + useEffect)

```typescript
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    employeeService.getAllEmployees()
      .then(setEmployees)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {employees.map(emp => (
        <div key={emp.id}>{emp.firstName}</div>
      ))}
    </div>
  );
}
```

#### After (TanStack Query)

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

### Example 2: Create Form

#### Before

```typescript
function AddEmployeeForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await employeeService.createEmployee(data);
      toast.success('Created!');
      // Manually refetch list
      refetchEmployees();
    } catch (error) {
      toast.error('Failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### After

```typescript
import { useCreateEmployee } from '../hooks/useEmployees';

function AddEmployeeForm() {
  const createEmployee = useCreateEmployee();

  const handleSubmit = async (data) => {
    try {
      await createEmployee.mutateAsync(data);
      toast.success('Created!');
      // List automatically refetches!
    } catch (error) {
      toast.error('Failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={createEmployee.isPending}>
        {createEmployee.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Example 3: Modal State

#### Before

```typescript
function EmployeeManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <div>
      <button onClick={() => openModal({ id: 1 })}>
        Open Modal
      </button>
      {isModalOpen && (
        <Modal onClose={closeModal} data={modalData} />
      )}
    </div>
  );
}
```

#### After

```typescript
import { useSnapshot } from 'valtio';
import { uiStore, uiActions } from '../stores/uiStore';

function EmployeeManagement() {
  const snap = useSnapshot(uiStore);

  return (
    <div>
      <button onClick={() => uiActions.openModal('employee', { id: 1 })}>
        Open Modal
      </button>
      {snap.modals.employee?.isOpen && (
        <Modal
          onClose={() => uiActions.closeModal('employee')}
          data={snap.modals.employee.data}
        />
      )}
    </div>
  );
}
```

---

## 📋 Available Hooks

### Employees

- `useEmployees()` - Get all employees
- `useEmployee(id)` - Get single employee
- `useCreateEmployee()` - Create employee
- `useUpdateEmployee()` - Update employee
- `useDeleteEmployee()` - Delete employee

### Projects

- `useProjects()` - Get all projects
- `useProject(id)` - Get single project
- `useProjectTasks(projectId)` - Get project tasks
- `useProjectMembers(projectId)` - Get project members
- `useCreateProject()` - Create project
- `useUpdateProject()` - Update project
- `useDeleteProject()` - Delete project

### Leave

- `useLeaveRequests()` - Get all leave requests
- `useEmployeeLeaveRequests(userId)` - Get employee requests
- `useLeaveTypes()` - Get leave types
- `useLeaveBalances(userId)` - Get leave balances
- `useCreateLeaveRequest()` - Create request
- `useApproveLeaveRequest()` - Approve request
- `useRejectLeaveRequest()` - Reject request

### Announcements

- `useAnnouncements()` - Get all announcements
- `useAnnouncement(id)` - Get single announcement
- `usePinnedAnnouncements()` - Get pinned announcements
- `useCreateAnnouncement()` - Create announcement
- `usePinAnnouncement()` - Pin announcement
- `useMarkAnnouncementRead()` - Mark as read

---

## 🎯 Common Patterns

### Loading State

```typescript
const { data, isLoading, isFetching } = useEmployees();

// isLoading: true on first load
// isFetching: true on any fetch (including background refetch)
```

### Error Handling

```typescript
const { data, error, isError } = useEmployees();

if (isError) {
  return <div>Error: {error.message}</div>;
}
```

### Refetch on Demand

```typescript
const { data, refetch } = useEmployees();

<button onClick={() => refetch()}>Refresh</button>
```

### Dependent Queries

```typescript
const { data: project } = useProject(projectId);
const { data: tasks } = useProjectTasks(projectId, {
  enabled: !!project, // Only fetch if project exists
});
```

### Optimistic Updates

```typescript
const updateEmployee = useUpdateEmployee();

updateEmployee.mutate(
  { id, data },
  {
    onMutate: async (newData) => {
      // Update UI immediately
      queryClient.setQueryData(["employee", id], newData);
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(["employee", id], context.previousData);
    },
  },
);
```

---

## 🚀 Next Steps

1. Start migrating components one by one
2. Begin with simple list components
3. Move to forms and mutations
4. Replace modal state with Valtio
5. Test thoroughly after each migration

---

## 💡 Tips

- Use React Query DevTools (bottom-right corner in dev mode)
- Check query status in DevTools
- Invalidate queries after mutations
- Use `enabled` option for conditional queries
- Keep Valtio for UI state only
- Always use `useSnapshot` to read Valtio state
