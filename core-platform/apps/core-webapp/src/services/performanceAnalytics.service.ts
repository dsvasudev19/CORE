import axiosInstance from "../axiosInstance";

const PERFORMANCE_ANALYTICS_API_BASE = "/performance/analytics";

export const performanceAnalyticsService = {
  // Get employee performance summary
  getEmployeeSummary: async (
    employeeId: number,
  ): Promise<Record<string, any>> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_ANALYTICS_API_BASE}/employee/${employeeId}`,
    );
    return response.data;
  },

  // Get department performance summary
  getDepartmentSummary: async (
    departmentId: number,
  ): Promise<Record<string, any>> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_ANALYTICS_API_BASE}/department/${departmentId}`,
    );
    return response.data;
  },

  // Get cycle performance summary
  getCycleSummary: async (cycleId: number): Promise<Record<string, any>> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_ANALYTICS_API_BASE}/cycle/${cycleId}`,
    );
    return response.data;
  },
};
