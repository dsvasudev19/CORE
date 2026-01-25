import axiosInstance from "../axiosInstance";
import type {
  LeaveType,
  LeaveTypeDTO,
  MinimalLeaveType,
} from "../types/leaveType.types";

const LEAVE_TYPE_API_BASE = "/leave-types";

export const leaveTypeService = {
  createLeaveType: async (data: LeaveTypeDTO): Promise<LeaveType> => {
    const response = await axiosInstance.post(LEAVE_TYPE_API_BASE, data);
    return response.data;
  },

  updateLeaveType: async (
    id: number,
    data: LeaveTypeDTO,
  ): Promise<LeaveType> => {
    const response = await axiosInstance.put(
      `${LEAVE_TYPE_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  deleteLeaveType: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${LEAVE_TYPE_API_BASE}/${id}`);
  },

  getLeaveTypeById: async (id: number): Promise<LeaveType> => {
    const response = await axiosInstance.get(`${LEAVE_TYPE_API_BASE}/${id}`);
    return response.data;
  },

  getAllLeaveTypes: async (organizationId: number): Promise<LeaveType[]> => {
    const response = await axiosInstance.get(
      `${LEAVE_TYPE_API_BASE}/organization/${organizationId}`,
    );
    return response.data;
  },

  getAllMinimalLeaveTypes: async (
    organizationId: number,
  ): Promise<MinimalLeaveType[]> => {
    const response = await axiosInstance.get(
      `${LEAVE_TYPE_API_BASE}/minimal/${organizationId}`,
    );
    return response.data;
  },
};
