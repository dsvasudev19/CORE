import axiosInstance from '../axiosInstance';
import type { TaskAttachmentDTO } from '../types/task.types';

const ATTACHMENT_API_BASE = '/tasks';

export const taskAttachmentService = {
    // --------------------------------------------------------------
    // UPLOAD ATTACHMENT
    // --------------------------------------------------------------
    uploadAttachment: async (
        taskId: number,
        file: File,
        description?: string,
        visibility: string = 'INTERNAL'
    ): Promise<TaskAttachmentDTO> => {
        const formData = new FormData();
        formData.append('file', file);
        if (description) {
            formData.append('description', description);
        }
        formData.append('visibility', visibility);

        const response = await axiosInstance.post(
            `${ATTACHMENT_API_BASE}/${taskId}/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    // --------------------------------------------------------------
    // GET ATTACHMENTS BY TASK
    // --------------------------------------------------------------
    getAttachmentsByTask: async (taskId: number): Promise<TaskAttachmentDTO[]> => {
        const response = await axiosInstance.get(`${ATTACHMENT_API_BASE}/${taskId}/attachments`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // DELETE ATTACHMENT
    // --------------------------------------------------------------
    deleteAttachment: async (taskId: number, attachmentId: number): Promise<void> => {
        await axiosInstance.delete(`${ATTACHMENT_API_BASE}/${taskId}/attachments/${attachmentId}`);
    },
};

export default taskAttachmentService;
