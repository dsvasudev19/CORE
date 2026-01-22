export interface Attendance {
  id: number;
  employeeId: number;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  attendanceDate: string;
  checkInTime: string;
  checkOutTime: string;
  workHours: number;
  status: AttendanceStatus;
  location: AttendanceLocation;
  notes: string;
  isLate: boolean;
  lateByMinutes: number;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day';
export type AttendanceLocation = 'Office' | 'Remote' | 'Hybrid';

export interface AttendanceDTO {
  id?: number;
  employeeId: number;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  workHours?: number;
  status: AttendanceStatus;
  location?: AttendanceLocation;
  notes?: string;
  isLate?: boolean;
  lateByMinutes?: number;
  organizationId: number;
}

export interface AttendanceStatsDTO {
  presentToday: number;
  absent: number;
  lateArrivals: number;
  onLeave: number;
  totalEmployees?: number;
  presentPercentage?: number;
  absentPercentage?: number;
  latePercentage?: number;
  leavePercentage?: number;
}

export interface AttendanceSummaryDTO {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  halfDays: number;
  totalWorkHours: number;
  averageWorkHours: number;
  attendancePercentage: number;
}

export interface PagedAttendanceResponse {
  content: AttendanceDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
