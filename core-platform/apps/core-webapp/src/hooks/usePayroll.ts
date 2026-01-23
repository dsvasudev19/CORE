import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import payrollService from "../services/payroll.service";
import type { CreatePayrollRequest } from "../types/payroll.types";

export const usePayrolls = (organizationId: number) => {
  return useQuery({
    queryKey: queryKeys.payroll.list({ organizationId }),
    queryFn: () => payrollService.getAllPayrolls(organizationId),
    enabled: !!organizationId,
  });
};

export const usePayroll = (id: number) => {
  return useQuery({
    queryKey: queryKeys.payroll.detail(id),
    queryFn: () => payrollService.getPayrollById(id),
    enabled: !!id,
  });
};

export const useEmployeePayrolls = (employeeId: number) => {
  return useQuery({
    queryKey: queryKeys.payroll.employee(employeeId),
    queryFn: () => payrollService.getEmployeePayrolls(employeeId),
    enabled: !!employeeId,
  });
};

export const usePayrollsByPeriod = (
  organizationId: number,
  month: number,
  year: number,
) => {
  return useQuery({
    queryKey: queryKeys.payroll.period(organizationId, month, year),
    queryFn: () =>
      payrollService.getPayrollsByPeriod(organizationId, month, year),
    enabled: !!organizationId && !!month && !!year,
  });
};

export const usePayrollSummary = (
  organizationId: number,
  month: number,
  year: number,
) => {
  return useQuery({
    queryKey: queryKeys.payroll.summary(organizationId, month, year),
    queryFn: () =>
      payrollService.getPayrollSummary(organizationId, month, year),
    enabled: !!organizationId && !!month && !!year,
  });
};

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePayrollRequest) =>
      payrollService.createPayroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreatePayrollRequest>;
    }) => payrollService.updatePayroll(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payroll.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};

export const useApprovePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
      payrollService.approvePayroll(id, approvedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payroll.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};

export const useRejectPayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      payrollService.rejectPayroll(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payroll.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};

export const useMarkPayrollAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paidBy }: { id: number; paidBy: number }) =>
      payrollService.markAsPaid(id, paidBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payroll.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};

export const useGenerateMonthlyPayrolls = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      month,
      year,
    }: {
      organizationId: number;
      month: number;
      year: number;
    }) => payrollService.generateMonthlyPayrolls(organizationId, month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};

export const useBulkApprovePayrolls = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payrollIds,
      approvedBy,
    }: {
      payrollIds: number[];
      approvedBy: number;
    }) => payrollService.bulkApprovePayrolls(payrollIds, approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payroll.all });
    },
  });
};
