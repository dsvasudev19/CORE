import axiosInstance from "../axiosInstance";
import {
  type RoleDTO,
  type RoleSearchParams,
  type PageResponse,
} from "../types/role.types";

const ROLE_API_BASE = "/roles";

export const roleService = {
  // Create a new role
  createRole: async (roleData: RoleDTO): Promise<RoleDTO> => {
    const response = await axiosInstance.post(ROLE_API_BASE, roleData);
    return response.data.data;
  },

  // Update an existing role
  updateRole: async (id: number, roleData: RoleDTO): Promise<RoleDTO> => {
    const response = await axiosInstance.put(
      `${ROLE_API_BASE}/${id}`,
      roleData
    );
    return response.data.data;
  },

  // Delete a role
  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${ROLE_API_BASE}/${id}`);
  },

  // Get role by ID
  getRoleById: async (id: number): Promise<RoleDTO> => {
    const response = await axiosInstance.get(`${ROLE_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all roles by organization
  getRolesByOrganization: async (
    organizationId: number
  ): Promise<RoleDTO[]> => {
    const response = await axiosInstance.get(ROLE_API_BASE, {
      params: { organizationId },
    });
    return response.data.data;
  },

  // Search roles with pagination
  searchRoles: async (
    params: RoleSearchParams
  ): Promise<PageResponse<RoleDTO>> => {
    const response = await axiosInstance.get(`${ROLE_API_BASE}/search`, {
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

  // Assign permissions to role
  assignPermissionsToRole: async (
    roleId: number,
    permissionIds: number[]
  ): Promise<RoleDTO> => {
    const response = await axiosInstance.patch(
      `${ROLE_API_BASE}/${roleId}/permissions/assign`,
      { permissionIds }
    );
    return response.data.data;
  },
};
