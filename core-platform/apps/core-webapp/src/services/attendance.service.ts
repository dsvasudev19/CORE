import axiosInstance from "../axiosInstance";
import type {
  AttendanceDTO,
  AttendanceStatsDTO,
  AttendanceSummaryDTO,
  PagedAttendanceResponse,
} from "../types/attendance.types";

const ATTENDANCE_API_BASE = "/attendance";

export const attendanceService = {
  // Mark attendance
  markAttendance: async (data: AttendanceDTO): Promise<AttendanceDTO> => {
    const response = await axiosInstance.post(ATTENDANCE_API_BASE, data);
    return response.data;
  },

  // Update attendance
  updateAttendance: async (
    id: number,
    data: AttendanceDTO,
  ): Promise<AttendanceDTO> => {
    const response = await axiosInstance.put(
      `${ATTENDANCE_API_BASE}/${id}`,
      data,
    );
    return response.data;
  },

  // Check in
  checkIn: async (
    employeeId: number,
    date: string,
    location: string,
  ): Promise<AttendanceDTO> => {
    const response = await axiosInstance.post(
      `${ATTENDANCE_API_BASE}/check-in`,
      null,
      {
        params: { employeeId, date, location },
      },
    );
    return response.data;
  },

  // Check out
  checkOut: async (
    employeeId: number,
    date: string,
  ): Promise<AttendanceDTO> => {
    const response = await axiosInstance.post(
      `${ATTENDANCE_API_BASE}/check-out`,
      null,
      {
        params: { employeeId, date },
      },
    );
    return response.data;
  },

  // Get attendance by ID
  getAttendanceById: async (id: number): Promise<AttendanceDTO> => {
    const response = await axiosInstance.get(`${ATTENDANCE_API_BASE}/${id}`);
    return response.data;
  },

  // Get employee attendance for specific date
  getEmployeeAttendanceForDate: async (
    employeeId: number,
    date: string,
  ): Promise<AttendanceDTO | null> => {
    try {
      const response = await axiosInstance.get(
        `${ATTENDANCE_API_BASE}/employee/${employeeId}/date/${date}`,
      );
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
    size: number = 20,
  ): Promise<PagedAttendanceResponse> => {
    const response = await axiosInstance.get(
      `${ATTENDANCE_API_BASE}/organization/${organizationId}/date/${date}`,
      {
        params: { page, size },
      },
    );
    return response.data;
  },

  // Get attendance by date range (paginated)
  getAttendanceByDateRange: async (
    organizationId: number,
    startDate: string,
    endDate: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PagedAttendanceResponse> => {
    const response = await axiosInstance.get(
      `${ATTENDANCE_API_BASE}/organization/${organizationId}/range`,
      {
        params: { startDate, endDate, page, size },
      },
    );
    return response.data;
  },

  // Get employee attendance history
  getEmployeeAttendanceHistory: async (
    employeeId: number,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceDTO[]> => {
    const response = await axiosInstance.get(
      `${ATTENDANCE_API_BASE}/employee/${employeeId}/history`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },

  // Get attendance stats for a date
  getAttendanceStats: async (
    organizationId: number,
    date: string,
  ): Promise<AttendanceStatsDTO> => {
    const response = await axiosInstance.get(
      `${ATTENDANCE_API_BASE}/organization/${organizationId}/stats`,
      {
        params: { date },
      },
    );
    return response.data;
  },

  // Get employee attendance summary
  getEmployeeAttendanceSummary: async (
    employeeId: number,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceSummaryDTO> => {
    const response = await axiosInstance.get(
      `${ATTENDANCE_API_BASE}/employee/${employeeId}/summary`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },
};
