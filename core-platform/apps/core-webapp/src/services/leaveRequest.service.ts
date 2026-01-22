import axios from "axios";
import { LeaveRequestDTO, MinimalLeaveRequestDTO } from "../types/leave.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE_URL = `${API_URL}/api/leave-requests`;

export const leaveRequestService = {
  // Create a new leave request
  create: async (data: LeaveRequestDTO): Promise<LeaveRequestDTO> => {
    const response = await axios.post<LeaveRequestDTO>(BASE_URL, data);
    return response.data;
  },

  // Update leave request
  update: async (
    id: number,
    data: LeaveRequestDTO,
  ): Promise<LeaveRequestDTO> => {
    const response = await axios.put<LeaveRequestDTO>(
      `${BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  // Get by ID
  getById: async (id: number): Promise<LeaveRequestDTO> => {
    const response = await axios.get<LeaveRequestDTO>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get all requests for an employee
  getEmployeeRequests: async (
    employeeId: number,
  ): Promise<LeaveRequestDTO[]> => {
    const response = await axios.get<LeaveRequestDTO[]>(
      `${BASE_URL}/employee/${employeeId}`,
    );
    return response.data;
  },

  // Get minimal employee requests
  getEmployeeRequestsMinimal: async (
    employeeId: number,
  ): Promise<MinimalLeaveRequestDTO[]> => {
    const response = await axios.get<MinimalLeaveRequestDTO[]>(
      `${BASE_URL}/employee/${employeeId}/minimal`,
    );
    return response.data;
  },

  // Get pending approvals for a manager
  getManagerPendingApprovals: async (
    managerId: number,
  ): Promise<LeaveRequestDTO[]> => {
    const response = await axios.get<LeaveRequestDTO[]>(
      `${BASE_URL}/manager/${managerId}/pending`,
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
    const response = await axios.post<LeaveRequestDTO>(
      `${BASE_URL}/${requestId}/approve?${params.toString()}`,
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
    const response = await axios.post<LeaveRequestDTO>(
      `${BASE_URL}/${requestId}/reject?${params.toString()}`,
    );
    return response.data;
  },

  // Cancel a leave request
  cancel: async (requestId: number): Promise<LeaveRequestDTO> => {
    const response = await axios.post<LeaveRequestDTO>(
      `${BASE_URL}/${requestId}/cancel`,
    );
    return response.data;
  },
};
