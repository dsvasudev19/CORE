import axiosInstance from "../axiosInstance";
import type { PerformanceCycleDTO } from "../types/performance.types";

const PERFORMANCE_CYCLES_API_BASE = "/performance/cycles";

export const performanceCycleService = {
  // Create a new performance cycle
  createCycle: async (
    year: number,
    quarter: number,
    organizationId: number,
  ): Promise<PerformanceCycleDTO> => {
    const response = await axiosInstance.post(
      PERFORMANCE_CYCLES_API_BASE,
      null,
      {
        params: { year, quarter, organizationId },
      },
    );
    return response.data;
  },

  // Get the active cycle for an organization
  getActiveCycle: async (
    organizationId: number,
  ): Promise<PerformanceCycleDTO> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_CYCLES_API_BASE}/active/${organizationId}`,
    );
    return response.data;
  },

  // List all cycles for an organization
  listCycles: async (
    organizationId: number,
  ): Promise<PerformanceCycleDTO[]> => {
    const response = await axiosInstance.get(
      `${PERFORMANCE_CYCLES_API_BASE}/organization/${organizationId}`,
    );
    return response.data;
  },

  // Close a cycle
  closeCycle: async (cycleId: number): Promise<boolean> => {
    const response = await axiosInstance.post(
      `${PERFORMANCE_CYCLES_API_BASE}/${cycleId}/close`,
    );
    return response.data;
  },
};
