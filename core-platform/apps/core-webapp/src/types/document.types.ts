// Document Types
export interface DocumentDTO {
  id: number;
  entityType: string;
  entityId: number;
  fileId: string;
  title?: string;
  category?: string;
  uploadedBy?: number;
  description?: string;
  visibility?: string;
  organizationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadDocumentRequest {
  file: File;
  organizationId: number;
  entityType: string;
  entityId: number;
  title?: string;
  category?: string;
  visibility?: string;
  description?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  category?: string;
  visibility?: string;
  description?: string;
}

export type DocumentEntityType = 
  | 'PROJECT'
  | 'EMPLOYEE'
  | 'CLIENT'
  | 'TASK'
  | 'BUG'
  | 'ORGANIZATION';

export type DocumentVisibility = 
  | 'PUBLIC'
  | 'PRIVATE'
  | 'RESTRICTED';
