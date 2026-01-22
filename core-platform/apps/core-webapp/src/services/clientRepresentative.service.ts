import axiosInstance from '../axiosInstance';
import type { ClientRepresentativeDTO } from '../types/client.types';

const CLIENT_REP_API_BASE = '/client-representatives';

export const clientRepresentativeService = {
  // Add a representative
  addRepresentative: async (data: Omit<ClientRepresentativeDTO, 'id'>): Promise<ClientRepresentativeDTO> => {
    const response = await axiosInstance.post(CLIENT_REP_API_BASE, data);
    return response.data.data;
  },

  // Update a representative
  updateRepresentative: async (
    id: number,
    data: Partial<ClientRepresentativeDTO>
  ): Promise<ClientRepresentativeDTO> => {
    const response = await axiosInstance.put(`${CLIENT_REP_API_BASE}/${id}`, data);
    return response.data.data;
  },

  // Activate a representative
  activateRepresentative: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${CLIENT_REP_API_BASE}/${id}/activate`);
  },

  // Deactivate a representative
  deactivateRepresentative: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${CLIENT_REP_API_BASE}/${id}/deactivate`);
  },

  // Get representative by ID
  getRepresentativeById: async (id: number): Promise<ClientRepresentativeDTO> => {
    const response = await axiosInstance.get(`${CLIENT_REP_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all representatives for a client
  getRepresentativesByClient: async (clientId: number): Promise<ClientRepresentativeDTO[]> => {
    const response = await axiosInstance.get(`${CLIENT_REP_API_BASE}/client/${clientId}`);
    return response.data.data;
  },

  // Get all representatives for an organization
  getAllRepresentatives: async (organizationId: number): Promise<ClientRepresentativeDTO[]> => {
    const response = await axiosInstance.get(`${CLIENT_REP_API_BASE}/organization/${organizationId}`);
    return response.data.data;
  },

  // Get primary representative for a client
  getPrimaryRepresentative: async (clientId: number): Promise<ClientRepresentativeDTO> => {
    const response = await axiosInstance.get(`${CLIENT_REP_API_BASE}/client/${clientId}/primary`);
    return response.data.data;
  },

  // Check if contact is linked to client
  isContactLinked: async (clientId: number, contactId: number): Promise<boolean> => {
    const response = await axiosInstance.get(`${CLIENT_REP_API_BASE}/exists`, {
      params: { clientId, contactId }
    });
    return response.data.data;
  }
};

export default clientRepresentativeService;
