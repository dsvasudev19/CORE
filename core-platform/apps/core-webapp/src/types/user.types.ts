// User Types
import type { RoleDTO } from './role.types';

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface UserDTO {
  id?: number;
  organizationId?: number;
  username: string;
  email: string;
  password?: string;
  status?: UserStatus;
  lastLoginAt?: string;
  employeeId?: number;
  roles?: RoleDTO[];
  permissions?: import('./permission.types').PermissionDTO[];
  roleNames?: string[];
  permissionKeys?: string[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface UserSearchParams {
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
