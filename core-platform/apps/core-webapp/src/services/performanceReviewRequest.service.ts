import axiosInstance from "../axiosInstance";
import type {
  PerformanceReviewRequestDTO,
  MinimalPerformanceReviewRequestDTO,
} from "../types/performance.types";

const PERFORMANCE_REVIEW_REQUESTS_API_BASE = "/performance/review-requests";

export const performanceReviewRequestService = {
  // Get a specific review request by ID
  getById: async (requestId: number): Promise<PerformanceReviewRequestDTO> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_REVIEW_REQUESTS_API_BASE}/${requestId}`,
    );
    return response.data;
  },

  // Get pending review requests for a reviewer
  getPendingByReviewer: async (
    reviewerId: number,
  ): Promise<PerformanceReviewRequestDTO[]> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_REVIEW_REQUESTS_API_BASE}/reviewer/${reviewerId}/pending`,
    );
    return response.data;
  },

  // Get pending review requests (minimal) for a reviewer
  getPendingMinimal: async (
    reviewerId: number,
  ): Promise<MinimalPerformanceReviewRequestDTO[]> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_REVIEW_REQUESTS_API_BASE}/reviewer/${reviewerId}/pending/minimal`,
    );
    return response.data;
  },

  // Get all review requests for an employee
  getEmployeeRequests: async (
    employeeId: number,
  ): Promise<PerformanceReviewRequestDTO[]> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_REVIEW_REQUESTS_API_BASE}/employee/${employeeId}`,
    );
    return response.data;
  },
};
