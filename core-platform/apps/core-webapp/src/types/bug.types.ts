export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED' | 'VERIFIED';
export type BugSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

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

export interface BugAttachmentDTO {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface BugCommentDTO {
  id: number;
  content: string;
  author: MinimalEmployee;
  createdAt: string;
}

export interface BugHistoryDTO {
  id: number;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: MinimalEmployee;
  changedAt: string;
}

export interface BugDTO {
  id: number;
  title: string;
  description?: string;
  status: BugStatus;
  severity: BugSeverity;
  environment?: string;
  appVersion?: string;
  project?: MinimalProject;
  linkedTask?: MinimalTask;
  reportedBy?: MinimalEmployee;
  assignedTo?: MinimalEmployee;
  verifiedBy?: MinimalEmployee;
  dueDate?: string;
  resolvedAt?: string;
  closedAt?: string;
  reopenCount?: number;
  commitReference?: string;
  attachments?: BugAttachmentDTO[];
  comments?: BugCommentDTO[];
  historyEntries?: BugHistoryDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface BugPageResponse {
  content: BugDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateBugRequest {
  title: string;
  description?: string;
  severity: BugSeverity;
  environment?: string;
  appVersion?: string;
  projectId?: number;
  assignedToId?: number;
  dueDate?: string;
  organizationId: number;
}

export interface UpdateBugRequest {
  title?: string;
  description?: string;
  severity?: BugSeverity;
  environment?: string;
  appVersion?: string;
  dueDate?: string;
}
