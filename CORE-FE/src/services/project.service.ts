import axiosInstance from '../axiosInstance';

const PROJECT_API_BASE = '/projects';

export interface ProjectMemberDTO {
    id: number;
    organizationId: number | null;
    active: boolean;
    createdAt: string | null;
    updatedAt: string | null;
    createdBy: number | null;
    updatedBy: number | null;
    projectId: number;
    userId: number;
    userName: string | null;
    role: string;
    hourlyRate: number | null;
    activeMember: boolean;
    joinedAt: string;
    lastActivity: string | null;
}

export interface ProjectPhaseDTO {
    projectId: number;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    progressPercentage: number;
    orderIndex: number;
}

export interface ClientDTO {
    id: number;
    name: string;
    code: string;
}

export interface ProjectDTO {
    id: number;
    organizationId: number;
    active: boolean;
    createdAt: string | null;
    updatedAt: string | null;
    createdBy: number | null;
    updatedBy: number | null;
    name: string;
    code: string;
    description: string;
    clientId: number | null;
    client: ClientDTO | null;
    status: string;
    projectType: string;
    priority: string;
    startDate: string;
    endDate: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string | null;
    progressPercentage: number;
    budget: number | null;
    spent: number | null;
    color: string;
    isStarred: boolean | null;
    lastActivity: string;
    tags: string[];
    members: ProjectMemberDTO[];
    phases: ProjectPhaseDTO[];
    files: any[];
}

export const projectService = {
    // Get all projects
    getAllProjects: async (): Promise<ProjectDTO[]> => {
        const response = await axiosInstance.get(PROJECT_API_BASE);
        return response.data.data;
    },

    // Get project by ID
    getProjectById: async (id: number): Promise<ProjectDTO> => {
        const response = await axiosInstance.get(`${PROJECT_API_BASE}/${id}`);
        return response.data.data;
    },

    // Create new project
    createProject: async (projectData: Partial<ProjectDTO>): Promise<ProjectDTO> => {
        const response = await axiosInstance.post(PROJECT_API_BASE, projectData);
        return response.data.data;
    },

    // Update project
    updateProject: async (id: number, projectData: Partial<ProjectDTO>): Promise<ProjectDTO> => {
        const response = await axiosInstance.put(`${PROJECT_API_BASE}/${id}`, projectData);
        return response.data.data;
    },

    // Delete project
    deleteProject: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${PROJECT_API_BASE}/${id}`);
    },

    // Toggle starred status
    toggleStarred: async (id: number): Promise<ProjectDTO> => {
        const response = await axiosInstance.patch(`${PROJECT_API_BASE}/${id}/star`);
        return response.data.data;
    }
};

export default projectService;
