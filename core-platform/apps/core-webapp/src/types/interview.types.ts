export interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  jobPostingTitle: string;
  interviewerId: number | null;
  interviewerName: string | null;
  scheduledDateTime: string;
  durationMinutes: number;
  type: InterviewType;
  mode: InterviewMode;
  location: string | null;
  meetingLink: string | null;
  status: InterviewStatus;
  notes: string | null;
  feedback: string | null;
  rating: number | null;
  result: InterviewResult | null;
  completedAt: string | null;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export enum InterviewType {
  PHONE_SCREENING = "PHONE_SCREENING",
  TECHNICAL_ROUND = "TECHNICAL_ROUND",
  HR_ROUND = "HR_ROUND",
  MANAGERIAL_ROUND = "MANAGERIAL_ROUND",
  FINAL_ROUND = "FINAL_ROUND",
  CULTURAL_FIT = "CULTURAL_FIT",
}

export enum InterviewMode {
  IN_PERSON = "IN_PERSON",
  VIDEO_CALL = "VIDEO_CALL",
  PHONE_CALL = "PHONE_CALL",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
  NO_SHOW = "NO_SHOW",
}

export enum InterviewResult {
  PASSED = "PASSED",
  FAILED = "FAILED",
  ON_HOLD = "ON_HOLD",
  NEEDS_ANOTHER_ROUND = "NEEDS_ANOTHER_ROUND",
}

export interface InterviewDTO {
  candidateId: number;
  interviewerId?: number;
  scheduledDateTime: string;
  durationMinutes: number;
  type: InterviewType;
  mode: InterviewMode;
  location?: string;
  meetingLink?: string;
  status?: InterviewStatus;
  notes?: string;
  organizationId: number;
}
