// User Types
import type { RoleDTO } from './role.types';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

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
