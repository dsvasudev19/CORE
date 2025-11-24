export interface TodoDTO {
    id: number;
    title: string;
    description?: string;
    type: TodoType;
    projectCode?: string;
    priority: TodoPriority;
    status: TodoStatus;
    dueDate?: string;
    estimatedTime?: number; // in minutes
    assignee?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        employeeCode: string;
    };
    project?: {
        name: string;
        code: string;
    };
    task?: {
        id: number;
        title: string;
        status: string;
    };
}

export const TodoPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
} as const;

export type TodoPriority = typeof TodoPriority[keyof typeof TodoPriority];

export const TodoStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    BLOCKED: 'BLOCKED',
    CANCELLED: 'CANCELLED'
} as const;

export type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus];

export const TodoType = {
    PERSONAL: 'PERSONAL',
    PROJECT: 'PROJECT',
    TASK: 'TASK'
} as const;

export type TodoType = typeof TodoType[keyof typeof TodoType];
