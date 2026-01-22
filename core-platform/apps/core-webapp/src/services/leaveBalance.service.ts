import axios from 'axios';
import { LeaveBalanceDTO, MinimalLeaveBalanceDTO } from '../types/leave.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_URL}/api/leave-balances`;

export const leaveBalanceService = {
  // Get balance for a specific employee, leave type, and year
  getBalance: async (employeeId: number, leaveTypeId: number, year: number): Promise<LeaveBalanceDTO> => {
    const response = await axios.get<LeaveBalanceDTO>(`${BASE_URL}/${employeeId}/${leaveTypeId}/${year}`);
    return response.data;
  },

  // Get all balances for an employee in a specific year
  getAllBalances: async (employeeId: number, year: number): Promise<LeaveBalanceDTO[]> => {
    const response = await axios.get<LeaveBalanceDTO[]>(`${BASE_URL}/${employeeId}/year/${year}`);
    return response.data;
  },

  // Get minimal balances for an employee in a specific year
  getMinimalBalances: async (employeeId: number, year: number): Promise<MinimalLeaveBalanceDTO[]> => {
    const response = await axios.get<MinimalLeaveBalanceDTO[]>(`${BASE_URL}/minimal/${employeeId}/year/${year}`);
    return response.data;
  },

  // Initialize yearly balance for an employee
  initializeYearlyBalance: async (employeeId: number, year: number): Promise<void> => {
    await axios.post(`${BASE_URL}/initialize/${employeeId}/${year}`);
  }
};
