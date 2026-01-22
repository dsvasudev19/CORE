// Client Types
export interface ClientDTO {
  id: number;
  name: string;
  code?: string;
  domain?: string;
  address?: string;
  country?: string;
  industry?: string;
  status: string;
  description?: string;
  documents?: ClientDocumentDTO[];
  representatives?: ClientRepresentativeDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientDocumentDTO {
  id: number;
  clientId: number;
  fileId: string;
  title: string;
  category?: string;
  description?: string;
  uploadedBy?: number;
  organizationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientRepresentativeDTO {
  id: number;
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientRequest {
  name: string;
  code?: string;
  domain?: string;
  address?: string;
  country?: string;
  industry?: string;
  description?: string;
  representatives?: Omit<
    ClientRepresentativeDTO,
    "id" | "clientId" | "createdAt" | "updatedAt"
  >[];
}

export interface UpdateClientRequest {
  name?: string;
  code?: string;
  domain?: string;
  address?: string;
  country?: string;
  industry?: string;
  description?: string;
  representatives?: ClientRepresentativeDTO[];
}

export interface UploadClientDocumentRequest {
  file: File;
  title: string;
  category?: string;
  description?: string;
}
