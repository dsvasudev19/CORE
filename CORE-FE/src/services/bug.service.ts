import axiosInstance from '../axiosInstance';
import type { BugDTO, CreateBugDTO, PagedResponse, BugCommentDTO, BugHistoryDTO, BugAttachmentDTO } from '../types/bug.types';

const BUG_API_BASE = '/bugs';

export const bugService = {
    // --------------------------------------------------------------
    // CREATE BUG
    // --------------------------------------------------------------
    createBug: async (bugData: CreateBugDTO): Promise<BugDTO> => {
        const response = await axiosInstance.post(BUG_API_BASE, bugData);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // UPDATE BUG
    // --------------------------------------------------------------
    updateBug: async (id: number, bugData: BugDTO): Promise<BugDTO> => {
        const response = await axiosInstance.put(`${BUG_API_BASE}/${id}`, bugData);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // DELETE BUG
    // --------------------------------------------------------------
    deleteBug: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${BUG_API_BASE}/${id}`);
    },

    // --------------------------------------------------------------
    // GET SINGLE BUG
    // --------------------------------------------------------------
    getBugById: async (id: number, includeDetails: boolean = false): Promise<BugDTO> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/${id}`, {
            params: { includeDetails }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // SEARCH BUGS
    // --------------------------------------------------------------
    searchBugs: async (organizationId: number, keyword?: string, page: number = 0, size: number = 20): Promise<PagedResponse<BugDTO>> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/search`, {
            params: {
                organizationId,
                keyword,
                page,
                size
            }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // GET BUGS BY PROJECT
    // --------------------------------------------------------------
    getBugsByProject: async (projectId: number): Promise<BugDTO[]> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/project/${projectId}`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // GET BUGS BY ASSIGNEE
    // --------------------------------------------------------------
    getBugsByAssignee: async (userId: number): Promise<BugDTO[]> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/assignee/${userId}`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // CHANGE BUG STATUS
    // --------------------------------------------------------------
    changeBugStatus: async (bugId: number, newStatus: string): Promise<BugDTO> => {
        const response = await axiosInstance.put(`${BUG_API_BASE}/${bugId}/status`, null, {
            params: { newStatus }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // CHANGE BUG SEVERITY
    // --------------------------------------------------------------
    changeBugSeverity: async (bugId: number, newSeverity: string): Promise<BugDTO> => {
        const response = await axiosInstance.put(`${BUG_API_BASE}/${bugId}/severity`, null, {
            params: { newSeverity }
        });
        return response.data.data;
    },


    // --------------------------------------------------------------
    // CLOSE BUG
    // --------------------------------------------------------------
    closeBug: async (bugId: number): Promise<void> => {
        await axiosInstance.put(`${BUG_API_BASE}/${bugId}/close`);
    },

    // --------------------------------------------------------------
    // REOPEN BUG
    // --------------------------------------------------------------
    reopenBug: async (bugId: number): Promise<void> => {
        await axiosInstance.put(`${BUG_API_BASE}/${bugId}/reopen`);
    },

    // --------------------------------------------------------------
    // COMMENT MANAGEMENT
    // --------------------------------------------------------------
    addComment: async (bugId: number, comment: BugCommentDTO): Promise<BugCommentDTO> => {
        const response = await axiosInstance.post(`${BUG_API_BASE}/comments/bug/${bugId}`, comment);
        return response.data.data;
    },

    replyToComment: async (parentCommentId: number, comment: BugCommentDTO): Promise<BugCommentDTO> => {
        const response = await axiosInstance.post(`${BUG_API_BASE}/comments/${parentCommentId}/reply`, comment);
        return response.data.data;
    },

    deleteComment: async (commentId: number): Promise<void> => {
        await axiosInstance.delete(`${BUG_API_BASE}/comments/${commentId}`);
    },

    getCommentsByBug: async (bugId: number): Promise<BugCommentDTO[]> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/comments/bug/${bugId}`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // HISTORY
    // --------------------------------------------------------------
    getHistoryByBug: async (bugId: number): Promise<BugHistoryDTO[]> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/history/bug/${bugId}`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // ATTACHMENTS
    // --------------------------------------------------------------
    uploadAttachment: async (bugId: number, file: File, description?: string, visibility: string = 'INTERNAL'): Promise<BugAttachmentDTO> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description ?? '');

        formData.append('visibility', visibility);

        const response = await axiosInstance.post(`${BUG_API_BASE}/attachments/bug/${bugId}?description=${description}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    },

    deleteAttachment: async (attachmentId: number): Promise<void> => {
        await axiosInstance.delete(`${BUG_API_BASE}/attachments/${attachmentId}`);
    },

    getAttachmentsByBug: async (bugId: number): Promise<BugAttachmentDTO[]> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/attachments/bug/${bugId}`);
        return response.data.data;
    },

    downloadAttachment: async (attachmentId: number): Promise<Blob> => {
        const response = await axiosInstance.get(`${BUG_API_BASE}/attachments/download/${attachmentId}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // --------------------------------------------------------------
    // TASK LINKING
    // --------------------------------------------------------------
    linkBugToTask: async (bugId: number, taskId: number): Promise<BugDTO> => {
        const response = await axiosInstance.put(`${BUG_API_BASE}/${bugId}/link-task/${taskId}`);
        return response.data.data;
    },

    unlinkBugFromTask: async (bugId: number): Promise<BugDTO> => {
        const response = await axiosInstance.put(`${BUG_API_BASE}/${bugId}/unlink-task`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // EMPLOYEES
    // --------------------------------------------------------------
    getEmployees: async (): Promise<any[]> => {
        const response = await axiosInstance.get('/employees');
        return response.data.data.content;
    }
};

export default bugService;
