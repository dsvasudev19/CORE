import axiosInstance from "../axiosInstance";
import type { Candidate, CandidateDTO } from "../types/candidate.types";

const CANDIDATE_API_BASE = "/candidate";

export const candidateService = {
  createCandidate: async (data: CandidateDTO): Promise<Candidate> => {
    const response = await axiosInstance.post(CANDIDATE_API_BASE, data);
    return response.data;
  },

  updateCandidate: async (
    id: number,
    data: CandidateDTO,
  ): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  deleteCandidate: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${CANDIDATE_API_BASE}/${id}`);
  },

  getCandidateById: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`${CANDIDATE_API_BASE}/${id}`);
    return response.data;
  },

  getAllCandidates: async (organizationId: number): Promise<Candidate[]> => {
    const response = await axiosInstance.get(CANDIDATE_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  getCandidatesByJobPosting: async (
    jobPostingId: number,
  ): Promise<Candidate[]> => {
    const response = await axiosInstance.get(
      `${CANDIDATE_API_BASE}/job/${jobPostingId}`,
    );
    return response.data;
  },

  changeStatus: async (id: number, status: string): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/status`,
      null,
      {
        params: { status },
      },
    );
    return response.data;
  },

  changeStage: async (id: number, stage: string): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/stage`,
      null,
      { params: { stage } },
    );
    return response.data;
  },

  scheduleInterview: async (
    id: number,
    interviewDate: string,
  ): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/schedule-interview`,
      null,
      {
        params: { interviewDate },
      },
    );
    return response.data;
  },

  rateCandidate: async (id: number, rating: number): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/rate`,
      null,
      { params: { rating } },
    );
    return response.data;
  },

  shortlistCandidate: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/shortlist`,
    );
    return response.data;
  },

  rejectCandidate: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/reject`,
    );
    return response.data;
  },

  hireCandidate: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.put(
      `${CANDIDATE_API_BASE}/${id}/hire`,
    );
    return response.data;
  },
};
