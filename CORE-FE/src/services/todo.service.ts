import axiosInstance from '../axiosInstance';
import { type TodoDTO } from '../types/todo.types';

const TODO_API_BASE = '/todos';

export const todoService = {
    // -------------------------------------------------------------------------
    // CRUD
    // -------------------------------------------------------------------------

    createTodo: async (dto: Partial<TodoDTO>): Promise<TodoDTO> => {
        const response = await axiosInstance.post(TODO_API_BASE, dto);
        return response.data;
    },

    updateTodo: async (id: number, dto: Partial<TodoDTO>): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}`, dto);
        return response.data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${TODO_API_BASE}/${id}`);
    },

    getTodoById: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/${id}`);
        return response.data;
    },

    getAllTodos: async (): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(TODO_API_BASE);
        return response.data;
    },

    // -------------------------------------------------------------------------
    // STATUS MANAGEMENT
    // -------------------------------------------------------------------------

    markInProgress: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/status/in-progress`);
        return response.data;
    },

    markCompleted: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/status/completed`);
        return response.data;
    },

    markBlocked: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/status/blocked`);
        return response.data;
    },

    markCancelled: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/status/cancelled`);
        return response.data;
    },

    // -------------------------------------------------------------------------
    // ASSIGNMENT
    // -------------------------------------------------------------------------

    assignToEmployee: async (id: number, employeeId: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/assign/${employeeId}`);
        return response.data;
    },

    unassign: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/unassign`);
        return response.data;
    },

    // -------------------------------------------------------------------------
    // PROJECT / TASK LINKING
    // -------------------------------------------------------------------------

    linkToProject: async (id: number, projectCode: string): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/link/project/${projectCode}`);
        return response.data;
    },

    unlinkProject: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/unlink/project`);
        return response.data;
    },

    linkToTask: async (id: number, taskId: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/link/task/${taskId}`);
        return response.data;
    },

    unlinkTask: async (id: number): Promise<TodoDTO> => {
        const response = await axiosInstance.put(`${TODO_API_BASE}/${id}/unlink/task`);
        return response.data;
    },

    // -------------------------------------------------------------------------
    // FILTERS
    // -------------------------------------------------------------------------

    getTodosByAssignee: async (employeeId: number): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/assignee/${employeeId}`);
        return response.data;
    },

    getTodosByProject: async (projectCode: string): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/project/${projectCode}`);
        return response.data;
    },

    getTodosByTask: async (taskId: number): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/task/${taskId}`);
        return response.data;
    },

    getTodosByStatus: async (status: string): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/status/${status}`);
        return response.data;
    },

    getOverdueTodos: async (): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/overdue`);
        return response.data;
    },

    getUpcomingTodos: async (): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/upcoming`);
        return response.data;
    },

    getPersonalTodos: async (): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/type/personal`);
        return response.data;
    },

    getProjectTodos: async (projectCode: string): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/type/project/${projectCode}`);
        return response.data;
    },

    getTaskTodos: async (taskId: number): Promise<TodoDTO[]> => {
        const response = await axiosInstance.get(`${TODO_API_BASE}/type/task/${taskId}`);
        return response.data;
    }
};
