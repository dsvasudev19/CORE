import axiosInstance from '../axiosInstance';

export interface TaskCommentDTO {
    id?: number;
    taskId: number;
    commentText: string;
    commentedBy?: number;
    commentedAt?: string;
    parentCommentId?: number;
    replies?: TaskCommentDTO[];
    // Commenter details from backend
    commenter?: {
        id?: number;
        employeeCode?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    // Legacy fields for display
    commenterName?: string;
    commenterEmail?: string;
}

export const taskCommentService = {
    // Add comment
    addComment: async (taskId: number, commentData: Partial<TaskCommentDTO>): Promise<TaskCommentDTO> => {
        const response = await axiosInstance.post(`/tasks/${taskId}/comments`, {
            ...commentData,
            taskId
        });
        return response.data.data;
    },

    // Get all comments for a task
    getCommentsByTask: async (taskId: number): Promise<TaskCommentDTO[]> => {
        const response = await axiosInstance.get(`/tasks/${taskId}/comments`);
        return response.data.data;
    },

    // Delete comment
    deleteComment: async (taskId: number, commentId: number): Promise<void> => {
        await axiosInstance.delete(`/tasks/${taskId}/comments/${commentId}`);
    }
};

export default taskCommentService;
