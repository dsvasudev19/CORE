import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import employeeService from '../services/employee.service';
import { EmployeeDTO } from '../types/employee.types';

/**
 * Hook for fetching all employees
 */
export const useEmployees = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.employees.list(filters),
    queryFn: () => employeeService.getAllEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching a single employee
 */
export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
  });
};

/**
 * Hook for creating an employee
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<EmployeeDTO>) => employeeService.createEmployee(data),
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
    },
  });
};

/**
 * Hook for updating an employee
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmployeeDTO> }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific employee and list
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
    },
  });
};

/**
 * Hook for deleting an employee
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
    },
  });
};

/**
 * Hook for employee attendance
 */
export const useEmployeeAttendance = (id: number) => {
  return useQuery({
    queryKey: queryKeys.employees.attendance(id),
    queryFn: () => employeeService.getEmployeeAttendance(id),
    enabled: !!id,
  });
};
