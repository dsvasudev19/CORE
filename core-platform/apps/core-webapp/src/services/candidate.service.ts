import axios from "axios";
import { Candidate, CandidateDTO } from "../types/candidate.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/candidate`,
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

export const candidateService = {
  createCandidate: async (data: CandidateDTO): Promise<Candidate> => {
    const response = await api.post("", data);
    return response.data;
  },

  updateCandidate: async (
    id: number,
    data: CandidateDTO,
  ): Promise<Candidate> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteCandidate: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getCandidateById: async (id: number): Promise<Candidate> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  getAllCandidates: async (organizationId: number): Promise<Candidate[]> => {
    const response = await api.get("", { params: { organizationId } });
    return response.data;
  },

  getCandidatesByJobPosting: async (
    jobPostingId: number,
  ): Promise<Candidate[]> => {
    const response = await api.get(`/job/${jobPostingId}`);
    return response.data;
  },

  changeStatus: async (id: number, status: string): Promise<Candidate> => {
    const response = await api.put(`/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  changeStage: async (id: number, stage: string): Promise<Candidate> => {
    const response = await api.put(`/${id}/stage`, null, { params: { stage } });
    return response.data;
  },

  scheduleInterview: async (
    id: number,
    interviewDate: string,
  ): Promise<Candidate> => {
    const response = await api.put(`/${id}/schedule-interview`, null, {
      params: { interviewDate },
    });
    return response.data;
  },

  rateCandidate: async (id: number, rating: number): Promise<Candidate> => {
    const response = await api.put(`/${id}/rate`, null, { params: { rating } });
    return response.data;
  },

  shortlistCandidate: async (id: number): Promise<Candidate> => {
    const response = await api.put(`/${id}/shortlist`);
    return response.data;
  },

  rejectCandidate: async (id: number): Promise<Candidate> => {
    const response = await api.put(`/${id}/reject`);
    return response.data;
  },

  hireCandidate: async (id: number): Promise<Candidate> => {
    const response = await api.put(`/${id}/hire`);
    return response.data;
  },
};
