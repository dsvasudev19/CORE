import axiosInstance from "../axiosInstance";
import type { JobPosting, JobPostingDTO } from "../types/jobPosting.types";

const JOB_POSTING_API_BASE = "/job-posting";

export const jobPostingService = {
  createJobPosting: async (data: JobPostingDTO): Promise<JobPosting> => {
    const response = await axiosInstance.post(JOB_POSTING_API_BASE, data);
    return response.data;
  },

  updateJobPosting: async (
    id: number,
    data: JobPostingDTO,
  ): Promise<JobPosting> => {
    const response = await axiosInstance.put(
      `${JOB_POSTING_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  deleteJobPosting: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${JOB_POSTING_API_BASE}/${id}`);
  },

  getJobPostingById: async (id: number): Promise<JobPosting> => {
    const response = await axiosInstance.get(`${JOB_POSTING_API_BASE}/${id}`);
    return response.data;
  },

  getAllJobPostings: async (organizationId: number): Promise<JobPosting[]> => {
    const response = await axiosInstance.get(JOB_POSTING_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  getActiveJobPostings: async (
    organizationId: number,
  ): Promise<JobPosting[]> => {
    const response = await axiosInstance.get(`${JOB_POSTING_API_BASE}/active`, {
      params: { organizationId },
    });
    return response.data;
  },

  getJobPostingsByDepartment: async (
    departmentId: number,
  ): Promise<JobPosting[]> => {
    const response = await axiosInstance.get(
      `${JOB_POSTING_API_BASE}/department/${departmentId}`,
    );
    return response.data;
  },

  publishJobPosting: async (id: number): Promise<JobPosting> => {
    const response = await axiosInstance.put(
      `${JOB_POSTING_API_BASE}/${id}/publish`,
    );
    return response.data;
  },

  closeJobPosting: async (id: number): Promise<JobPosting> => {
    const response = await axiosInstance.put(
      `${JOB_POSTING_API_BASE}/${id}/close`,
    );
    return response.data;
  },
};
