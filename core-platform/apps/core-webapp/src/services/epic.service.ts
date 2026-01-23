import axiosInstance from "../axiosInstance";
import type { Epic, EpicDTO } from "../types/epic.types";

const EPIC_API_BASE = "/epic";

export const epicService = {
  createEpic: async (data: EpicDTO): Promise<Epic> => {
    const response = await axiosInstance.post(EPIC_API_BASE, data);
    return response.data;
  },

  updateEpic: async (id: number, data: EpicDTO): Promise<Epic> => {
    const response = await axiosInstance.put(`${EPIC_API_BASE}/${id}`, data);
    return response.data;
  },

  deleteEpic: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${EPIC_API_BASE}/${id}`);
  },

  getEpicById: async (id: number): Promise<Epic> => {
    const response = await axiosInstance.get(`${EPIC_API_BASE}/${id}`);
    return response.data;
  },

  getAllEpics: async (organizationId: number): Promise<Epic[]> => {
    const response = await axiosInstance.get(EPIC_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  getEpicsByProject: async (projectId: number): Promise<Epic[]> => {
    const response = await axiosInstance.get(
      `${EPIC_API_BASE}/project/${projectId}`,
    );
    return response.data;
  },

  getEpicByKey: async (key: string): Promise<Epic> => {
    const response = await axiosInstance.get(`${EPIC_API_BASE}/key/${key}`);
    return response.data;
  },
};
