package com.dev.core.controller;

import com.dev.core.dto.PayrollDTO;
import com.dev.core.dto.PayrollHistoryDTO;
import com.dev.core.dto.PayrollSummaryDTO;
import com.dev.core.service.PayrollService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    /**
     * Create a new payroll
     */
    @PostMapping
    public ResponseEntity<PayrollDTO> createPayroll(@RequestBody PayrollDTO payrollDTO) {
        log.info("Creating payroll for employee: {}", payrollDTO.getEmployeeId());
        PayrollDTO created = payrollService.createPayroll(payrollDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing payroll
     */
    @PutMapping("/{id}")
    public ResponseEntity<PayrollDTO> updatePayroll(@PathVariable Long id, @RequestBody PayrollDTO payrollDTO) {
        log.info("Updating payroll: {}", id);
        PayrollDTO updated = payrollService.updatePayroll(id, payrollDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get payroll by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PayrollDTO> getPayrollById(@PathVariable Long id) {
        PayrollDTO payroll = payrollService.getPayrollById(id);
        return ResponseEntity.ok(payroll);
    }

    /**
     * Get all payrolls for an organization
     */
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<PayrollDTO>> getAllPayrolls(@PathVariable Long organizationId) {
        List<PayrollDTO> payrolls = payrollService.getAllPayrolls(organizationId);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Delete a payroll (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all payrolls for an employee
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollDTO>> getEmployeePayrolls(@PathVariable Long employeeId) {
        List<PayrollDTO> payrolls = payrollService.getEmployeePayrolls(employeeId);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Get employee payroll for a specific period
     */
    @GetMapping("/employee/{employeeId}/period")
    public ResponseEntity<PayrollDTO> getEmployeePayrollByPeriod(
            @PathVariable Long employeeId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        PayrollDTO payroll = payrollService.getEmployeePayrollByPeriod(employeeId, month, year);
        return ResponseEntity.ok(payroll);
    }

    /**
     * Get employee payroll history
     */
    @GetMapping("/employee/{employeeId}/history")
    public ResponseEntity<List<PayrollDTO>> getEmployeePayrollHistory(@PathVariable Long employeeId) {
        List<PayrollDTO> history = payrollService.getEmployeePayrollHistory(employeeId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get payrolls by period
     */
    @GetMapping("/organization/{organizationId}/period")
    public ResponseEntity<List<PayrollDTO>> getPayrollsByPeriod(
            @PathVariable Long organizationId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        List<PayrollDTO> payrolls = payrollService.getPayrollsByPeriod(organizationId, month, year);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Get payrolls by date range
     */
    @GetMapping("/organization/{organizationId}/date-range")
    public ResponseEntity<List<PayrollDTO>> getPayrollsByDateRange(
            @PathVariable Long organizationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PayrollDTO> payrolls = payrollService.getPayrollsByDateRange(organizationId, startDate, endDate);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Get payrolls by status
     */
    @GetMapping("/organization/{organizationId}/status/{status}")
    public ResponseEntity<List<PayrollDTO>> getPayrollsByStatus(
            @PathVariable Long organizationId,
            @PathVariable String status) {
        List<PayrollDTO> payrolls = payrollService.getPayrollsByStatus(organizationId, status);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Approve a payroll
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<PayrollDTO> approvePayroll(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        Long approvedBy = request.get("approvedBy");
        PayrollDTO approved = payrollService.approvePayroll(id, approvedBy);
        return ResponseEntity.ok(approved);
    }

    /**
     * Reject a payroll
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<PayrollDTO> rejectPayroll(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        PayrollDTO rejected = payrollService.rejectPayroll(id, reason);
        return ResponseEntity.ok(rejected);
    }

    /**
     * Mark payroll as paid
     */
    @PostMapping("/{id}/mark-paid")
    public ResponseEntity<PayrollDTO> markAsPaid(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        Long paidBy = request.get("paidBy");
        PayrollDTO paid = payrollService.markAsPaid(id, paidBy);
        return ResponseEntity.ok(paid);
    }

    /**
     * Cancel a payroll
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<PayrollDTO> cancelPayroll(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        PayrollDTO cancelled = payrollService.cancelPayroll(id, reason);
        return ResponseEntity.ok(cancelled);
    }

    /**
     * Generate monthly payrolls for all employees
     */
    @PostMapping("/organization/{organizationId}/generate")
    public ResponseEntity<List<PayrollDTO>> generateMonthlyPayrolls(
            @PathVariable Long organizationId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        log.info("Generating monthly payrolls for organization: {}, month: {}, year: {}", 
                organizationId, month, year);
        List<PayrollDTO> generated = payrollService.generateMonthlyPayrolls(organizationId, month, year);
        return ResponseEntity.status(HttpStatus.CREATED).body(generated);
    }

    /**
     * Bulk approve payrolls
     */
    @PostMapping("/bulk-approve")
    public ResponseEntity<List<PayrollDTO>> bulkApprovePayrolls(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Long> payrollIds = (List<Long>) request.get("payrollIds");
        Long approvedBy = ((Number) request.get("approvedBy")).longValue();
        
        List<PayrollDTO> approved = payrollService.bulkApprovePayrolls(payrollIds, approvedBy);
        return ResponseEntity.ok(approved);
    }

    /**
     * Bulk mark as paid
     */
    @PostMapping("/bulk-mark-paid")
    public ResponseEntity<List<PayrollDTO>> bulkMarkAsPaid(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Long> payrollIds = (List<Long>) request.get("payrollIds");
        Long paidBy = ((Number) request.get("paidBy")).longValue();
        
        List<PayrollDTO> paid = payrollService.bulkMarkAsPaid(payrollIds, paidBy);
        return ResponseEntity.ok(paid);
    }

    /**
     * Get payroll summary for a period
     */
    @GetMapping("/organization/{organizationId}/summary")
    public ResponseEntity<PayrollSummaryDTO> getPayrollSummary(
            @PathVariable Long organizationId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        PayrollSummaryDTO summary = payrollService.getPayrollSummary(organizationId, month, year);
        return ResponseEntity.ok(summary);
    }

    /**
     * Get payroll history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<List<PayrollHistoryDTO>> getPayrollHistory(@PathVariable Long id) {
        List<PayrollHistoryDTO> history = payrollService.getPayrollHistory(id);
        return ResponseEntity.ok(history);
    }

    /**
     * Get employee payroll history logs
     */
    @GetMapping("/employee/{employeeId}/history-logs")
    public ResponseEntity<List<PayrollHistoryDTO>> getEmployeePayrollHistoryLogs(@PathVariable Long employeeId) {
        List<PayrollHistoryDTO> history = payrollService.getEmployeePayrollHistoryLogs(employeeId);
        return ResponseEntity.ok(history);
    }
}
