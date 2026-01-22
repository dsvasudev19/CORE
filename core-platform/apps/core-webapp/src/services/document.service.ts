import axiosInstance from '../axiosInstance';
import type { DocumentDTO, UploadDocumentRequest, UpdateDocumentRequest } from '../types/document.types';

const DOCUMENT_API_BASE = '/documents';

export const documentService = {
  // Upload a document
  uploadDocument: async (data: UploadDocumentRequest): Promise<DocumentDTO> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('organizationId', data.organizationId.toString());
    formData.append('entityType', data.entityType);
    formData.append('entityId', data.entityId.toString());
    
    if (data.title) formData.append('title', data.title);
    if (data.category) formData.append('category', data.category);
    if (data.visibility) formData.append('visibility', data.visibility);
    if (data.description) formData.append('description', data.description);

    const response = await axiosInstance.post(DOCUMENT_API_BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  // Update document metadata
  updateDocument: async (id: number, data: UpdateDocumentRequest): Promise<DocumentDTO> => {
    const response = await axiosInstance.put(`${DOCUMENT_API_BASE}/${id}`, data);
    return response.data.data;
  },

  // Activate a document
  activateDocument: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${DOCUMENT_API_BASE}/${id}/activate`);
  },

  // Deactivate a document
  deactivateDocument: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${DOCUMENT_API_BASE}/${id}/deactivate`);
  },

  // Get document by ID
  getDocumentById: async (id: number): Promise<DocumentDTO> => {
    const response = await axiosInstance.get(`${DOCUMENT_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get documents by entity (e.g., all documents for a project)
  getDocumentsByEntity: async (entityType: string, entityId: number): Promise<DocumentDTO[]> => {
    const response = await axiosInstance.get(`${DOCUMENT_API_BASE}/entity`, {
      params: { entityType, entityId }
    });
    return response.data.data;
  },

  // Get all documents for an organization
  getAllDocuments: async (organizationId: number): Promise<DocumentDTO[]> => {
    const response = await axiosInstance.get(`${DOCUMENT_API_BASE}/organization/${organizationId}`);
    return response.data.data;
  },

  // Get documents by category
  getDocumentsByCategory: async (organizationId: number, category: string): Promise<DocumentDTO[]> => {
    const response = await axiosInstance.get(`${DOCUMENT_API_BASE}/category/${category}`, {
      params: { organizationId }
    });
    return response.data.data;
  },

  // Search documents
  searchDocuments: async (organizationId: number, keyword?: string): Promise<DocumentDTO[]> => {
    const response = await axiosInstance.get(`${DOCUMENT_API_BASE}/search`, {
      params: { organizationId, keyword }
    });
    return response.data.data;
  }
};

export default documentService;
