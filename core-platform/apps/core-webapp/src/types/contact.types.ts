// Contact Types
export interface ContactDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  type?: ContactType;
  notes?: string;
  organizationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ContactType =
  | "CLIENT"
  | "VENDOR"
  | "PARTNER"
  | "EMPLOYEE"
  | "OTHER";

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  type?: ContactType;
  notes?: string;
}

export interface UpdateContactRequest {
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  type?: ContactType;
  notes?: string;
}
