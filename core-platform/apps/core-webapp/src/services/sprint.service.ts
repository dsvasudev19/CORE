import axios from "axios";
import { Sprint, SprintDTO } from "../types/sprint.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/sprint`,
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

export const sprintService = {
  createSprint: async (data: SprintDTO): Promise<Sprint> => {
    const response = await api.post("", data);
    return response.data;
  },

  updateSprint: async (id: number, data: SprintDTO): Promise<Sprint> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteSprint: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getSprintById: async (id: number): Promise<Sprint> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  getAllSprints: async (organizationId: number): Promise<Sprint[]> => {
    const response = await api.get("", { params: { organizationId } });
    return response.data;
  },

  getSprintsByProject: async (projectId: number): Promise<Sprint[]> => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
  },

  startSprint: async (id: number): Promise<Sprint> => {
    const response = await api.put(`/${id}/start`);
    return response.data;
  },

  completeSprint: async (id: number): Promise<Sprint> => {
    const response = await api.put(`/${id}/complete`);
    return response.data;
  },

  getActiveSprints: async (organizationId: number): Promise<Sprint[]> => {
    const response = await api.get("/active", { params: { organizationId } });
    return response.data;
  },
};
