import axiosInstance from "../axiosInstance";
import type {
  ClientDTO,
  CreateClientRequest,
  UpdateClientRequest,
} from "../types/client.types";

const CLIENT_API_BASE = "/client";

export const clientService = {
  // Create a new client
  createClient: async (data: CreateClientRequest): Promise<ClientDTO> => {
    const response = await axiosInstance.post(CLIENT_API_BASE, data);
    return response.data;
  },

  // Update an existing client
  updateClient: async (
    id: number,
    data: UpdateClientRequest,
  ): Promise<ClientDTO> => {
    const response = await axiosInstance.put(`${CLIENT_API_BASE}/${id}`, data);
    return response.data.data;
  },

  // Get client by ID (basic)
  getClientById: async (id: number): Promise<ClientDTO> => {
    const response = await axiosInstance.get(`${CLIENT_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get client with full details (includes documents and representatives)
  getClientDetailed: async (id: number): Promise<ClientDTO> => {
    const response = await axiosInstance.get(
      `${CLIENT_API_BASE}/${id}/detailed`,
    );
    return response.data.data;
  },

  // Get all active clients for an organization
  getAllActiveClients: async (organizationId: number): Promise<ClientDTO[]> => {
    const response = await axiosInstance.get(
      `${CLIENT_API_BASE}/organization/${organizationId}`,
    );
    return response.data;
  },

  // Search clients
  searchClients: async (
    organizationId: number,
    keyword?: string,
  ): Promise<ClientDTO[]> => {
    const response = await axiosInstance.get(`${CLIENT_API_BASE}/search`, {
      params: { organizationId, keyword },
    });
    return response.data.data;
  },

  // Deactivate a client
  deactivateClient: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${CLIENT_API_BASE}/${id}/deactivate`);
  },

  // Activate a client
  activateClient: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${CLIENT_API_BASE}/${id}/activate`);
  },
};

export default clientService;
