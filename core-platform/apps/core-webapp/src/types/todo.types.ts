export enum TodoStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
  CANCELLED = "CANCELLED",
}

export enum TodoPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
  CRITICAL = "CRITICAL",
}

export enum TodoType {
  PERSONAL = "PERSONAL",
  PROJECT = "PROJECT",
  TASK = "TASK",
}

export interface MinimalProject {
  id: number;
  code: string;
  name: string;
}

export interface MinimalTask {
  id: number;
  title: string;
}

export interface MinimalEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TodoDTO {
  id: number;
  organizationId: number;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  type: TodoType;
  dueDate?: string;
  completedAt?: string;
  assignee?: MinimalEmployee;
  project?: MinimalProject;
  task?: MinimalTask;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  organizationId: number;
  title: string;
  description?: string;
  priority: TodoPriority;
  type: TodoType;
  dueDate?: string;
  assigneeId?: number;
  projectCode?: string;
  taskId?: number;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: string;
}
