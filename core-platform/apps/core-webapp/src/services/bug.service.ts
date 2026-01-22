import axiosInstance from "../axiosInstance";
import type {
  BugDTO,
  BugPageResponse,
  CreateBugRequest,
  UpdateBugRequest,
} from "../types/bug.types";

const BUG_API_BASE = "/bugs";

export const bugService = {
  // CRUD Operations
  createBug: async (data: CreateBugRequest): Promise<BugDTO> => {
    const response = await axiosInstance.post(BUG_API_BASE, data);
    return response.data.data;
  },

  updateBug: async (id: number, data: UpdateBugRequest): Promise<BugDTO> => {
    const response = await axiosInstance.put(`${BUG_API_BASE}/${id}`, data);
    return response.data.data;
  },

  deleteBug: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BUG_API_BASE}/${id}`);
  },

  getBugById: async (
    id: number,
    includeDetails: boolean = false,
  ): Promise<BugDTO> => {
    const response = await axiosInstance.get(`${BUG_API_BASE}/${id}`, {
      params: { includeDetails },
    });
    return response.data.data;
  },

  // Search with pagination
  searchBugs: async (
    organizationId: number,
    keyword?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<BugPageResponse> => {
    const response = await axiosInstance.get(`${BUG_API_BASE}/search`, {
      params: {
        organizationId,
        keyword,
        page,
        size,
        sort: "createdAt,desc",
      },
    });
    return response.data.data;
  },

  // Filters
  getBugsByProject: async (projectId: number): Promise<BugDTO[]> => {
    const response = await axiosInstance.get(
      `${BUG_API_BASE}/project/${projectId}`,
    );
    return response.data.data;
  },

  getBugsByAssignee: async (userId: number): Promise<BugDTO[]> => {
    const response = await axiosInstance.get(
      `${BUG_API_BASE}/assignee/${userId}`,
    );
    return response.data.data;
  },

  // Status Management
  changeStatus: async (id: number, newStatus: string): Promise<BugDTO> => {
    const response = await axiosInstance.put(
      `${BUG_API_BASE}/${id}/status`,
      null,
      {
        params: { newStatus },
      },
    );
    return response.data.data;
  },

  changeSeverity: async (id: number, newSeverity: string): Promise<BugDTO> => {
    const response = await axiosInstance.put(
      `${BUG_API_BASE}/${id}/severity`,
      null,
      {
        params: { newSeverity },
      },
    );
    return response.data.data;
  },

  // Task Linking
  linkToTask: async (id: number, taskId: number): Promise<void> => {
    await axiosInstance.put(`${BUG_API_BASE}/${id}/link-task/${taskId}`);
  },

  unlinkFromTask: async (id: number): Promise<void> => {
    await axiosInstance.put(`${BUG_API_BASE}/${id}/unlink-task`);
  },

  // Close/Reopen
  closeBug: async (id: number): Promise<void> => {
    await axiosInstance.put(`${BUG_API_BASE}/${id}/close`);
  },

  reopenBug: async (id: number): Promise<void> => {
    await axiosInstance.put(`${BUG_API_BASE}/${id}/reopen`);
  },
};

export default bugService;
