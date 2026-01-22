import axios from "axios";
import { Issue, IssueDTO } from "../types/issue.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/issue`,
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

export const issueService = {
  createIssue: async (data: IssueDTO): Promise<Issue> => {
    const response = await api.post("", data);
    return response.data;
  },

  updateIssue: async (id: number, data: IssueDTO): Promise<Issue> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteIssue: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getIssueById: async (id: number): Promise<Issue> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  getAllIssues: async (organizationId: number): Promise<Issue[]> => {
    const response = await api.get("", { params: { organizationId } });
    return response.data;
  },

  getIssuesByProject: async (projectId: number): Promise<Issue[]> => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
  },

  getIssuesBySprint: async (sprintId: number): Promise<Issue[]> => {
    const response = await api.get(`/sprint/${sprintId}`);
    return response.data;
  },

  getIssuesByEpic: async (epicId: number): Promise<Issue[]> => {
    const response = await api.get(`/epic/${epicId}`);
    return response.data;
  },

  getBacklogIssues: async (organizationId: number): Promise<Issue[]> => {
    const response = await api.get("/backlog", { params: { organizationId } });
    return response.data;
  },

  moveToSprint: async (id: number, sprintId: number): Promise<Issue> => {
    const response = await api.put(`/${id}/move-to-sprint/${sprintId}`);
    return response.data;
  },

  moveToBacklog: async (id: number): Promise<Issue> => {
    const response = await api.put(`/${id}/move-to-backlog`);
    return response.data;
  },

  assignIssue: async (id: number, employeeId: number): Promise<Issue> => {
    const response = await api.put(`/${id}/assign/${employeeId}`);
    return response.data;
  },

  changeStatus: async (id: number, status: string): Promise<Issue> => {
    const response = await api.put(`/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};
