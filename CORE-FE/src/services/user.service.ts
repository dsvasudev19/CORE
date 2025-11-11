import axiosInstance from '../axiosInstance';
import { type UserDTO, type UserSearchParams, type PageResponse } from '../types/user.types';

const USER_API_BASE = '/users';

export const userService = {
  // Create a new user
  createUser: async (userData: UserDTO): Promise<UserDTO> => {
    const response = await axiosInstance.post(USER_API_BASE, userData);
    return response.data.data;
  },

  // Update an existing user
  updateUser: async (id: number, userData: UserDTO): Promise<UserDTO> => {
    const response = await axiosInstance.put(`${USER_API_BASE}/${id}`, userData);
    return response.data.data;
  },

  // Delete a user
  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${USER_API_BASE}/${id}`);
  },

  // Get user by ID
  getUserById: async (id: number): Promise<UserDTO> => {
    const response = await axiosInstance.get(`${USER_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all users by organization
  getAllUsers: async (organizationId: number): Promise<UserDTO[]> => {
    const response = await axiosInstance.get(USER_API_BASE, {
      params: { organizationId }
    });
    return response.data.data;
  },

  // Search users with pagination
  searchUsers: async (params: UserSearchParams): Promise<PageResponse<UserDTO>> => {
    const response = await axiosInstance.get(`${USER_API_BASE}/search`, {
      params: {
        organizationId: params.organizationId,
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || 'username,asc'
      }
    });
    return response.data.data;
  }
};
