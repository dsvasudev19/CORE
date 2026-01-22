import axiosInstance from "../axiosInstance";
import {
  type ActionDTO,
  type ActionSearchParams,
  type PageResponse,
} from "../types/action.types";

const ACTION_API_BASE = "/actions";

export const actionService = {
  // Create a new action
  createAction: async (actionData: ActionDTO): Promise<ActionDTO> => {
    const response = await axiosInstance.post(ACTION_API_BASE, actionData);
    return response.data.data;
  },

  // Update an existing action
  updateAction: async (
    id: number,
    actionData: ActionDTO
  ): Promise<ActionDTO> => {
    const response = await axiosInstance.put(
      `${ACTION_API_BASE}/${id}`,
      actionData
    );
    return response.data.data;
  },

  // Delete an action
  deleteAction: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${ACTION_API_BASE}/${id}`);
  },

  // Get action by ID
  getActionById: async (id: number): Promise<ActionDTO> => {
    const response = await axiosInstance.get(`${ACTION_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all actions by organization
  getActionsByOrganization: async (
    organizationId: number
  ): Promise<ActionDTO[]> => {
    const response = await axiosInstance.get(ACTION_API_BASE, {
      params: { organizationId },
    });
    return response.data.data;
  },

  // Search actions with pagination
  searchActions: async (
    params: ActionSearchParams
  ): Promise<PageResponse<ActionDTO>> => {
    const response = await axiosInstance.get(`${ACTION_API_BASE}/search`, {
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
