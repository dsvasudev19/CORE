// Policy Types
import type { RoleDTO } from "./role.types";
import type { ResourceDTO } from "./resource.types";
import type { ActionDTO } from "./action.types";

export interface PolicyDTO {
  id?: number;
  organizationId?: number;
  role: RoleDTO;
  resource: ResourceDTO;
  action: ActionDTO;
  condition?: string;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface PolicySearchParams {
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
