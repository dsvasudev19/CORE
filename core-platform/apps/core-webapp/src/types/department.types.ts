// Department Types
export interface DepartmentDTO {
  id: number;
  name: string;
  description?: string;
  code?: string;
  employees?: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  teams?: Array<{
    id: number;
    name: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  code?: string;
  organizationId: number;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  code?: string;
}
