export interface LeaveType {
  id: number;
  name: string;
  annualLimit: number | null;
  monthlyLimit: number | null;
  quarterlyLimit: number | null;
  earnedLeave: boolean;
  carryForward: boolean;
  maxCarryForward: number | null;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveTypeDTO {
  name: string;
  annualLimit?: number;
  monthlyLimit?: number;
  quarterlyLimit?: number;
  earnedLeave?: boolean;
  carryForward?: boolean;
  maxCarryForward?: number;
  organizationId: number;
}

export interface MinimalLeaveType {
  id: number;
  name: string;
}
