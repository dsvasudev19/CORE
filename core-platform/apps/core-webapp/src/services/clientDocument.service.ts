import axiosInstance from "../axiosInstance";
import type {
  ClientDocumentDTO,
  UploadClientDocumentRequest,
} from "../types/client.types";

const CLIENT_API_BASE = "/client";

export const clientDocumentService = {
  // Upload a document for a client
  uploadDocument: async (
    clientId: number,
    data: UploadClientDocumentRequest,
  ): Promise<ClientDocumentDTO> => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("title", data.title);
    if (data.category) formData.append("category", data.category);
    if (data.description) formData.append("description", data.description);

    const response = await axiosInstance.post(
      `${CLIENT_API_BASE}/${clientId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  },

  // Download a document
  downloadDocument: async (
    documentId: number,
    fileId: string,
  ): Promise<Blob> => {
    const response = await axiosInstance.get(
      `${CLIENT_API_BASE}/documents/${documentId}/file`,
      {
        params: { fileId },
        responseType: "blob",
      },
    );
    return response.data;
  },

  // Delete a document
  deleteDocument: async (
    clientId: number,
    documentId: number,
  ): Promise<void> => {
    await axiosInstance.delete(
      `${CLIENT_API_BASE}/${clientId}/documents/${documentId}`,
    );
  },

  // Get document URL for download
  getDocumentDownloadUrl: (documentId: number, fileId: string): string => {
    return `${CLIENT_API_BASE}/documents/${documentId}/file?fileId=${fileId}`;
  },
};

export default clientDocumentService;
