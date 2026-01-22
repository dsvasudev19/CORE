// Announcement Types

export interface AnnouncementDTO {
  id?: number;
  organizationId?: number;
  title: string;
  content: string;
  category: string; // General, Benefits, Events, Facilities, HR, IT
  priority: string; // High, Medium, Low
  author: string;
  publishedDate: string; // LocalDate from backend
  expiryDate?: string; // LocalDate from backend
  views: number;
  reactions: number;
  isPinned: boolean;
  status: string; // Active, Archived, Draft
  targetAudience: string; // All Employees, Engineering, HR, etc.
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface AnnouncementStats {
  totalPosts: number;
  active: number;
}

export interface PagedAnnouncementResponse {
  content: AnnouncementDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type AnnouncementCategory =
  | "General"
  | "Benefits"
  | "Events"
  | "Facilities"
  | "HR"
  | "IT";
export type AnnouncementPriority = "High" | "Medium" | "Low";
export type AnnouncementStatus = "Active" | "Archived" | "Draft";
