import axiosInstance from '../axiosInstance';
import type { TimeLogDTO, CreateTimeLogDTO, TimeBreakdown, ProjectBreakdown, CalendarSummary } from '../types/timelog.types';

const TIMELOG_API_BASE = '/timelogs';

export const timelogService = {
    // --------------------------------------------------------------
    // TIMER OPERATIONS
    // --------------------------------------------------------------
    startTimer: async (userId: number, taskId?: number, bugId?: number, note?: string): Promise<TimeLogDTO> => {
        const response = await axiosInstance.post(`${TIMELOG_API_BASE}/start`, null, {
            params: { userId, taskId, bugId, note }
        });
        return response.data.data;
    },

    stopTimer: async (userId: number): Promise<TimeLogDTO> => {
        const response = await axiosInstance.post(`${TIMELOG_API_BASE}/stop`, null, {
            params: { userId }
        });
        return response.data.data;
    },

    getActiveTimer: async (userId: number): Promise<TimeLogDTO | null> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/active`, {
            params: { userId }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // MANUAL ENTRY
    // --------------------------------------------------------------
    createManualEntry: async (dto: CreateTimeLogDTO): Promise<TimeLogDTO> => {
        const response = await axiosInstance.post(TIMELOG_API_BASE, dto);
        return response.data.data;
    },

    updateManualEntry: async (id: number, dto: Partial<TimeLogDTO>): Promise<TimeLogDTO> => {
        const response = await axiosInstance.put(`${TIMELOG_API_BASE}/${id}`, dto);
        return response.data.data;
    },

    deleteEntry: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${TIMELOG_API_BASE}/${id}`);
    },

    // --------------------------------------------------------------
    // FETCH LOGS
    // --------------------------------------------------------------
    getTimeLogs: async (
        userId: number,
        projectId?: number,
        taskId?: number,
        bugId?: number,
        fromDate?: string,
        toDate?: string
    ): Promise<TimeLogDTO[]> => {
        const response = await axiosInstance.get(TIMELOG_API_BASE, {
            params: { userId, projectId, taskId, bugId, fromDate, toDate }
        });
        return response.data.data;
    },

    getDailyLogs: async (userId: number, date: string): Promise<TimeLogDTO[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/daily`, {
            params: { userId, date }
        });
        return response.data.data;
    },

    getWeeklyLogs: async (userId: number, weekStart: string): Promise<TimeLogDTO[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/weekly`, {
            params: { userId, weekStart }
        });
        return response.data.data;
    },

    getMonthlyLogs: async (userId: number, year: number, month: number): Promise<TimeLogDTO[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/monthly`, {
            params: { userId, year, month }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // TOTALS
    // --------------------------------------------------------------
    getDailyTotal: async (userId: number, date: string): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/daily/total`, {
            params: { userId, date }
        });
        return response.data.data;
    },

    getWeeklyBreakdown: async (userId: number, weekStart: string): Promise<TimeBreakdown[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/weekly/breakdown`, {
            params: { userId, weekStart }
        });
        return response.data.data;
    },

    getMonthlyBreakdown: async (userId: number, year: number, month: number): Promise<TimeBreakdown[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/monthly/breakdown`, {
            params: { userId, year, month }
        });
        return response.data.data;
    },

    getTotalTimeForProject: async (userId: number, projectId: number): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/project/total`, {
            params: { userId, projectId }
        });
        return response.data.data;
    },

    getTotalTimeForTask: async (userId: number, taskId: number): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/task/total`, {
            params: { userId, taskId }
        });
        return response.data.data;
    },

    getTotalTimeForBug: async (userId: number, bugId: number): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/bug/total`, {
            params: { userId, bugId }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // COMPANY ANALYTICS
    // --------------------------------------------------------------
    getCompanyDailyTotal: async (date: string): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/company/daily-total`, {
            params: { date }
        });
        return response.data.data;
    },

    getCompanyWeeklyTotal: async (weekStart: string): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/company/weekly-total`, {
            params: { weekStart }
        });
        return response.data.data;
    },

    getCompanyMonthlyTotal: async (year: number, month: number): Promise<number> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/company/monthly-total`, {
            params: { year, month }
        });
        return response.data.data;
    },

    getCompanyDailyBreakdown: async (date: string): Promise<any> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/company/daily-breakdown`, {
            params: { date }
        });
        return response.data.data;
    },

    getUserProjectBreakdown: async (userId: number, fromDate: string, toDate: string): Promise<ProjectBreakdown[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/user/project-breakdown`, {
            params: { userId, fromDate, toDate }
        });
        return response.data.data;
    },

    getCompanyProjectBreakdown: async (fromDate: string, toDate: string): Promise<ProjectBreakdown[]> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/company/project-breakdown`, {
            params: { fromDate, toDate }
        });
        return response.data.data;
    },

    // --------------------------------------------------------------
    // CALENDAR SUMMARY
    // --------------------------------------------------------------
    getCalendarSummary: async (userId: number, year: number, month: number): Promise<CalendarSummary> => {
        const response = await axiosInstance.get(`${TIMELOG_API_BASE}/calendar`, {
            params: { userId, year, month }
        });
        return response.data.data;
    }
};

export default timelogService;
