// Permission Types
import type { ResourceDTO } from "./resource.types";
import type { ActionDTO } from "./action.types";

export interface PermissionDTO {
  id?: number;
  organizationId?: number;
  resource: ResourceDTO;
  action: ActionDTO;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface PermissionSearchParams {
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
