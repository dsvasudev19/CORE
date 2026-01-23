import axiosInstance from "../axiosInstance";
import type {
  PayrollDTO,
  PayrollHistoryDTO,
  PayrollSummaryDTO,
  CreatePayrollRequest,
} from "../types/payroll.types";

const PAYROLL_API_BASE = "/payroll";

const payrollService = {
  // CRUD Operations
  createPayroll: async (data: CreatePayrollRequest): Promise<PayrollDTO> => {
    const response = await axiosInstance.post(PAYROLL_API_BASE, data);
    return response.data;
  },

  updatePayroll: async (
    id: number,
    data: Partial<PayrollDTO>,
  ): Promise<PayrollDTO> => {
    const response = await axiosInstance.put(`${PAYROLL_API_BASE}/${id}`, data);
    return response.data;
  },

  getPayrollById: async (id: number): Promise<PayrollDTO> => {
    const response = await axiosInstance.get(`${PAYROLL_API_BASE}/${id}`);
    return response.data;
  },

  getAllPayrolls: async (organizationId: number): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/organization/${organizationId}`,
    );
    return response.data;
  },

  deletePayroll: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${PAYROLL_API_BASE}/${id}`);
  },

  // Employee Specific
  getEmployeePayrolls: async (employeeId: number): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/employee/${employeeId}`,
    );
    return response.data;
  },

  getEmployeePayrollByPeriod: async (
    employeeId: number,
    month: number,
    year: number,
  ): Promise<PayrollDTO> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/employee/${employeeId}/period`,
      {
        params: { month, year },
      },
    );
    return response.data;
  },

  getEmployeePayrollHistory: async (
    employeeId: number,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/employee/${employeeId}/history`,
    );
    return response.data;
  },

  // Period Specific
  getPayrollsByPeriod: async (
    organizationId: number,
    month: number,
    year: number,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/organization/${organizationId}/period`,
      {
        params: { month, year },
      },
    );
    return response.data;
  },

  getPayrollsByDateRange: async (
    organizationId: number,
    startDate: string,
    endDate: string,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/organization/${organizationId}/date-range`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },

  // Status Management
  getPayrollsByStatus: async (
    organizationId: number,
    status: string,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/organization/${organizationId}/status/${status}`,
    );
    return response.data;
  },

  approvePayroll: async (
    id: number,
    approvedBy: number,
  ): Promise<PayrollDTO> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/${id}/approve`,
      {
        approvedBy,
      },
    );
    return response.data;
  },

  rejectPayroll: async (id: number, reason: string): Promise<PayrollDTO> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/${id}/reject`,
      {
        reason,
      },
    );
    return response.data;
  },

  markAsPaid: async (id: number, paidBy: number): Promise<PayrollDTO> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/${id}/mark-paid`,
      { paidBy },
    );
    return response.data;
  },

  cancelPayroll: async (id: number, reason: string): Promise<PayrollDTO> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/${id}/cancel`,
      {
        reason,
      },
    );
    return response.data;
  },

  // Bulk Operations
  generateMonthlyPayrolls: async (
    organizationId: number,
    month: number,
    year: number,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/organization/${organizationId}/generate`,
      null,
      {
        params: { month, year },
      },
    );
    return response.data;
  },

  bulkApprovePayrolls: async (
    payrollIds: number[],
    approvedBy: number,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/bulk-approve`,
      {
        payrollIds,
        approvedBy,
      },
    );
    return response.data;
  },

  bulkMarkAsPaid: async (
    payrollIds: number[],
    paidBy: number,
  ): Promise<PayrollDTO[]> => {
    const response = await axiosInstance.post(
      `${PAYROLL_API_BASE}/bulk-mark-paid`,
      {
        payrollIds,
        paidBy,
      },
    );
    return response.data;
  },

  // Summary & Statistics
  getPayrollSummary: async (
    organizationId: number,
    month: number,
    year: number,
  ): Promise<PayrollSummaryDTO> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/organization/${organizationId}/summary`,
      {
        params: { month, year },
      },
    );
    return response.data;
  },

  // History
  getPayrollHistory: async (
    payrollId: number,
  ): Promise<PayrollHistoryDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/${payrollId}/history`,
    );
    return response.data;
  },

  getEmployeePayrollHistoryLogs: async (
    employeeId: number,
  ): Promise<PayrollHistoryDTO[]> => {
    const response = await axiosInstance.get(
      `${PAYROLL_API_BASE}/employee/${employeeId}/history-logs`,
    );
    return response.data;
  },
};

export default payrollService;
