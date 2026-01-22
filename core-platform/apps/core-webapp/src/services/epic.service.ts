import axios from 'axios';
import { Epic, EpicDTO } from '../types/epic.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/epic`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const epicService = {
  createEpic: async (data: EpicDTO): Promise<Epic> => {
    const response = await api.post('', data);
    return response.data;
  },

  updateEpic: async (id: number, data: EpicDTO): Promise<Epic> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteEpic: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getEpicById: async (id: number): Promise<Epic> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  getAllEpics: async (organizationId: number): Promise<Epic[]> => {
    const response = await api.get('', { params: { organizationId } });
    return response.data;
  },

  getEpicsByProject: async (projectId: number): Promise<Epic[]> => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
  },

  getEpicByKey: async (key: string): Promise<Epic> => {
    const response = await api.get(`/key/${key}`);
    return response.data;
  },
};
