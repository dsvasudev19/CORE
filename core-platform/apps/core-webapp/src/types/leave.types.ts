import { BaseDTO } from "./common.types";
import { MinimalEmployeeDTO } from "./employee.types";

// Enums
export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

// Leave Type
export interface LeaveTypeDTO extends BaseDTO {
  name: string;
  annualLimit?: number;
  monthlyLimit?: number;
  quarterlyLimit?: number;
  earnedLeave?: boolean;
  carryForward?: boolean;
  maxCarryForward?: number;
}

export interface MinimalLeaveTypeDTO {
  id: number;
  name: string;
}

// Leave Request
export interface LeaveRequestDTO extends BaseDTO {
  employeeId?: number;
  employee?: MinimalEmployeeDTO;
  leaveTypeId?: number;
  leaveType?: LeaveTypeDTO;
  startDate: string;
  endDate: string;
  totalDays?: number;
  status?: LeaveStatus;
  reason?: string;
  managerId?: number;
  manager?: MinimalEmployeeDTO;
  managerComment?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface MinimalLeaveRequestDTO {
  id: number;
  startDate: string;
  endDate: string;
  totalDays?: number;
  status: LeaveStatus;
  leaveTypeId?: number;
  leaveTypeName?: string;
}

// Leave Balance
export interface LeaveBalanceDTO extends BaseDTO {
  employeeId?: number;
  employee?: MinimalEmployeeDTO;
  leaveTypeId?: number;
  leaveType?: LeaveTypeDTO;
  year: number;
  openingBalance?: number;
  earned?: number;
  used?: number;
  closingBalance?: number;
}

export interface MinimalLeaveBalanceDTO {
  leaveTypeId?: number;
  leaveTypeName?: string;
  openingBalance?: number;
  earned?: number;
  used?: number;
  closingBalance?: number;
}

// Request/Response types
export interface ApproveLeaveRequest {
  requestId: number;
  managerId: number;
  comment?: string;
}

export interface RejectLeaveRequest {
  requestId: number;
  managerId: number;
  comment?: string;
}
