import axios from 'axios';
import type { 
  AttendanceDTO, 
  AttendanceStatsDTO, 
  AttendanceSummaryDTO,
  PagedAttendanceResponse 
} from '../types/attendance.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/attendance`,
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

export const attendanceService = {
  // Mark attendance
  markAttendance: async (data: AttendanceDTO): Promise<AttendanceDTO> => {
    const response = await api.post('', data);
    return response.data;
  },

  // Update attendance
  updateAttendance: async (id: number, data: AttendanceDTO): Promise<AttendanceDTO> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  // Check in
  checkIn: async (employeeId: number, date: string, location: string): Promise<AttendanceDTO> => {
    const response = await api.post('/check-in', null, {
      params: { employeeId, date, location }
    });
    return response.data;
  },

  // Check out
  checkOut: async (employeeId: number, date: string): Promise<AttendanceDTO> => {
    const response = await api.post('/check-out', null, {
      params: { employeeId, date }
    });
    return response.data;
  },

  // Get attendance by ID
  getAttendanceById: async (id: number): Promise<AttendanceDTO> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Get employee attendance for specific date
  getEmployeeAttendanceForDate: async (
    employeeId: number, 
    date: string
  ): Promise<AttendanceDTO | null> => {
    try {
      const response = await api.get(`/employee/${employeeId}/date/${date}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get attendance by date (paginated)
  getAttendanceByDate: async (
    organizationId: number,
    date: string,
    page: number = 0,
    size: number = 20
  ): Promise<PagedAttendanceResponse> => {
    const response = await api.get(`/organization/${organizationId}/date/${date}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get attendance by date range (paginated)
  getAttendanceByDateRange: async (
    organizationId: number,
    startDate: string,
    endDate: string,
    page: number = 0,
    size: number = 20
  ): Promise<PagedAttendanceResponse> => {
    const response = await api.get(`/organization/${organizationId}/range`, {
      params: { startDate, endDate, page, size }
    });
    return response.data;
  },

  // Get employee attendance history
  getEmployeeAttendanceHistory: async (
    employeeId: number,
    startDate: string,
    endDate: string
  ): Promise<AttendanceDTO[]> => {
    const response = await api.get(`/employee/${employeeId}/history`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get attendance stats for a date
  getAttendanceStats: async (
    organizationId: number,
    date: string
  ): Promise<AttendanceStatsDTO> => {
    const response = await api.get(`/organization/${organizationId}/stats`, {
      params: { date }
    });
    return response.data;
  },

  // Get employee attendance summary
  getEmployeeAttendanceSummary: async (
    employeeId: number,
    startDate: string,
    endDate: string
  ): Promise<AttendanceSummaryDTO> => {
    const response = await api.get(`/employee/${employeeId}/summary`, {
      params: { startDate, endDate }
    });
    return response.data;
  },
};
