import axiosInstance from "../axiosInstance";
import type { LeaveTypeDTO, MinimalLeaveTypeDTO } from "../types/leave.types";

const LEAVE_TYPES_API_BASE = "/leave-types";

export const leaveTypeService = {
  // Create a new leave type
  create: async (data: LeaveTypeDTO): Promise<LeaveTypeDTO> => {
    const response = await axiosInstance.post<LeaveTypeDTO>(
      LEAVE_TYPES_API_BASE,
      data,
    );
    return response.data;
  },

  // Update leave type
  update: async (id: number, data: LeaveTypeDTO): Promise<LeaveTypeDTO> => {
    const response = await axiosInstance.put<LeaveTypeDTO>(
      `${LEAVE_TYPES_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  // Get by ID
  getById: async (id: number): Promise<LeaveTypeDTO> => {
    const response = await axiosInstance.get<LeaveTypeDTO>(
      `${LEAVE_TYPES_API_BASE}/${id}`,
    );
    return response.data;
  },

  // Get all leave types for an organization
  getAll: async (orgId: number): Promise<LeaveTypeDTO[]> => {
    const response = await axiosInstance.get<LeaveTypeDTO[]>(
      `${LEAVE_TYPES_API_BASE}/organization/${orgId}`,
    );
    return response.data;
  },

  // Get minimal leave types for an organization
  getAllMinimal: async (orgId: number): Promise<MinimalLeaveTypeDTO[]> => {
    const response = await axiosInstance.get<MinimalLeaveTypeDTO[]>(
      `${LEAVE_TYPES_API_BASE}/minimal/${orgId}`,
    );
    return response.data;
  },

  // Delete leave type
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${LEAVE_TYPES_API_BASE}/${id}`);
  },
};
