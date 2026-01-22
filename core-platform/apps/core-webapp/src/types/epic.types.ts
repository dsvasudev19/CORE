export interface Epic {
  id: number;
  key: string;
  name: string;
  description: string;
  color: string;
  status: EpicStatus;
  projectId: number;
  projectName?: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export enum EpicStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface EpicDTO {
  key: string;
  name: string;
  description?: string;
  color?: string;
  status: EpicStatus;
  projectId: number;
  organizationId: number;
}
