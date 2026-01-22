// Designation Types
export interface DesignationDTO {
  id: number;
  title: string;
  description?: string;
  code?: string;
  employees?: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDesignationRequest {
  title: string;
  description?: string;
  code?: string;
  organizationId: number;
}

export interface UpdateDesignationRequest {
  title?: string;
  description?: string;
  code?: string;
}
