import axiosInstance from "../axiosInstance";
import type {
  DesignationDTO,
  CreateDesignationRequest,
  UpdateDesignationRequest,
} from "../types/designation.types";

const DESIGNATION_API_BASE = "/designation";

export const designationService = {
  // Create a new designation
  createDesignation: async (
    data: CreateDesignationRequest,
  ): Promise<DesignationDTO> => {
    const response = await axiosInstance.post(DESIGNATION_API_BASE, data);
    return response.data.data;
  },

  // Update an existing designation
  updateDesignation: async (
    id: number,
    data: UpdateDesignationRequest,
  ): Promise<DesignationDTO> => {
    const response = await axiosInstance.put(
      `${DESIGNATION_API_BASE}/${id}`,
      data,
    );
    return response.data.data;
  },

  // Delete a designation
  deleteDesignation: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${DESIGNATION_API_BASE}/${id}`);
  },

  // Get designation by ID
  getDesignationById: async (id: number): Promise<DesignationDTO> => {
    const response = await axiosInstance.get(`${DESIGNATION_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all designations for an organization
  getAllDesignations: async (
    organizationId: number,
  ): Promise<DesignationDTO[]> => {
    const response = await axiosInstance.get(DESIGNATION_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },
};

export default designationService;
