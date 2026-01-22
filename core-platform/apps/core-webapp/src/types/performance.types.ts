// Performance Review Types
export interface PerformanceReview {
  id: number;
  requestId: number;
  rating: number;
  strengths: string;
  improvements: string;
  comments: string;
  nextQuarterGoals: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReviewDTO {
  id?: number;
  requestId: number;
  rating: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
  nextQuarterGoals?: string;
}

// Performance Cycle Types
export interface PerformanceCycle {
  id: number;
  year: number;
  quarter: number;
  active: boolean;
  startedAt: string;
  endedAt: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceCycleDTO {
  id?: number;
  year: number;
  quarter: number;
  active?: boolean;
  startedAt?: string;
  endedAt?: string;
  organizationId: number;
}

// Performance Review Request Types
export interface PerformanceReviewRequest {
  id: number;
  cycleId: number;
  cycleYear?: number;
  cycleQuarter?: number;
  reviewerId: number;
  reviewerName?: string;
  employeeId: number;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  type: ReviewType;
  status: ReviewStatus;
  submittedAt: string;
  note: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReviewRequestDTO {
  id?: number;
  cycleId: number;
  cycleYear?: number;
  cycleQuarter?: number;
  reviewerId: number;
  reviewerName?: string;
  employeeId: number;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  type: ReviewType;
  status: ReviewStatus;
  submittedAt?: string;
  note?: string;
  organizationId: number;
}

export interface MinimalPerformanceReviewRequestDTO {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode?: string;
  type: ReviewType;
  status: ReviewStatus;
  cycleYear: number;
  cycleQuarter: number;
}

// Enums
export enum ReviewType {
  MANAGER = "MANAGER",
  PEER = "PEER",
  SELF = "SELF",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
}

// Analytics Types
export interface EmployeePerformanceSummary {
  employeeId: number;
  employeeName: string;
  totalReviews: number;
  averageRating: number;
  latestRating: number;
  trend: "up" | "down" | "stable";
  completedReviews: number;
  pendingReviews: number;
  strengths: string[];
  improvements: string[];
}

export interface DepartmentPerformanceSummary {
  departmentId: number;
  departmentName: string;
  totalEmployees: number;
  averageRating: number;
  completedReviews: number;
  pendingReviews: number;
  topPerformers: Array<{
    employeeId: number;
    employeeName: string;
    rating: number;
  }>;
  needsImprovement: Array<{
    employeeId: number;
    employeeName: string;
    rating: number;
  }>;
}

export interface CyclePerformanceSummary {
  cycleId: number;
  year: number;
  quarter: number;
  totalRequests: number;
  completedReviews: number;
  pendingReviews: number;
  averageRating: number;
  completionRate: number;
  ratingDistribution: {
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
  };
}

// Combined Review Data (for display)
export interface ReviewWithDetails {
  request: PerformanceReviewRequestDTO;
  review?: PerformanceReviewDTO;
  cycle: PerformanceCycleDTO;
}
