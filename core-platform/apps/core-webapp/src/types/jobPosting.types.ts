export interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  departmentId: number;
  departmentName?: string;
  location: string;
  type: JobType;
  salaryRange: string;
  status: JobStatus;
  urgency: JobUrgency;
  postedDate: string;
  closingDate: string;
  openings: number;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  applicantsCount?: number;
  shortlistedCount?: number;
  interviewedCount?: number;
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
}

export enum JobStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  ON_HOLD = "ON_HOLD",
}

export enum JobUrgency {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface JobPostingDTO {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  departmentId?: number;
  location: string;
  type: JobType;
  salaryRange?: string;
  status: JobStatus;
  urgency: JobUrgency;
  postedDate?: string;
  closingDate?: string;
  openings: number;
  organizationId: number;
}
