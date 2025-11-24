// Bug-related TypeScript types matching backend DTOs

export const BugStatus = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    VERIFIED: 'VERIFIED',
    CLOSED: 'CLOSED',
    REOPENED: 'REOPENED'
} as const;

export type BugStatus = typeof BugStatus[keyof typeof BugStatus];

export const BugSeverity = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
} as const;

export type BugSeverity = typeof BugSeverity[keyof typeof BugSeverity];

export interface MinimalEmployeeDTO {
    id: number;
    employeeCode?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface EmployeeDTO extends MinimalEmployeeDTO {
    // Additional employee fields can be added here
}

export interface MinimalProject {
    name: string;
    code?: string;
}

export interface ProjectDTO extends MinimalProject {
    id: number;
}

export interface MinimalTask {
    id: number;
    title: string;
    description?: string;
}

export interface TaskDTO extends MinimalTask {
    id: number;
}

export interface BugCommentDTO {
    id?: number;
    organizationId?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
    bugId?: number;
    commentText: string;
    commentedBy?: MinimalEmployeeDTO;
    commentedAt?: string;
    parentCommentId?: number;
    replies?: BugCommentDTO[];
}

export interface BugHistoryDTO {
    id?: number;
    organizationId?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
    bugId?: number;
    changedField: string;
    oldValue?: string;
    newValue?: string;
    changedBy?: MinimalEmployeeDTO;
    changedAt?: string;
    note?: string;
}

export interface BugAttachmentDTO {
    id?: number;
    organizationId?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
    bugId?: number;
    fileName: string;
    storedPath?: string;
    fileSize?: number;
    contentType?: string;
    description?: string;
    visibility?: string;
    uploadedBy?: MinimalEmployeeDTO;
    uploadedAt?: string;
}

export interface BugDTO {
    id?: number;
    title: string;
    description?: string;
    status: BugStatus;
    severity: BugSeverity;
    environment?: string;
    appVersion?: string;
    project?: MinimalProject;
    linkedTask?: MinimalTask;
    reportedBy?: MinimalEmployeeDTO;
    assignedTo?: MinimalEmployeeDTO;
    verifiedBy?: MinimalEmployeeDTO;
    dueDate?: string;
    resolvedAt?: string;
    closedAt?: string;
    reopenCount?: number;
    commitReference?: string;
    attachments?: BugAttachmentDTO[];
    comments?: BugCommentDTO[];
    historyEntries?: BugHistoryDTO[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
}

export interface CreateBugDTO {
    title: string;
    description?: string;
    status?: BugStatus;
    severity?: BugSeverity;
    environment?: string;
    appVersion?: string;
    project?: MinimalProject;
    reportedBy?: MinimalEmployeeDTO;
    assignedTo?: MinimalEmployeeDTO;
    dueDate?: string;
}

export interface UpdateBugDTO {
    title?: string;
    description?: string;
    status?: BugStatus;
    severity?: BugSeverity;
    environment?: string;
    appVersion?: string;
    assignedTo?: MinimalEmployeeDTO;
    verifiedBy?: MinimalEmployeeDTO;
    dueDate?: string;
    commitReference?: string;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
