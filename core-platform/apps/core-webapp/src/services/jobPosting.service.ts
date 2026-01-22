import axios from "axios";
import { JobPosting, JobPostingDTO } from "../types/jobPosting.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/job-posting`,
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

export const jobPostingService = {
  createJobPosting: async (data: JobPostingDTO): Promise<JobPosting> => {
    const response = await api.post("", data);
    return response.data;
  },

  updateJobPosting: async (
    id: number,
    data: JobPostingDTO,
  ): Promise<JobPosting> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteJobPosting: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getJobPostingById: async (id: number): Promise<JobPosting> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  getAllJobPostings: async (organizationId: number): Promise<JobPosting[]> => {
    const response = await api.get("", { params: { organizationId } });
    return response.data;
  },

  getActiveJobPostings: async (
    organizationId: number,
  ): Promise<JobPosting[]> => {
    const response = await api.get("/active", { params: { organizationId } });
    return response.data;
  },

  getJobPostingsByDepartment: async (
    departmentId: number,
  ): Promise<JobPosting[]> => {
    const response = await api.get(`/department/${departmentId}`);
    return response.data;
  },

  publishJobPosting: async (id: number): Promise<JobPosting> => {
    const response = await api.put(`/${id}/publish`);
    return response.data;
  },

  closeJobPosting: async (id: number): Promise<JobPosting> => {
    const response = await api.put(`/${id}/close`);
    return response.data;
  },
};
