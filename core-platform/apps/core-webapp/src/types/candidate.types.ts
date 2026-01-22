export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobPostingId: number;
  jobPostingTitle?: string;
  resumeUrl: string;
  coverLetterUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  experience: string;
  education: string;
  currentCompany: string;
  currentPosition: string;
  status: CandidateStatus;
  stage: CandidateStage;
  appliedDate: string;
  interviewDate: string;
  rating: number;
  notes: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export enum CandidateStatus {
  NEW = "NEW",
  UNDER_REVIEW = "UNDER_REVIEW",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEWED = "INTERVIEWED",
  OFFER_EXTENDED = "OFFER_EXTENDED",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum CandidateStage {
  INITIAL_SCREENING = "INITIAL_SCREENING",
  PHONE_SCREENING = "PHONE_SCREENING",
  TECHNICAL_ROUND = "TECHNICAL_ROUND",
  HR_ROUND = "HR_ROUND",
  FINAL_ROUND = "FINAL_ROUND",
  OFFER_NEGOTIATION = "OFFER_NEGOTIATION",
  BACKGROUND_CHECK = "BACKGROUND_CHECK",
}

export interface CandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobPostingId: number;
  resumeUrl?: string;
  coverLetterUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  experience?: string;
  education?: string;
  currentCompany?: string;
  currentPosition?: string;
  status: CandidateStatus;
  stage?: CandidateStage;
  appliedDate?: string;
  interviewDate?: string;
  rating?: number;
  notes?: string;
  organizationId: number;
}
