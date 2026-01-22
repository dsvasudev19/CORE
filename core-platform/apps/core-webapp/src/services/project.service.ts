import axiosInstance from '../axiosInstance';

const PROJECT_API_BASE = '/projects';

export interface ProjectMemberDTO {
    id: number;
    projectId: number;
    userId: number;
    userName?: string;
    role: string;
    hourlyRate?: number;
    activeMember: boolean;
    employee?: {
        id: number;
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    joinedAt?: string;
    lastActivity?: string;
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

    // Update a project (requires full project object)
    updateProject: async (id: number, projectData: Partial<ProjectDTO>): Promise<ProjectDTO> => {
        // First fetch the current project to get all fields
        const currentProject = await axiosInstance.get(`${PROJECT_API_BASE}/${id}`);
        const fullProjectData = currentProject.data.data;

        // Merge the updates with the full project data
        const updatedData = {
            ...fullProjectData,
            ...projectData
        };

        const response = await axiosInstance.put(`${PROJECT_API_BASE}/${id}`, updatedData);
        return response.data.data;
    },

    // Delete project
    deleteProject: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${PROJECT_API_BASE}/${id}`);
    },

    // Toggle starred status
    toggleStarred: async (id: number, starred: boolean): Promise<ProjectDTO> => {
        const response = await axiosInstance.put(`${PROJECT_API_BASE}/${id}/star`, null, {
            params: { starred }
        });
        return response.data.data;
    },

    // Add a phase to a project
    addPhase: async (projectId: number, phaseData: Omit<ProjectPhaseDTO, 'projectId' | 'orderIndex'>): Promise<ProjectDTO> => {
        // Backend expects POST to /api/projects/phases with full DTO including projectId
        const fullPhaseData = {
            ...phaseData,
            projectId: projectId
        };
        await axiosInstance.post('/projects/phases', fullPhaseData);
        // After creating phase, fetch updated project
        const projectResponse = await axiosInstance.get(`${PROJECT_API_BASE}/${projectId}`);
        return projectResponse.data.data;
    },

    // Add a team member to a project
    addMember: async (projectId: number, memberData: { userId: number; role: string; hourlyRate?: number }): Promise<ProjectDTO> => {
        // Backend expects POST to /api/projects/{id}/members with query params
        await axiosInstance.post(`${PROJECT_API_BASE}/${projectId}/members`, null, {
            params: {
                userId: memberData.userId,
                role: memberData.role,
                hourlyRate: memberData.hourlyRate
            }
        });
        // Backend returns ProjectMemberDTO, so fetch updated project
        const projectResponse = await axiosInstance.get(`${PROJECT_API_BASE}/${projectId}`);
        return projectResponse.data.data;
    },

    // Remove a team member from a project
    removeMember: async (projectId: number, userId: number): Promise<ProjectDTO> => {
        await axiosInstance.delete(`${PROJECT_API_BASE}/${projectId}/members/${userId}`);
        // Fetch updated project after removal
        const projectResponse = await axiosInstance.get(`${PROJECT_API_BASE}/${projectId}`);
        return projectResponse.data.data;
    },

    // Update member role
    updateMemberRole: async (projectId: number, userId: number, role: string): Promise<ProjectDTO> => {
        await axiosInstance.put(`${PROJECT_API_BASE}/${projectId}/members/${userId}/role`, null, {
            params: { role }
        });
        const projectResponse = await axiosInstance.get(`${PROJECT_API_BASE}/${projectId}`);
        return projectResponse.data.data;
    },

    // Update project budget
    updateBudget: async (projectId: number, budget: number): Promise<void> => {
        await axiosInstance.put(`${PROJECT_API_BASE}/${projectId}/budget`, null, {
            params: { budget }
        });
    },

    // Update project spent amount
    updateSpent: async (projectId: number, spent: number): Promise<void> => {
        await axiosInstance.put(`${PROJECT_API_BASE}/${projectId}/spent`, null, {
            params: { spent }
        });
    },

    // Update project tags
    updateTags: async (projectId: number, tags: string[]): Promise<void> => {
        await axiosInstance.put(`${PROJECT_API_BASE}/${projectId}/tags`, null, {
            params: { tags: tags.join(',') }
        });
    }
};

export default projectService;
