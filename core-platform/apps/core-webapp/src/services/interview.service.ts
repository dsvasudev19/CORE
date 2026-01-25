import axiosInstance from "../axiosInstance";
import type { Interview, InterviewDTO } from "../types/interview.types";

const INTERVIEW_API_BASE = "/interview";

export const interviewService = {
  createInterview: async (data: InterviewDTO): Promise<Interview> => {
    const response = await axiosInstance.post(INTERVIEW_API_BASE, data);
    return response.data;
  },

  updateInterview: async (
    id: number,
    data: InterviewDTO,
  ): Promise<Interview> => {
    const response = await axiosInstance.put(
      `${INTERVIEW_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  deleteInterview: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${INTERVIEW_API_BASE}/${id}`);
  },

  getInterviewById: async (id: number): Promise<Interview> => {
    const response = await axiosInstance.get(`${INTERVIEW_API_BASE}/${id}`);
    return response.data;
  },

  getAllInterviews: async (organizationId: number): Promise<Interview[]> => {
    const response = await axiosInstance.get(INTERVIEW_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  getInterviewsByCandidate: async (
    candidateId: number,
  ): Promise<Interview[]> => {
    const response = await axiosInstance.get(
      `${INTERVIEW_API_BASE}/candidate/${candidateId}`,
    );
    return response.data;
  },

  getInterviewsByInterviewer: async (
    interviewerId: number,
  ): Promise<Interview[]> => {
    const response = await axiosInstance.get(
      `${INTERVIEW_API_BASE}/interviewer/${interviewerId}`,
    );
    return response.data;
  },

  getInterviewsByStatus: async (
    organizationId: number,
    status: string,
  ): Promise<Interview[]> => {
    const response = await axiosInstance.get(`${INTERVIEW_API_BASE}/status`, {
      params: { organizationId, status },
    });
    return response.data;
  },

  getInterviewsByDateRange: async (
    organizationId: number,
    startDate: string,
    endDate: string,
  ): Promise<Interview[]> => {
    const response = await axiosInstance.get(
      `${INTERVIEW_API_BASE}/date-range`,
      {
        params: { organizationId, startDate, endDate },
      },
    );
    return response.data;
  },

  getInterviewerSchedule: async (
    interviewerId: number,
    startDate: string,
    endDate: string,
  ): Promise<Interview[]> => {
    const response = await axiosInstance.get(
      `${INTERVIEW_API_BASE}/interviewer/${interviewerId}/schedule`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },

  updateInterviewStatus: async (
    id: number,
    status: string,
  ): Promise<Interview> => {
    const response = await axiosInstance.put(
      `${INTERVIEW_API_BASE}/${id}/status`,
      null,
      {
        params: { status },
      },
    );
    return response.data;
  },

  completeInterview: async (
    id: number,
    feedback?: string,
    rating?: number,
    result?: string,
  ): Promise<Interview> => {
    const response = await axiosInstance.put(
      `${INTERVIEW_API_BASE}/${id}/complete`,
      null,
      {
        params: { feedback, rating, result },
      },
    );
    return response.data;
  },

  rescheduleInterview: async (
    id: number,
    newDateTime: string,
  ): Promise<Interview> => {
    const response = await axiosInstance.put(
      `${INTERVIEW_API_BASE}/${id}/reschedule`,
      null,
      {
        params: { newDateTime },
      },
    );
    return response.data;
  },
};
