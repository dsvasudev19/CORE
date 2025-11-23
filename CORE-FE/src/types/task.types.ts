// Task-related TypeScript types matching backend DTOs

export const TaskStatus = {
    BACKLOG: 'BACKLOG',
    IN_PROGRESS: 'IN_PROGRESS',
    REVIEW: 'REVIEW',
    DONE: 'DONE',
    BLOCKED: 'BLOCKED',
    REOPENED: 'REOPENED'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];


export interface TaskTagDTO {
    id?: number;
    name: string;
    color?: string;
}

export interface TaskDependencyDTO {
    id?: number;
    taskId: number;
    dependsOnTaskId: number;
    dependencyType: string;
    // Additional fields from backend
    dependsOnTask?: TaskDTO; // Full task object for the dependency
    task?: TaskDTO; // Full task object for the dependent task
    createdAt?: string;
    createdBy?: number;
}

export interface TaskCommentDTO {
    id?: number;
    taskId: number;
    commentText: string;
    commentedBy?: number;
    commentedAt?: string;
    parentCommentId?: number;
    replies?: TaskCommentDTO[];
    // Commenter details from backend
    commenter?: {
        id?: number;
        employeeCode?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    // Legacy fields for display
    commenterName?: string;
    commenterEmail?: string;
}

export interface TaskAttachmentDTO {
    id?: number;
    taskId: number;
    fileName: string;
    fileUrl?: string; // Legacy field
    storedPath?: string; // Actual field from backend
    contentType?: string;
    fileSize?: number;
    uploadedBy?: number;
    uploadedAt?: string;
    description?: string;
    visibility?: string; // INTERNAL or PUBLIC
    uploadedByUser?: EmployeeDTO;
}

export interface MinimalEmployeeDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface EmployeeDTO extends MinimalEmployeeDTO {
    phone?: string;
    employeeCode?: string;
}

export interface TaskDTO {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    startDate?: string;
    dueDate?: string;
    estimatedHours?: number;
    actualHours?: number;
    completedAt?: string;
    phaseId?: number;
    projectId?: number;
    parentTaskId?: number;
    ownerId?: number;
    owner?: EmployeeDTO; // NEW - returned from backend
    progressPercentage?: number;
    assigneeIds?: number[];
    assignees?: MinimalEmployeeDTO[]; // NEW - returned from backend
    tags?: TaskTagDTO[];
    dependencies?: TaskDependencyDTO[];
    comments?: TaskCommentDTO[];
    attachments?: TaskAttachmentDTO[];
    subtasks?: TaskDTO[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    startDate?: string;
    dueDate?: string;
    estimatedHours?: number;
    phaseId?: number;
    projectId?: number;
    parentTaskId?: number;
    ownerId?: number;
    assigneeIds?: number[];
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    startDate?: string;
    dueDate?: string;
    estimatedHours?: number;
    actualHours?: number;
    phaseId?: number;
    projectId?: number;
    parentTaskId?: number;
    ownerId?: number;
    progressPercentage?: number;
}
