import axios from "axios";
import { LeaveTypeDTO, MinimalLeaveTypeDTO } from "../types/leave.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE_URL = `${API_URL}/api/leave-types`;

export const leaveTypeService = {
  // Create a new leave type
  create: async (data: LeaveTypeDTO): Promise<LeaveTypeDTO> => {
    const response = await axios.post<LeaveTypeDTO>(BASE_URL, data);
    return response.data;
  },

  // Update leave type
  update: async (id: number, data: LeaveTypeDTO): Promise<LeaveTypeDTO> => {
    const response = await axios.put<LeaveTypeDTO>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Get by ID
  getById: async (id: number): Promise<LeaveTypeDTO> => {
    const response = await axios.get<LeaveTypeDTO>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get all leave types for an organization
  getAll: async (orgId: number): Promise<LeaveTypeDTO[]> => {
    const response = await axios.get<LeaveTypeDTO[]>(
      `${BASE_URL}/organization/${orgId}`,
    );
    return response.data;
  },

  // Get minimal leave types for an organization
  getAllMinimal: async (orgId: number): Promise<MinimalLeaveTypeDTO[]> => {
    const response = await axios.get<MinimalLeaveTypeDTO[]>(
      `${BASE_URL}/minimal/${orgId}`,
    );
    return response.data;
  },

  // Delete leave type
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
