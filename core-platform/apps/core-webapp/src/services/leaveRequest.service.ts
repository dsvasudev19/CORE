import axiosInstance from "../axiosInstance";
import type { LeaveRequestDTO, MinimalLeaveRequestDTO } from "../types/leave.types";

const LEAVE_REQUESTS_API_BASE = "/leave-requests";

export const leaveRequestService = {
  // Create a new leave request
  create: async (data: LeaveRequestDTO): Promise<LeaveRequestDTO> => {
    const response = await axiosInstance.post<LeaveRequestDTO>(LEAVE_REQUESTS_API_BASE, data);
    return response.data;
  },

  // Update leave request
  update: async (
    id: number,
    data: LeaveRequestDTO,
  ): Promise<LeaveRequestDTO> => {
    const response = await axiosInstance.put<LeaveRequestDTO>(
      `${LEAVE_REQUESTS_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  // Get by ID
  getById: async (id: number): Promise<LeaveRequestDTO> => {
    const response = await axiosInstance.get<LeaveRequestDTO>(`${LEAVE_REQUESTS_API_BASE}/${id}`);
    return response.data;
  },

  // Get all requests for an employee
  getEmployeeRequests: async (
    employeeId: number,
  ): Promise<LeaveRequestDTO[]> => {
    const response = await axiosInstance.get<LeaveRequestDTO[]>(
      `${LEAVE_REQUESTS_API_BASE}/employee/${employeeId}`,
    );
    return response.data;
  },

  // Get minimal employee requests
  getEmployeeRequestsMinimal: async (
    employeeId: number,
  ): Promise<MinimalLeaveRequestDTO[]> => {
    const response = await axiosInstance.get<MinimalLeaveRequestDTO[]>(
      `${LEAVE_REQUESTS_API_BASE}/employee/${employeeId}/minimal`,
    );
    return response.data;
  },

  // Get pending approvals for a manager
  getManagerPendingApprovals: async (
    managerId: number,
  ): Promise<LeaveRequestDTO[]> => {
    const response = await axiosInstance.get<LeaveRequestDTO[]>(
      `${LEAVE_REQUESTS_API_BASE}/manager/${managerId}/pending`,
    );
    return response.data;
  },

  // Approve a leave request
  approve: async (
    requestId: number,
    managerId: number,
    comment?: string,
  ): Promise<LeaveRequestDTO> => {
    const params = new URLSearchParams({ managerId: managerId.toString() });
    if (comment) {
      params.append("comment", comment);
    }
    const response = await axiosInstance.post<LeaveRequestDTO>(
      `${LEAVE_REQUESTS_API_BASE}/${requestId}/approve?${params.toString()}`,
    );
    return response.data;
  },

  // Reject a leave request
  reject: async (
    requestId: number,
    managerId: number,
    comment?: string,
  ): Promise<LeaveRequestDTO> => {
    const params = new URLSearchParams({ managerId: managerId.toString() });
    if (comment) {
      params.append("comment", comment);
    }
    const response = await axiosInstance.post<LeaveRequestDTO>(
      `${LEAVE_REQUESTS_API_BASE}/${requestId}/reject?${params.toString()}`,
    );
    return response.data;
  },

  // Cancel a leave request
  cancel: async (requestId: number): Promise<LeaveRequestDTO> => {
    const response = await axiosInstance.post<LeaveRequestDTO>(
      `${LEAVE_REQUESTS_API_BASE}/${requestId}/cancel`,
    );
    return response.data;
  },
};
