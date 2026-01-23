import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { leaveRequestService } from "../services/leaveRequest.service";
import { leaveTypeService } from "../services/leaveType.service";
import { leaveBalanceService } from "../services/leaveBalance.service";

/**
 * Hook for fetching leave requests
 */
export const useLeaveRequests = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.leave.requests.list(filters),
    queryFn: () => leaveRequestService.getAllLeaveRequests(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for fetching employee leave requests
 */
export const useEmployeeLeaveRequests = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.leave.requests.employee(userId),
    queryFn: () => leaveRequestService.getEmployeeLeaveRequests(userId),
    enabled: !!userId,
  });
};

/**
 * Hook for fetching a single leave request
 */
export const useLeaveRequest = (id: number) => {
  return useQuery({
    queryKey: queryKeys.leave.requests.detail(id),
    queryFn: () => leaveRequestService.getLeaveRequestById(id),
    enabled: !!id,
  });
};

/**
 * Hook for fetching leave types
 */
export const useLeaveTypes = () => {
  return useQuery({
    queryKey: queryKeys.leave.types,
    queryFn: () => leaveTypeService.getAllLeaveTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes (rarely changes)
  });
};

/**
 * Hook for fetching leave balances
 */
export const useLeaveBalances = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.leave.balances(userId),
    queryFn: () => leaveBalanceService.getEmployeeLeaveBalances(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a leave request
 */
export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => leaveRequestService.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.requests.all });
    },
  });
};

/**
 * Hook for updating a leave request
 */
export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      leaveRequestService.updateLeaveRequest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leave.requests.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.requests.all });
    },
  });
};

/**
 * Hook for approving a leave request
 */
export const useApproveLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveRequestService.approveLeaveRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leave.requests.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.requests.all });
    },
  });
};

/**
 * Hook for rejecting a leave request
 */
export const useRejectLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      leaveRequestService.rejectLeaveRequest(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leave.requests.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.requests.all });
    },
  });
};

/**
 * Hook for canceling a leave request
 */
export const useCancelLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveRequestService.cancelLeaveRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leave.requests.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.requests.all });
    },
  });
};


