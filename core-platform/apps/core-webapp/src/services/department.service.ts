import axiosInstance from "../axiosInstance";
import type {
  DepartmentDTO,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/department.types";

const DEPARTMENT_API_BASE = "/department";

export const departmentService = {
  // Create a new department
  createDepartment: async (
    data: CreateDepartmentRequest,
  ): Promise<DepartmentDTO> => {
    const response = await axiosInstance.post(DEPARTMENT_API_BASE, data);
    return response.data.data;
  },

  // Update an existing department
  updateDepartment: async (
    id: number,
    data: UpdateDepartmentRequest,
  ): Promise<DepartmentDTO> => {
    const response = await axiosInstance.put(
      `${DEPARTMENT_API_BASE}/${id}`,
      data,
    );
    return response.data.data;
  },

  // Delete a department
  deleteDepartment: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${DEPARTMENT_API_BASE}/${id}`);
  },

  // Get department by ID
  getDepartmentById: async (id: number): Promise<DepartmentDTO> => {
    const response = await axiosInstance.get(`${DEPARTMENT_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all departments for an organization
  getAllDepartments: async (
    organizationId: number,
  ): Promise<DepartmentDTO[]> => {
    const response = await axiosInstance.get(DEPARTMENT_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  // Get employee count for a department
  getEmployeeCount: async (id: number): Promise<number> => {
    const response = await axiosInstance.get(
      `${DEPARTMENT_API_BASE}/${id}/employees/count`,
    );
    return response.data.data;
  },

  // Get team count for a department
  getTeamCount: async (id: number): Promise<number> => {
    const response = await axiosInstance.get(
      `${DEPARTMENT_API_BASE}/${id}/teams/count`,
    );
    return response.data.data;
  },
};

export default departmentService;
