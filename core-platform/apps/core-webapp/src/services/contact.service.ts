import axiosInstance from '../axiosInstance';
import type { ContactDTO, CreateContactRequest, UpdateContactRequest } from '../types/contact.types';

const CONTACT_API_BASE = '/contacts';

export const contactService = {
  // Create a new contact
  createContact: async (data: CreateContactRequest): Promise<ContactDTO> => {
    const response = await axiosInstance.post(CONTACT_API_BASE, data);
    return response.data.data;
  },

  // Update an existing contact
  updateContact: async (id: number, data: UpdateContactRequest): Promise<ContactDTO> => {
    const response = await axiosInstance.put(`${CONTACT_API_BASE}/${id}`, data);
    return response.data.data;
  },

  // Activate a contact
  activateContact: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${CONTACT_API_BASE}/${id}/activate`);
  },

  // Deactivate a contact
  deactivateContact: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${CONTACT_API_BASE}/${id}/deactivate`);
  },

  // Get contact by ID
  getContactById: async (id: number): Promise<ContactDTO> => {
    const response = await axiosInstance.get(`${CONTACT_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all active contacts for an organization
  getAllActiveContacts: async (organizationId: number): Promise<ContactDTO[]> => {
    const response = await axiosInstance.get(`${CONTACT_API_BASE}/organization/${organizationId}`);
    return response.data.data;
  },

  // Search contacts
  searchContacts: async (organizationId: number, keyword?: string): Promise<ContactDTO[]> => {
    const response = await axiosInstance.get(`${CONTACT_API_BASE}/search`, {
      params: { organizationId, keyword }
    });
    return response.data.data;
  },

  // Get contacts by type
  getContactsByType: async (organizationId: number, type: string): Promise<ContactDTO[]> => {
    const response = await axiosInstance.get(`${CONTACT_API_BASE}/type/${type}`, {
      params: { organizationId }
    });
    return response.data.data;
  }
};

export default contactService;
