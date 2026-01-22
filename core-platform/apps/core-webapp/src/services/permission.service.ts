import axiosInstance from "../axiosInstance";
import {
  type PermissionDTO,
  type PermissionSearchParams,
  type PageResponse,
} from "../types/permission.types";

const PERMISSION_API_BASE = "/permissions";

export const permissionService = {
  // Create a new permission
  createPermission: async (
    permissionData: PermissionDTO
  ): Promise<PermissionDTO> => {
    const response = await axiosInstance.post(
      PERMISSION_API_BASE,
      permissionData
    );
    return response.data.data;
  },

  // Delete a permission
  deletePermission: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${PERMISSION_API_BASE}/${id}`);
  },

  // Get all permissions by organization
  getPermissionsByOrganization: async (
    organizationId: number
  ): Promise<PermissionDTO[]> => {
    const response = await axiosInstance.get(PERMISSION_API_BASE, {
      params: { organizationId },
    });
    return response.data.data;
  },

  // Search permissions with pagination
  searchPermissions: async (
    params: PermissionSearchParams
  ): Promise<PageResponse<PermissionDTO>> => {
    const response = await axiosInstance.get(`${PERMISSION_API_BASE}/search`, {
      params: {
        organizationId: params.organizationId,
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || "id,desc",
      },
    });
    return response.data.data;
  },
};
