export interface CalendarEventDTO {
  id?: number;
  organizationId: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  title: string;
  description?: string;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  eventType?: string; // Meeting, Deadline, Holiday, Training, Other
  location?: string;
  isAllDay?: boolean;
  color?: string;
  priority?: string; // Low, Medium, High, Critical
  status?: string; // Scheduled, Completed, Cancelled
  reminderMinutes?: number;
  isRecurring?: boolean;
  recurrencePattern?: string; // Daily, Weekly, Monthly, Yearly
  recurrenceEndDate?: string; // ISO datetime string
  createdByEmployeeId?: number;
  createdByEmployeeName?: string;
  attendees?: string; // Comma-separated employee IDs or JSON
  meetingLink?: string;
  notes?: string;
}

export interface CalendarEventStatsDTO {
  scheduled: number;
  completed: number;
  cancelled: number;
  total: number;
}

export interface CalendarEventPageResponse {
  content: CalendarEventDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
