import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query Client Configuration
 * Centralized configuration for React Query with optimized defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Cache time: Unused data stays in cache for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query key management for consistency and type safety
 */
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
    permissions: ["auth", "permissions"] as const,
  },

  // Employees
  employees: {
    all: ["employees"] as const,
    list: (filters?: any) => ["employees", "list", filters] as const,
    detail: (id: number) => ["employees", "detail", id] as const,
    attendance: (id: number) => ["employees", "attendance", id] as const,
  },

  // Projects
  projects: {
    all: ["projects"] as const,
    list: (filters?: any) => ["projects", "list", filters] as const,
    detail: (id: number) => ["projects", "detail", id] as const,
    tasks: (id: number) => ["projects", id, "tasks"] as const,
    members: (id: number) => ["projects", id, "members"] as const,
    overview: ["projects", "overview"] as const,
  },

  // Tasks
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: any) => ["tasks", "list", filters] as const,
    detail: (id: number) => ["tasks", "detail", id] as const,
    myTasks: (userId: number) => ["tasks", "my", userId] as const,
  },

  // Time Tracking
  timeLogs: {
    all: ["timeLogs"] as const,
    list: (filters?: any) => ["timeLogs", "list", filters] as const,
    detail: (id: number) => ["timeLogs", "detail", id] as const,
    employee: (userId: number, dateRange?: any) =>
      ["timeLogs", "employee", userId, dateRange] as const,
    overview: (dateRange?: any) => ["timeLogs", "overview", dateRange] as const,
  },

  // Leave Management
  leave: {
    requests: {
      all: ["leave", "requests"] as const,
      list: (filters?: any) => ["leave", "requests", "list", filters] as const,
      detail: (id: number) => ["leave", "requests", "detail", id] as const,
      employee: (userId: number) =>
        ["leave", "requests", "employee", userId] as const,
    },
    types: ["leave", "types"] as const,
    balances: (userId: number) => ["leave", "balances", userId] as const,
  },

  // Performance
  performance: {
    reviews: {
      all: ["performance", "reviews"] as const,
      list: (filters?: any) =>
        ["performance", "reviews", "list", filters] as const,
      detail: (id: number) => ["performance", "reviews", "detail", id] as const,
      employee: (userId: number) =>
        ["performance", "reviews", "employee", userId] as const,
      cycle: (cycleId: number) =>
        ["performance", "reviews", "cycle", cycleId] as const,
    },
    cycles: {
      all: ["performance", "cycles"] as const,
      active: ["performance", "cycles", "active"] as const,
      detail: (id: number) => ["performance", "cycles", "detail", id] as const,
    },
  },

  // Announcements
  announcements: {
    all: ["announcements"] as const,
    list: (filters?: any) => ["announcements", "list", filters] as const,
    detail: (id: number) => ["announcements", "detail", id] as const,
    pinned: ["announcements", "pinned"] as const,
  },

  // Teams
  teams: {
    all: ["teams"] as const,
    list: (filters?: any) => ["teams", "list", filters] as const,
    detail: (id: number) => ["teams", "detail", id] as const,
    members: (id: number) => ["teams", id, "members"] as const,
  },

  // Departments
  departments: {
    all: ["departments"] as const,
    list: (filters?: any) => ["departments", "list", filters] as const,
    detail: (id: number) => ["departments", "detail", id] as const,
  },

  // Designations
  designations: {
    all: ["designations"] as const,
    list: (filters?: any) => ["designations", "list", filters] as const,
    detail: (id: number) => ["designations", "detail", id] as const,
  },

  // Clients
  clients: {
    all: ["clients"] as const,
    list: (filters?: any) => ["clients", "list", filters] as const,
    detail: (id: number) => ["clients", "detail", id] as const,
    documents: (id: number) => ["clients", id, "documents"] as const,
  },

  // Bugs
  bugs: {
    all: ["bugs"] as const,
    list: (filters?: any) => ["bugs", "list", filters] as const,
    detail: (id: number) => ["bugs", "detail", id] as const,
    comments: (id: number) => ["bugs", id, "comments"] as const,
    history: (id: number) => ["bugs", id, "history"] as const,
  },

  // Todos
  todos: {
    all: ["todos"] as const,
    list: (filters?: any) => ["todos", "list", filters] as const,
    detail: (id: number) => ["todos", "detail", id] as const,
    employee: (userId: number) => ["todos", "employee", userId] as const,
  },

  // Attendance
  attendance: {
    all: ["attendance"] as const,
    list: (filters?: any) => ["attendance", "list", filters] as const,
    employee: (userId: number, dateRange?: any) =>
      ["attendance", "employee", userId, dateRange] as const,
    summary: (dateRange?: any) => ["attendance", "summary", dateRange] as const,
  },

  // Payroll
  payroll: {
    all: ["payroll"] as const,
    list: (filters?: any) => ["payroll", "list", filters] as const,
    detail: (id: number) => ["payroll", "detail", id] as const,
    employee: (employeeId: number) => ["payroll", "employee", employeeId] as const,
    period: (organizationId: number, month: number, year: number) => 
      ["payroll", "period", organizationId, month, year] as const,
    summary: (organizationId: number, month: number, year: number) => 
      ["payroll", "summary", organizationId, month, year] as const,
    history: (payrollId: number) => ["payroll", "history", payrollId] as const,
  },

  // Documents
  documents: {
    all: ["documents"] as const,
    list: (filters?: any) => ["documents", "list", filters] as const,
    detail: (id: number) => ["documents", "detail", id] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
    count: ["notifications", "count"] as const,
  },

  // Recruitment
  recruitment: {
    jobs: {
      all: ["recruitment", "jobs"] as const,
      list: (filters?: any) =>
        ["recruitment", "jobs", "list", filters] as const,
      detail: (id: number) => ["recruitment", "jobs", "detail", id] as const,
    },
    candidates: {
      all: ["recruitment", "candidates"] as const,
      list: (filters?: any) =>
        ["recruitment", "candidates", "list", filters] as const,
      detail: (id: number) =>
        ["recruitment", "candidates", "detail", id] as const,
    },
  },

  // Audit Logs
  auditLogs: {
    all: ["auditLogs"] as const,
    list: (filters?: any) => ["auditLogs", "list", filters] as const,
  },
} as const;
