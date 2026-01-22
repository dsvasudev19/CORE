import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/performance/analytics`,
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

export const performanceAnalyticsService = {
  // Get employee performance summary
  getEmployeeSummary: async (
    employeeId: number,
  ): Promise<Record<string, any>> => {
    const response = await api.get(`/employee/${employeeId}`);
    return response.data;
  },

  // Get department performance summary
  getDepartmentSummary: async (
    departmentId: number,
  ): Promise<Record<string, any>> => {
    const response = await api.get(`/department/${departmentId}`);
    return response.data;
  },

  // Get cycle performance summary
  getCycleSummary: async (cycleId: number): Promise<Record<string, any>> => {
    const response = await api.get(`/cycle/${cycleId}`);
    return response.data;
  },
};
