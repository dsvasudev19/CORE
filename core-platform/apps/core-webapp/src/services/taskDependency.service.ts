import axiosInstance from '../axiosInstance';
import type { TaskDependencyDTO } from '../types/task.types';

const DEPENDENCY_API_BASE = '/tasks';

export const taskDependencyService = {
    // --------------------------------------------------------------
    // CREATE DEPENDENCY
    // --------------------------------------------------------------
    createDependency: async (taskId: number, dto: TaskDependencyDTO): Promise<TaskDependencyDTO> => {
        const response = await axiosInstance.post(`${DEPENDENCY_API_BASE}/${taskId}/dependent`, dto);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // DELETE DEPENDENCY
    // --------------------------------------------------------------
    deleteDependency: async (taskId: number, dependencyId: number): Promise<void> => {
        await axiosInstance.delete(`${DEPENDENCY_API_BASE}/${taskId}/dependent/${dependencyId}`);
    },

    // --------------------------------------------------------------
    // GET DEPENDENCIES (Tasks this task depends on)
    // --------------------------------------------------------------
    getDependenciesByTask: async (taskId: number): Promise<TaskDependencyDTO[]> => {
        const response = await axiosInstance.get(`${DEPENDENCY_API_BASE}/${taskId}/dependent`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // GET DEPENDENTS (Tasks that depend on this one)
    // --------------------------------------------------------------
    getDependents: async (taskId: number): Promise<TaskDependencyDTO[]> => {
        const response = await axiosInstance.get(`${DEPENDENCY_API_BASE}/${taskId}/dependent/dependents`);
        return response.data.data;
    },

    // --------------------------------------------------------------
    // CHECK IF TASK HAS UNRESOLVED DEPENDENCIES
    // --------------------------------------------------------------
    hasUnresolvedDependencies: async (taskId: number): Promise<boolean> => {
        const response = await axiosInstance.get(`${DEPENDENCY_API_BASE}/${taskId}/dependent/unresolved`);
        // Backend returns a string message, we'll check if it contains "unresolved"
        const message = response.data.data;
        return typeof message === 'string' && message.includes('unresolved');
    },
};

export default taskDependencyService;
