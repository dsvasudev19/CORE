import axiosInstance from "../axiosInstance";
import {
  type ResourceDTO,
  type ResourceSearchParams,
  type PageResponse,
} from "../types/resource.types";

const RESOURCE_API_BASE = "/resources";

export const resourceService = {
  // Create a new resource
  createResource: async (resourceData: ResourceDTO): Promise<ResourceDTO> => {
    const response = await axiosInstance.post(RESOURCE_API_BASE, resourceData);
    return response.data.data;
  },

  // Update an existing resource
  updateResource: async (
    id: number,
    resourceData: ResourceDTO
  ): Promise<ResourceDTO> => {
    const response = await axiosInstance.put(
      `${RESOURCE_API_BASE}/${id}`,
      resourceData
    );
    return response.data.data;
  },

  // Delete a resource
  deleteResource: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${RESOURCE_API_BASE}/${id}`);
  },

  // Get resource by ID
  getResourceById: async (id: number): Promise<ResourceDTO> => {
    const response = await axiosInstance.get(`${RESOURCE_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all resources by organization
  getResourcesByOrganization: async (
    organizationId: number
  ): Promise<ResourceDTO[]> => {
    const response = await axiosInstance.get(RESOURCE_API_BASE, {
      params: { organizationId },
    });
    return response.data.data;
  },

  // Search resources with pagination
  searchResources: async (
    params: ResourceSearchParams
  ): Promise<PageResponse<ResourceDTO>> => {
    const response = await axiosInstance.get(`${RESOURCE_API_BASE}/search`, {
      params: {
        organizationId: params.organizationId,
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || "name,asc",
      },
    });
    return response.data.data;
  },
};
