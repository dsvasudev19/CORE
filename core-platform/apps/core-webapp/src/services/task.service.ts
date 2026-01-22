import axiosInstance from '../axiosInstance';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';


const TASK_API_BASE = '/tasks';

export interface TaskSearchParams {
    organizationId: number;
    keyword?: string;
    page?: number;
    size?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const taskService = {
    // --------------------------------------------------------------
    // CREATE TASK
    // --------------------------------------------------------------
    createTask: async (taskData: CreateTaskDTO): Promise<TaskDTO> => {
        const response = await axiosInstance.post(TASK_API_BASE, taskData);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // UPDATE TASK
    // --------------------------------------------------------------
    updateTask: async (id: number, taskData: UpdateTaskDTO): Promise<TaskDTO> => {
        const response = await axiosInstance.put(`${TASK_API_BASE}/${id}`, taskData);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // DELETE TASK
    // --------------------------------------------------------------
    deleteTask: async (id: number, deleteSubtasks: boolean = false): Promise<void> => {
        await axiosInstance.delete(`${TASK_API_BASE}/${id}`, {
            params: { deleteSubtasks }
        });
    },

    // --------------------------------------------------------------
    // GET SINGLE TASK
    // --------------------------------------------------------------
    getTaskById: async (id: number, includeNested: boolean = false): Promise<TaskDTO> => {
        const response = await axiosInstance.get(`${TASK_API_BASE}/${id}`, {
            params: { includeNested }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // LIST BY PROJECT
    // --------------------------------------------------------------
    getTasksByProject: async (projectId: number): Promise<TaskDTO[]> => {
        const response = await axiosInstance.get(`${TASK_API_BASE}/project/${projectId}`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // SEARCH TASKS
    // --------------------------------------------------------------
    searchTasks: async (params: TaskSearchParams): Promise<PageResponse<TaskDTO>> => {
        const response = await axiosInstance.get(`${TASK_API_BASE}/search`, {
            params: {
                organizationId: params.organizationId,
                keyword: params.keyword,
                page: params.page || 0,
                size: params.size || 20
            }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // ASSIGN USERS
    // --------------------------------------------------------------
    assignUsers: async (taskId: number, userIds: number[]): Promise<TaskDTO> => {
        const response = await axiosInstance.put(`${TASK_API_BASE}/${taskId}/assign`, userIds);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // UPDATE TASK STATUS
    // --------------------------------------------------------------
    updateTaskStatus: async (taskId: number, newStatus: string): Promise<TaskDTO> => {
        const response = await axiosInstance.put(`${TASK_API_BASE}/${taskId}/status`, null, {
            params: { newStatus }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // UPDATE PRIORITY
    // --------------------------------------------------------------
    updateTaskPriority: async (taskId: number, priority: string): Promise<TaskDTO> => {
        const response = await axiosInstance.put(`${TASK_API_BASE}/${taskId}/priority`, null, {
            params: { priority }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // RECOMPUTE PROGRESS
    // --------------------------------------------------------------
    recalculateTaskProgress: async (taskId: number): Promise<void> => {
        await axiosInstance.put(`${TASK_API_BASE}/${taskId}/recalculate-progress`);
    },

    // --------------------------------------------------------------
    // ADD DEPENDENCY
    // --------------------------------------------------------------
    addDependency: async (taskId: number, dependsOnTaskId: number, dependencyType: string): Promise<void> => {
        await axiosInstance.post(`${TASK_API_BASE}/${taskId}/dependencies`, null, {
            params: { dependsOnTaskId, dependencyType }
        });
    },

    // --------------------------------------------------------------
    // REMOVE DEPENDENCY
    // --------------------------------------------------------------
    removeDependency: async (taskId: number, dependsOnTaskId: number): Promise<void> => {
        await axiosInstance.delete(`${TASK_API_BASE}/${taskId}/dependencies`, {
            params: { dependsOnTaskId }
        });
    },

    // --------------------------------------------------------------
    // GET ALL DEPENDENCIES
    // --------------------------------------------------------------
    getDependencies: async (taskId: number): Promise<TaskDTO[]> => {
        const response = await axiosInstance.get(`${TASK_API_BASE}/${taskId}/dependencies`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // MARK COMPLETE
    // --------------------------------------------------------------
    markTaskComplete: async (taskId: number): Promise<TaskDTO> => {
        const response = await axiosInstance.put(`${TASK_API_BASE}/${taskId}/complete`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // GET BY ASSIGNEE
    // --------------------------------------------------------------
    getTasksByAssignee: async (userId: number): Promise<TaskDTO[]> => {
        const response = await axiosInstance.get(`${TASK_API_BASE}/assignee/${userId}`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // CHECK AUTO CLOSE
    // --------------------------------------------------------------
    autoCloseParent: async (taskId: number): Promise<void> => {
        await axiosInstance.put(`${TASK_API_BASE}/${taskId}/auto-close`);
    },

    // ============================================================== 
    // ENHANCED ENDPOINTS (Backend Implementation Needed)
    // ==============================================================

    // --------------------------------------------------------------
    // GET MY TASKS (assigned to me OR owned by me)
    // Backend: GET /api/tasks/my-tasks?userId={userId}&status={status}&priority={priority}
    // --------------------------------------------------------------
    getMyTasks: async (userId: number, filters?: {
        status?: string;
        priority?: string;
        projectId?: number;
    }): Promise<TaskDTO[]> => {
        const response = await axiosInstance.get(`${TASK_API_BASE}/my-tasks`, {
            params: {
                userId,
                ...filters
            }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // GET TASK STATISTICS
    // Backend: GET /api/tasks/statistics?userId={userId}
    // Returns: { total, todo, inProgress, completed, overdue, byPriority: {...} }
    // --------------------------------------------------------------
    getTaskStatistics: async (userId: number): Promise<any> => {
        const response = await axiosInstance.get(`/tasks/statistics`, {
            params: { userId }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // BULK UPDATE TASKS
    // Backend: POST /api/tasks/bulk-update
    // Body: { taskIds: number[], updates: { status?, priority?, ... } }
    // --------------------------------------------------------------
    bulkUpdateTasks: async (taskIds: number[], updates: UpdateTaskDTO): Promise<TaskDTO[]> => {
        const response = await axiosInstance.post(`${TASK_API_BASE}/bulk-update`, {
            taskIds,
            updates
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // QUICK UPDATE (single field)
    // Backend: PATCH /api/tasks/{id}/quick-update?field={field}&value={value}
    // --------------------------------------------------------------
    quickUpdate: async (taskId: number, field: string, value: any): Promise<TaskDTO> => {
        const response = await axiosInstance.patch(`${TASK_API_BASE}/${taskId}/quick-update`, null, {
            params: { field, value }
        });
        return response.data.data;
    }
};

export default taskService;
