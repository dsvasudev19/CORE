import axiosInstance from "../axiosInstance";
import type { Sprint, SprintDTO } from "../types/sprint.types";

const SPRINT_API_BASE = "/sprint";

export const sprintService = {
  createSprint: async (data: SprintDTO): Promise<Sprint> => {
    const response = await axiosInstance.post(SPRINT_API_BASE, data);
    return response.data;
  },

  updateSprint: async (id: number, data: SprintDTO): Promise<Sprint> => {
    const response = await axiosInstance.put(`${SPRINT_API_BASE}/${id}`, data);
    return response.data;
  },

  deleteSprint: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${SPRINT_API_BASE}/${id}`);
  },

  getSprintById: async (id: number): Promise<Sprint> => {
    const response = await axiosInstance.get(`${SPRINT_API_BASE}/${id}`);
    return response.data;
  },

  getAllSprints: async (organizationId: number): Promise<Sprint[]> => {
    const response = await axiosInstance.get(SPRINT_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  getSprintsByProject: async (projectId: number): Promise<Sprint[]> => {
    const response = await axiosInstance.get(
      `${SPRINT_API_BASE}/project/${projectId}`,
    );
    return response.data;
  },

  startSprint: async (id: number): Promise<Sprint> => {
    const response = await axiosInstance.put(`${SPRINT_API_BASE}/${id}/start`);
    return response.data;
  },

  completeSprint: async (id: number): Promise<Sprint> => {
    const response = await axiosInstance.put(
      `${SPRINT_API_BASE}/${id}/complete`,
    );
    return response.data;
  },

  getActiveSprints: async (organizationId: number): Promise<Sprint[]> => {
    const response = await axiosInstance.get(`${SPRINT_API_BASE}/active`, {
      params: { organizationId },
    });
    return response.data;
  },
};
