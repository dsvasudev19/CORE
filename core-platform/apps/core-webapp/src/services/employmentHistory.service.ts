import axiosInstance from "../axiosInstance";
import type {
  EmploymentHistoryDTO,
  CreateEmploymentHistoryRequest,
  EmploymentHistoryAnalytics,
} from "../types/employmentHistory.types";

const EMPLOYMENT_HISTORY_API_BASE = "/employment-history";

export const employmentHistoryService = {
  // Create a new employment history record
  createHistory: async (
    data: CreateEmploymentHistoryRequest,
  ): Promise<EmploymentHistoryDTO> => {
    const response = await axiosInstance.post(
      EMPLOYMENT_HISTORY_API_BASE,
      data,
    );
    return response.data.data;
  },

  // Get employment history for an employee
  getHistoryByEmployee: async (
    employeeId: number,
  ): Promise<EmploymentHistoryDTO[]> => {
    const response = await axiosInstance.get(
      `${EMPLOYMENT_HISTORY_API_BASE}/employee/${employeeId}`,
    );
    return response.data.data;
  },

  // Delete an employment history record
  deleteHistory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${EMPLOYMENT_HISTORY_API_BASE}/${id}`);
  },

  // Get analytics - count promotions
  countPromotions: async (organizationId: number): Promise<number> => {
    const response = await axiosInstance.get(
      `${EMPLOYMENT_HISTORY_API_BASE}/analytics/promotions`,
      {
        params: { organizationId },
      },
    );
    return response.data.data;
  },

  // Get analytics - count resignations
  countResignations: async (organizationId: number): Promise<number> => {
    const response = await axiosInstance.get(
      `${EMPLOYMENT_HISTORY_API_BASE}/analytics/resignations`,
      {
        params: { organizationId },
      },
    );
    return response.data.data;
  },

  // Get combined analytics
  getAnalytics: async (
    organizationId: number,
  ): Promise<EmploymentHistoryAnalytics> => {
    const [promotions, resignations] = await Promise.all([
      employmentHistoryService.countPromotions(organizationId),
      employmentHistoryService.countResignations(organizationId),
    ]);

    return {
      promotions,
      resignations,
    };
  },
};

export default employmentHistoryService;
