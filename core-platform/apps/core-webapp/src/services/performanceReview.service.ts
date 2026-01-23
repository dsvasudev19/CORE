import axiosInstance from '../axiosInstance';
import type { PerformanceReviewDTO } from '../types/performance.types';

const PERFORMANCE_REVIEWS_API_BASE = '/performance/reviews';

export const performanceReviewService = {
  // Submit a review for a request
  submitReview: async (requestId: number, data: PerformanceReviewDTO): Promise<PerformanceReviewDTO> => {
    const response = await axiosInstance.post(`${PERFORMANCE_REVIEWS_API_BASE}/${requestId}/submit`, data);
    return response.data;
  },

  // Get all reviews for an employee
  getEmployeeReviews: async (employeeId: number): Promise<PerformanceReviewDTO[]> => {
    const response = await axiosInstance.get(`${PERFORMANCE_REVIEWS_API_BASE}/employee/${employeeId}`);
    return response.data;
  },

  // Get all reviews for a cycle
  getCycleReviews: async (cycleId: number): Promise<PerformanceReviewDTO[]> => {
    const response = await axiosInstance.get(`${PERFORMANCE_REVIEWS_API_BASE}/cycle/${cycleId}`);
    return response.data;
  },
};
