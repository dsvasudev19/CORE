/**
 * Centralized exports for all custom hooks
 * Makes imports cleaner: import { useEmployees, useProjects } from '../hooks'
 */

// Employee hooks
export * from "./useEmployees";

// Project hooks
export * from "./useProjects";

// Leave management hooks
export * from "./useLeave";

// Announcement hooks
export * from "./useAnnouncements";

// Payroll hooks
export * from "./usePayroll";

// Add more hook exports as you create them:
// export * from './useTasks';
// export * from './useTimeLogs';
// export * from './useAttendance';
// export * from './usePerformance';
// export * from './useTeams';
// export * from './useDepartments';
// export * from './useClients';
// export * from './useBugs';
// export * from './useTodos';
