export interface AuditLogDTO {
  id: number;
  userId: number;
  action: string;
  entityName: string;
  entityId: number;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogPageResponse {
  content: AuditLogDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateAuditLogRequest {
  userId: number;
  action: string;
  entityName: string;
  entityId: number;
  metadata?: string;
  organizationId: number;
}
