import axios from "axios";
import type {
  PerformanceReviewRequestDTO,
  MinimalPerformanceReviewRequestDTO,
} from "../types/performance.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/performance/review-requests`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const performanceReviewRequestService = {
  // Get a specific review request by ID
  getById: async (requestId: number): Promise<PerformanceReviewRequestDTO> => {
    const response = await api.get(`/${requestId}`);
    return response.data;
  },

  // Get pending review requests for a reviewer
  getPendingByReviewer: async (
    reviewerId: number,
  ): Promise<PerformanceReviewRequestDTO[]> => {
    const response = await api.get(`/reviewer/${reviewerId}/pending`);
    return response.data;
  },

  // Get pending review requests (minimal) for a reviewer
  getPendingMinimal: async (
    reviewerId: number,
  ): Promise<MinimalPerformanceReviewRequestDTO[]> => {
    const response = await api.get(`/reviewer/${reviewerId}/pending/minimal`);
    return response.data;
  },

  // Get all review requests for an employee
  getEmployeeRequests: async (
    employeeId: number,
  ): Promise<PerformanceReviewRequestDTO[]> => {
    const response = await api.get(`/employee/${employeeId}`);
    return response.data;
  },
};
