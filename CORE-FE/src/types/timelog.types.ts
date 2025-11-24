export interface TimeLogDTO {
    id?: number;
    organizationId?: number;
    userId?: number;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    projectId?: number;
    taskId?: number;
    bugId?: number;
    project?: {
        id: number;
        name: string;
        code: string;
    };
    task?: {
        id: number;
        title: string;
        status: string;
    };
    bug?: {
        id: number;
        title: string;
        severity: string;
    };
    workDate?: string;
    note?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTimeLogDTO {
    userId: number;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    projectId?: number;
    taskId?: number;
    bugId?: number;
    workDate?: string;
    note?: string;
}

export interface TimeBreakdown {
    date: string;
    totalMinutes: number;
    entries: TimeLogDTO[];
}

export interface ProjectBreakdown {
    projectId: number;
    projectName: string;
    projectCode: string;
    totalMinutes: number;
}

export interface CalendarSummary {
    [date: string]: number; // date -> total minutes
}
