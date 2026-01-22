import axios from "axios";
import type { PerformanceCycleDTO } from "../types/performance.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/performance/cycles`,
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

export const performanceCycleService = {
  // Create a new performance cycle
  createCycle: async (
    year: number,
    quarter: number,
    organizationId: number,
  ): Promise<PerformanceCycleDTO> => {
    const response = await api.post("", null, {
      params: { year, quarter, organizationId },
    });
    return response.data;
  },

  // Get the active cycle for an organization
  getActiveCycle: async (
    organizationId: number,
  ): Promise<PerformanceCycleDTO> => {
    const response = await api.get(`/active/${organizationId}`);
    return response.data;
  },

  // List all cycles for an organization
  listCycles: async (
    organizationId: number,
  ): Promise<PerformanceCycleDTO[]> => {
    const response = await api.get(`/organization/${organizationId}`);
    return response.data;
  },

  // Close a cycle
  closeCycle: async (cycleId: number): Promise<boolean> => {
    const response = await api.post(`/${cycleId}/close`);
    return response.data;
  },
};
