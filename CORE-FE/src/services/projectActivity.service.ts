import axiosInstance from '../axiosInstance';

const ACTIVITY_API_BASE = '/projects';

export interface ProjectActivityDTO {
    id: number;
    projectId: number;
    activityType: string;
    performedBy: number;
    performer: {
        id: number | null;
        employeeCode: string | null;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    summary: string;
    description?: string;
    metadata?: Record<string, any>;
    metadataJson?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export const projectActivityService = {
    // Get paginated activities for a project
    getActivities: async (
        projectId: number,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<ProjectActivityDTO>> => {
        const response = await axiosInstance.get(
            `${ACTIVITY_API_BASE}/${projectId}/activities`,
            {
                params: { page, size }
            }
        );
        return response.data;
    },

    // Export activities (PDF or Excel)
    exportActivities: async (projectId: number, format: 'PDF' | 'EXCEL'): Promise<void> => {
        const response = await axiosInstance.get(
            `${ACTIVITY_API_BASE}/${projectId}/activities/export`,
            {
                params: { format },
                responseType: 'blob'
            }
        );

        // Create blob and download
        const blob = new Blob([response.data], {
            type: format === 'EXCEL'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `project-${projectId}-activity-log.${format === 'EXCEL' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

export default projectActivityService;
