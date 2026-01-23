package com.dev.core.service;

import com.dev.core.dto.PayrollDTO;
import com.dev.core.dto.PayrollHistoryDTO;
import com.dev.core.dto.PayrollSummaryDTO;

import java.time.LocalDate;
import java.util.List;

public interface PayrollService {

    // CRUD Operations
    PayrollDTO createPayroll(PayrollDTO payrollDTO);

    PayrollDTO updatePayroll(Long id, PayrollDTO payrollDTO);

    PayrollDTO getPayrollById(Long id);

    List<PayrollDTO> getAllPayrolls(Long organizationId);

    void deletePayroll(Long id);

    // Employee Specific
    List<PayrollDTO> getEmployeePayrolls(Long employeeId);

    PayrollDTO getEmployeePayrollByPeriod(Long employeeId, Integer month, Integer year);

    List<PayrollDTO> getEmployeePayrollHistory(Long employeeId);

    // Period Specific
    List<PayrollDTO> getPayrollsByPeriod(Long organizationId, Integer month, Integer year);

    List<PayrollDTO> getPayrollsByDateRange(Long organizationId, LocalDate startDate, LocalDate endDate);

    // Status Management
    List<PayrollDTO> getPayrollsByStatus(Long organizationId, String status);

    PayrollDTO approvePayroll(Long id, Long approvedBy);

    PayrollDTO rejectPayroll(Long id, String reason);

    PayrollDTO markAsPaid(Long id, Long paidBy);

    PayrollDTO cancelPayroll(Long id, String reason);

    // Bulk Operations
    List<PayrollDTO> generateMonthlyPayrolls(Long organizationId, Integer month, Integer year);

    List<PayrollDTO> bulkApprovePayrolls(List<Long> payrollIds, Long approvedBy);

    List<PayrollDTO> bulkMarkAsPaid(List<Long> payrollIds, Long paidBy);

    // Summary & Statistics
    PayrollSummaryDTO getPayrollSummary(Long organizationId, Integer month, Integer year);

    // History
    List<PayrollHistoryDTO> getPayrollHistory(Long payrollId);

    List<PayrollHistoryDTO> getEmployeePayrollHistoryLogs(Long employeeId);
}
