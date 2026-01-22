// Action Types
export interface ActionDTO {
  id?: number;
  organizationId?: number;
  name: string;
  code: string;
  description?: string;
  category?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface ActionSearchParams {
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
