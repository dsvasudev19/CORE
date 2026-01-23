import axiosInstance from "../axiosInstance";
import type {
  LeaveBalanceDTO,
  MinimalLeaveBalanceDTO,
} from "../types/leave.types";

const LEAVE_BALANCES_API_BASE = "/leave-balances";

export const leaveBalanceService = {
  // Get balance for a specific employee, leave type, and year
  getBalance: async (
    employeeId: number,
    leaveTypeId: number,
    year: number,
  ): Promise<LeaveBalanceDTO> => {
    const response = await axiosInstance.get<LeaveBalanceDTO>(
      `${LEAVE_BALANCES_API_BASE}/${employeeId}/${leaveTypeId}/${year}`,
    );
    return response.data;
  },

  // Get all balances for an employee in a specific year
  getAllBalances: async (
    employeeId: number,
    year: number,
  ): Promise<LeaveBalanceDTO[]> => {
    const response = await axiosInstance.get<LeaveBalanceDTO[]>(
      `${LEAVE_BALANCES_API_BASE}/${employeeId}/year/${year}`,
    );
    return response.data;
  },

  // Get minimal balances for an employee in a specific year
  getMinimalBalances: async (
    employeeId: number,
    year: number,
  ): Promise<MinimalLeaveBalanceDTO[]> => {
    const response = await axiosInstance.get<MinimalLeaveBalanceDTO[]>(
      `${LEAVE_BALANCES_API_BASE}/minimal/${employeeId}/year/${year}`,
    );
    return response.data;
  },

  // Initialize yearly balance for an employee
  initializeYearlyBalance: async (
    employeeId: number,
    year: number,
  ): Promise<void> => {
    await axiosInstance.post(
      `${LEAVE_BALANCES_API_BASE}/initialize/${employeeId}/${year}`,
    );
  },
};

export default leaveBalanceService;
