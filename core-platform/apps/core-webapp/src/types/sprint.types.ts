export interface Sprint {
  id: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  projectId: number;
  projectName?: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export enum SprintStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface SprintDTO {
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status: SprintStatus;
  projectId: number;
  organizationId: number;
}
