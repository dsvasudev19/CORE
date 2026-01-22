import axios from 'axios';
import type { PerformanceReviewDTO } from '../types/performance.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/performance/reviews`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const performanceReviewService = {
  // Submit a review for a request
  submitReview: async (requestId: number, data: PerformanceReviewDTO): Promise<PerformanceReviewDTO> => {
    const response = await api.post(`/${requestId}/submit`, data);
    return response.data;
  },

  // Get all reviews for an employee
  getEmployeeReviews: async (employeeId: number): Promise<PerformanceReviewDTO[]> => {
    const response = await api.get(`/employee/${employeeId}`);
    return response.data;
  },

  // Get all reviews for a cycle
  getCycleReviews: async (cycleId: number): Promise<PerformanceReviewDTO[]> => {
    const response = await api.get(`/cycle/${cycleId}`);
    return response.data;
  },
};
