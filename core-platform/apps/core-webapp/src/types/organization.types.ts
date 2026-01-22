// Organization Types
export interface OrganizationDTO {
  id: number;
  name: string;
  code: string;
  domain?: string;
  status: OrganizationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type OrganizationStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING';

export interface CreateOrganizationRequest {
  name: string;
  code: string;
  domain?: string;
  status?: OrganizationStatus;
}

export interface UpdateOrganizationRequest {
  name?: string;
  code?: string;
  domain?: string;
  status?: OrganizationStatus;
}

export interface OrganizationPageResponse {
  content: OrganizationDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
