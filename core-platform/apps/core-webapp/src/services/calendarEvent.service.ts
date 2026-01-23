import axiosInstance from "../axiosInstance";
import type {
  CalendarEventDTO,
  CalendarEventStatsDTO,
  CalendarEventPageResponse,
} from "../types/calendarEvent.types";

const API_BASE = "/calendar/events";

export const calendarEventService = {
  // Create event
  createEvent: async (event: CalendarEventDTO): Promise<CalendarEventDTO> => {
    const response = await axiosInstance.post<{ data: CalendarEventDTO }>(
      API_BASE,
      event,
    );
    return response.data.data;
  },

  // Update event
  updateEvent: async (
    id: number,
    event: CalendarEventDTO,
  ): Promise<CalendarEventDTO> => {
    const response = await axiosInstance.put<{ data: CalendarEventDTO }>(
      `${API_BASE}/${id}`,
      event,
    );
    return response.data.data;
  },

  // Delete event
  deleteEvent: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}`);
  },

  // Cancel event
  cancelEvent: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${API_BASE}/${id}/cancel`);
  },

  // Get event by ID
  getEventById: async (id: number): Promise<CalendarEventDTO> => {
    const response = await axiosInstance.get<{ data: CalendarEventDTO }>(
      `${API_BASE}/${id}`,
    );
    return response.data.data;
  },

  // Get all events (paginated)
  getAllEvents: async (
    organizationId: number,
    page: number = 0,
    size: number = 10,
  ): Promise<CalendarEventPageResponse> => {
    const response = await axiosInstance.get<{
      data: CalendarEventPageResponse;
    }>(`${API_BASE}/organization/${organizationId}`, {
      params: { page, size },
    });
    return response.data.data;
  },

  // Get events between dates
  getEventsBetweenDates: async (
    organizationId: number,
    startDate: string,
    endDate: string,
  ): Promise<CalendarEventDTO[]> => {
    const response = await axiosInstance.get<{ data: CalendarEventDTO[] }>(
      `${API_BASE}/organization/${organizationId}/range`,
      { params: { startDate, endDate } },
    );
    return response.data.data;
  },

  // Get events by type and date range
  getEventsByTypeAndDateRange: async (
    organizationId: number,
    eventType: string,
    startDate: string,
    endDate: string,
  ): Promise<CalendarEventDTO[]> => {
    const response = await axiosInstance.get<{ data: CalendarEventDTO[] }>(
      `${API_BASE}/organization/${organizationId}/type/${eventType}`,
      { params: { startDate, endDate } },
    );
    return response.data.data;
  },

  // Get events by employee
  getEventsByEmployee: async (
    organizationId: number,
    employeeId: number,
  ): Promise<CalendarEventDTO[]> => {
    const response = await axiosInstance.get<{ data: CalendarEventDTO[] }>(
      `${API_BASE}/organization/${organizationId}/employee/${employeeId}`,
    );
    return response.data.data;
  },

  // Search events
  searchEvents: async (
    organizationId: number,
    keyword: string,
    page: number = 0,
    size: number = 10,
  ): Promise<CalendarEventPageResponse> => {
    const response = await axiosInstance.get<{
      data: CalendarEventPageResponse;
    }>(`${API_BASE}/organization/${organizationId}/search`, {
      params: { keyword, page, size },
    });
    return response.data.data;
  },

  // Get events by status
  getEventsByStatus: async (
    organizationId: number,
    status: string,
  ): Promise<CalendarEventDTO[]> => {
    const response = await axiosInstance.get<{ data: CalendarEventDTO[] }>(
      `${API_BASE}/organization/${organizationId}/status/${status}`,
    );
    return response.data.data;
  },

  // Get recurring events
  getRecurringEvents: async (
    organizationId: number,
  ): Promise<CalendarEventDTO[]> => {
    const response = await axiosInstance.get<{ data: CalendarEventDTO[] }>(
      `${API_BASE}/organization/${organizationId}/recurring`,
    );
    return response.data.data;
  },

  // Get event statistics
  getEventStats: async (
    organizationId: number,
  ): Promise<CalendarEventStatsDTO> => {
    const response = await axiosInstance.get<{ data: CalendarEventStatsDTO }>(
      `${API_BASE}/organization/${organizationId}/stats`,
    );
    return response.data.data;
  },
};
