import axiosInstance from "../axiosInstance";
import type {
  OrganizationDTO,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationPageResponse,
} from "../types/organization.types";

const ORGANIZATION_API_BASE = "/organizations";

export const organizationService = {
  // Create a new organization
  createOrganization: async (
    data: CreateOrganizationRequest,
  ): Promise<OrganizationDTO> => {
    const response = await axiosInstance.post(ORGANIZATION_API_BASE, data);
    return response.data.data;
  },

  // Update an existing organization
  updateOrganization: async (
    id: number,
    data: UpdateOrganizationRequest,
  ): Promise<OrganizationDTO> => {
    const response = await axiosInstance.put(
      `${ORGANIZATION_API_BASE}/${id}`,
      data,
    );
    return response.data.data;
  },

  // Delete an organization
  deleteOrganization: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${ORGANIZATION_API_BASE}/${id}`);
  },

  // Get organization by ID
  getOrganizationById: async (id: number): Promise<OrganizationDTO> => {
    const response = await axiosInstance.get(`${ORGANIZATION_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get organization by code
  getByCode: async (code: string): Promise<OrganizationDTO | null> => {
    const response = await axiosInstance.get(
      `${ORGANIZATION_API_BASE}/code/${code}`,
    );
    return response.data.data;
  },

  // Get organization by domain
  getByDomain: async (domain: string): Promise<OrganizationDTO | null> => {
    const response = await axiosInstance.get(
      `${ORGANIZATION_API_BASE}/domain/${domain}`,
    );
    return response.data.data;
  },

  // Search organizations with pagination
  searchOrganizations: async (
    keyword?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<OrganizationPageResponse> => {
    const response = await axiosInstance.get(
      `${ORGANIZATION_API_BASE}/search`,
      {
        params: {
          keyword,
          page,
          size,
          sort: "name,asc",
        },
      },
    );
    return response.data.data;
  },
};

export default organizationService;
