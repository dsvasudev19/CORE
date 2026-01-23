import axiosInstance from "../axiosInstance";
import type { Issue, IssueDTO } from "../types/issue.types";

const ISSUE_API_BASE = "/issue";

export const issueService = {
  createIssue: async (data: IssueDTO): Promise<Issue> => {
    const response = await axiosInstance.post(ISSUE_API_BASE, data);
    return response.data;
  },

  updateIssue: async (id: number, data: IssueDTO): Promise<Issue> => {
    const response = await axiosInstance.put(`${ISSUE_API_BASE}/${id}`, data);
    return response.data;
  },

  deleteIssue: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${ISSUE_API_BASE}/${id}`);
  },

  getIssueById: async (id: number): Promise<Issue> => {
    const response = await axiosInstance.get(`${ISSUE_API_BASE}/${id}`);
    return response.data;
  },

  getAllIssues: async (organizationId: number): Promise<Issue[]> => {
    const response = await axiosInstance.get(ISSUE_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  getIssuesByProject: async (projectId: number): Promise<Issue[]> => {
    const response = await axiosInstance.get(
      `${ISSUE_API_BASE}/project/${projectId}`,
    );
    return response.data;
  },

  getIssuesBySprint: async (sprintId: number): Promise<Issue[]> => {
    const response = await axiosInstance.get(
      `${ISSUE_API_BASE}/sprint/${sprintId}`,
    );
    return response.data;
  },

  getIssuesByEpic: async (epicId: number): Promise<Issue[]> => {
    const response = await axiosInstance.get(
      `${ISSUE_API_BASE}/epic/${epicId}`,
    );
    return response.data;
  },

  getBacklogIssues: async (organizationId: number): Promise<Issue[]> => {
    const response = await axiosInstance.get(`${ISSUE_API_BASE}/backlog`, {
      params: { organizationId },
    });
    return response.data;
  },

  moveToSprint: async (id: number, sprintId: number): Promise<Issue> => {
    const response = await axiosInstance.put(
      `${ISSUE_API_BASE}/${id}/move-to-sprint/${sprintId}`,
    );
    return response.data;
  },

  moveToBacklog: async (id: number): Promise<Issue> => {
    const response = await axiosInstance.put(
      `${ISSUE_API_BASE}/${id}/move-to-backlog`,
    );
    return response.data;
  },

  assignIssue: async (id: number, employeeId: number): Promise<Issue> => {
    const response = await axiosInstance.put(
      `${ISSUE_API_BASE}/${id}/assign/${employeeId}`,
    );
    return response.data;
  },

  changeStatus: async (id: number, status: string): Promise<Issue> => {
    const response = await axiosInstance.put(
      `${ISSUE_API_BASE}/${id}/status`,
      null,
      {
        params: { status },
      },
    );
    return response.data;
  },
};
