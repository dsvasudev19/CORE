// Role Types
export interface PermissionDTO {
  id: number;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

export interface RoleDTO {
  id?: number;
  organizationId?: number;
  name: string;
  description: string;
  permissions?: PermissionDTO[];
  permissionKeys?: string[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface RoleSearchParams {
  organizationId: number;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
