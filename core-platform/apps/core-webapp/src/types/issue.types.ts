export interface Issue {
  id: number;
  key: string;
  summary: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  storyPoints: number;
  epicId: number;
  epicKey?: string;
  epicName?: string;
  sprintId: number;
  sprintName?: string;
  projectId: number;
  projectName?: string;
  assigneeId: number;
  assigneeName?: string;
  reporterId: number;
  reporterName?: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export enum IssueType {
  STORY = "STORY",
  TASK = "TASK",
  BUG = "BUG",
  EPIC = "EPIC",
}

export enum IssuePriority {
  HIGHEST = "HIGHEST",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  LOWEST = "LOWEST",
}

export enum IssueStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export interface IssueDTO {
  key: string;
  summary: string;
  description?: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  storyPoints?: number;
  epicId?: number;
  sprintId?: number;
  projectId: number;
  assigneeId?: number;
  reporterId?: number;
  organizationId: number;
}
