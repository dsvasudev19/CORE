import axiosInstance from '../axiosInstance';

const PROJECT_FILE_API_BASE = '/projects/files';

export interface ProjectFileDTO {
    id: number;
    projectId: number;
    fileName: string;
    originalFileName: string;
    fileSize: number;
    fileType: string;
    filePath: string;
    description?: string;
    visibility: 'INTERNAL' | 'EXTERNAL';
    uploadedBy: number;
    uploadedByName?: string;
    uploadedAt: string;
}

export const projectFileService = {
    // Upload file to project
    uploadFile: async (
        projectId: number,
        file: File,
        description?: string,
        visibility: 'INTERNAL' | 'EXTERNAL' = 'INTERNAL'
    ): Promise<ProjectFileDTO> => {
        const formData = new FormData();
        formData.append('file', file);
        if (description) {
            formData.append('description', description);
        }
        formData.append('visibility', visibility);

        const response = await axiosInstance.post(
            `${PROJECT_FILE_API_BASE}/${projectId}/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    // Get all files for a project
    getFilesByProject: async (projectId: number): Promise<ProjectFileDTO[]> => {
        const response = await axiosInstance.get(`${PROJECT_FILE_API_BASE}/project/${projectId}`);
        return response.data.data;
    },

    // Get file by ID
    getFileById: async (id: number): Promise<ProjectFileDTO> => {
        const response = await axiosInstance.get(`${PROJECT_FILE_API_BASE}/${id}`);
        return response.data.data;
    },

    // Delete file
    deleteFile: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${PROJECT_FILE_API_BASE}/${id}`);
    },

    // Get download URL
    getDownloadUrl: async (id: number): Promise<string> => {
        const response = await axiosInstance.get(`${PROJECT_FILE_API_BASE}/${id}/download-url`);
        return response.data.data;
    }
};

export default projectFileService;
