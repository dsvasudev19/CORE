package com.dev.core.service.impl;

import com.dev.core.constants.EmployeeStatus;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Payroll;
import com.dev.core.domain.PayrollHistory;
import com.dev.core.dto.PayrollDTO;
import com.dev.core.dto.PayrollHistoryDTO;
import com.dev.core.dto.PayrollSummaryDTO;
import com.dev.core.mapper.PayrollMapper;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.PayrollHistoryRepository;
import com.dev.core.repository.PayrollRepository;
import com.dev.core.service.PayrollService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final PayrollHistoryRepository payrollHistoryRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollMapper payrollMapper;

    @Override
    @Transactional
    public PayrollDTO createPayroll(PayrollDTO payrollDTO) {
        log.info("Creating payroll for employee: {}", payrollDTO.getEmployeeId());

        Employee employee = employeeRepository.findById(payrollDTO.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + payrollDTO.getEmployeeId()));

        Payroll payroll = payrollMapper.toEntity(payrollDTO);
        payroll.setEmployee(employee);

        if (payroll.getStatus() == null) {
            payroll.setStatus("DRAFT");
        }

        if (payroll.getIsActive() == null) {
            payroll.setIsActive(true);
        }

        // Calculate salaries
        payroll.calculateNetSalary();

        Payroll savedPayroll = payrollRepository.save(payroll);

        // Create history entry
        createHistoryEntry(savedPayroll, "CREATED", null, null, "Payroll created");

        return payrollMapper.toDTO(savedPayroll);
    }

    @Override
    @Transactional
    public PayrollDTO updatePayroll(Long id, PayrollDTO payrollDTO) {
        log.info("Updating payroll: {}", id);

        Payroll existingPayroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        String previousStatus = existingPayroll.getStatus();
        BigDecimal previousNetSalary = existingPayroll.getNetSalary();

        // Update fields
        if (payrollDTO.getBasicSalary() != null) existingPayroll.setBasicSalary(payrollDTO.getBasicSalary());
        if (payrollDTO.getHra() != null) existingPayroll.setHra(payrollDTO.getHra());
        if (payrollDTO.getTransportAllowance() != null) existingPayroll.setTransportAllowance(payrollDTO.getTransportAllowance());
        if (payrollDTO.getMedicalAllowance() != null) existingPayroll.setMedicalAllowance(payrollDTO.getMedicalAllowance());
        if (payrollDTO.getSpecialAllowance() != null) existingPayroll.setSpecialAllowance(payrollDTO.getSpecialAllowance());
        if (payrollDTO.getOtherAllowances() != null) existingPayroll.setOtherAllowances(payrollDTO.getOtherAllowances());
        if (payrollDTO.getBonus() != null) existingPayroll.setBonus(payrollDTO.getBonus());
        if (payrollDTO.getOvertimePay() != null) existingPayroll.setOvertimePay(payrollDTO.getOvertimePay());

        if (payrollDTO.getProvidentFund() != null) existingPayroll.setProvidentFund(payrollDTO.getProvidentFund());
        if (payrollDTO.getProfessionalTax() != null) existingPayroll.setProfessionalTax(payrollDTO.getProfessionalTax());
        if (payrollDTO.getIncomeTax() != null) existingPayroll.setIncomeTax(payrollDTO.getIncomeTax());
        if (payrollDTO.getInsurance() != null) existingPayroll.setInsurance(payrollDTO.getInsurance());
        if (payrollDTO.getLoanDeduction() != null) existingPayroll.setLoanDeduction(payrollDTO.getLoanDeduction());
        if (payrollDTO.getOtherDeductions() != null) existingPayroll.setOtherDeductions(payrollDTO.getOtherDeductions());

        if (payrollDTO.getPaymentMode() != null) existingPayroll.setPaymentMode(payrollDTO.getPaymentMode());
        if (payrollDTO.getBankName() != null) existingPayroll.setBankName(payrollDTO.getBankName());
        if (payrollDTO.getAccountNumber() != null) existingPayroll.setAccountNumber(payrollDTO.getAccountNumber());
        if (payrollDTO.getIfscCode() != null) existingPayroll.setIfscCode(payrollDTO.getIfscCode());

        if (payrollDTO.getWorkingDays() != null) existingPayroll.setWorkingDays(payrollDTO.getWorkingDays());
        if (payrollDTO.getPresentDays() != null) existingPayroll.setPresentDays(payrollDTO.getPresentDays());
        if (payrollDTO.getLeaveDays() != null) existingPayroll.setLeaveDays(payrollDTO.getLeaveDays());
        if (payrollDTO.getAbsentDays() != null) existingPayroll.setAbsentDays(payrollDTO.getAbsentDays());
        if (payrollDTO.getOvertimeHours() != null) existingPayroll.setOvertimeHours(payrollDTO.getOvertimeHours());
        if (payrollDTO.getRemarks() != null) existingPayroll.setRemarks(payrollDTO.getRemarks());

        // Recalculate salaries
        existingPayroll.calculateNetSalary();

        Payroll updatedPayroll = payrollRepository.save(existingPayroll);

        // Create history entry
        createHistoryEntry(updatedPayroll, "UPDATED", previousStatus, previousNetSalary, "Payroll updated");

        return payrollMapper.toDTO(updatedPayroll);
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollDTO getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        return payrollMapper.toDTO(payroll);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDTO> getAllPayrolls(Long organizationId) {
        List<Payroll> payrolls = payrollRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
        return payrollMapper.toDTOList(payrolls);
    }

    @Override
    @Transactional
    public void deletePayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        payroll.setIsActive(false);
        payrollRepository.save(payroll);

        createHistoryEntry(payroll, "DELETED", payroll.getStatus(), null, "Payroll deleted");
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDTO> getEmployeePayrolls(Long employeeId) {
        List<Payroll> payrolls = payrollRepository.findByEmployeeIdAndIsActiveTrue(employeeId);
        return payrollMapper.toDTOList(payrolls);
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollDTO getEmployeePayrollByPeriod(Long employeeId, Integer month, Integer year) {
        return payrollRepository.findByEmployeeIdAndMonthAndYearAndIsActiveTrue(employeeId, month, year)
                .map(payrollMapper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDTO> getEmployeePayrollHistory(Long employeeId) {
        List<Payroll> payrolls = payrollRepository.findEmployeePayrollHistory(employeeId);
        return payrollMapper.toDTOList(payrolls);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDTO> getPayrollsByPeriod(Long organizationId, Integer month, Integer year) {
        List<Payroll> payrolls = payrollRepository.findByOrganizationAndPeriod(organizationId, month, year);
        return payrollMapper.toDTOList(payrolls);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDTO> getPayrollsByDateRange(Long organizationId, LocalDate startDate, LocalDate endDate) {
        List<Payroll> payrolls = payrollRepository.findByOrganizationIdAndEffectiveDateBetween(organizationId, startDate, endDate);
        return payrollMapper.toDTOList(payrolls);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDTO> getPayrollsByStatus(Long organizationId, String status) {
        List<Payroll> payrolls = payrollRepository.findByOrganizationIdAndStatus(organizationId, status);
        return payrollMapper.toDTOList(payrolls);
    }

    @Override
    @Transactional
    public PayrollDTO approvePayroll(Long id, Long approvedBy) {
        log.info("Approving payroll: {} by user: {}", id, approvedBy);

        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        String previousStatus = payroll.getStatus();
        payroll.setStatus("APPROVED");
        payroll.setApprovedBy(approvedBy);
        payroll.setApprovedAt(LocalDate.now());

        Payroll updatedPayroll = payrollRepository.save(payroll);

        createHistoryEntry(updatedPayroll, "APPROVED", previousStatus, null, "Payroll approved");

        return payrollMapper.toDTO(updatedPayroll);
    }

    @Override
    @Transactional
    public PayrollDTO rejectPayroll(Long id, String reason) {
        log.info("Rejecting payroll: {}", id);

        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        String previousStatus = payroll.getStatus();
        payroll.setStatus("REJECTED");
        payroll.setRemarks(reason);

        Payroll updatedPayroll = payrollRepository.save(payroll);

        createHistoryEntry(updatedPayroll, "REJECTED", previousStatus, null, "Payroll rejected: " + reason);

        return payrollMapper.toDTO(updatedPayroll);
    }

    @Override
    @Transactional
    public PayrollDTO markAsPaid(Long id, Long paidBy) {
        log.info("Marking payroll as paid: {} by user: {}", id, paidBy);

        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        if (!"APPROVED".equals(payroll.getStatus())) {
            throw new RuntimeException("Only approved payrolls can be marked as paid");
        }

        String previousStatus = payroll.getStatus();
        payroll.setStatus("PAID");
        payroll.setPaidBy(paidBy);
        payroll.setPaidAt(LocalDate.now());

        Payroll updatedPayroll = payrollRepository.save(payroll);

        createHistoryEntry(updatedPayroll, "PAID", previousStatus, null, "Payroll marked as paid");

        return payrollMapper.toDTO(updatedPayroll);
    }

    @Override
    @Transactional
    public PayrollDTO cancelPayroll(Long id, String reason) {
        log.info("Cancelling payroll: {}", id);

        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        String previousStatus = payroll.getStatus();
        payroll.setStatus("CANCELLED");
        payroll.setRemarks(reason);

        Payroll updatedPayroll = payrollRepository.save(payroll);

        createHistoryEntry(updatedPayroll, "CANCELLED", previousStatus, null, "Payroll cancelled: " + reason);

        return payrollMapper.toDTO(updatedPayroll);
    }

    @Override
    @Transactional
    public List<PayrollDTO> generateMonthlyPayrolls(Long organizationId, Integer month, Integer year) {
        log.info("Generating monthly payrolls for organization: {}, month: {}, year: {}", organizationId, month, year);

        // Get all active employees
        List<Employee> employees = employeeRepository.findByOrganizationIdAndStatus(
                organizationId, EmployeeStatus.ACTIVE);

        List<Payroll> generatedPayrolls = new ArrayList<>();

        for (Employee employee : employees) {
            // Check if payroll already exists for this period
            if (payrollRepository.findByEmployeeIdAndMonthAndYearAndIsActiveTrue(
                    employee.getId(), month, year).isPresent()) {
                log.info("Payroll already exists for employee: {} for period: {}/{}", 
                        employee.getEmployeeCode(), month, year);
                continue;
            }

            // Create new payroll (with default/base salary - should be configured per employee)
            Payroll payroll = new Payroll();
            payroll.setEmployee(employee);
            payroll.setOrganizationId(organizationId);
            payroll.setMonth(month);
            payroll.setYear(year);
            payroll.setEffectiveDate(LocalDate.of(year, month, 1));
            payroll.setStatus("DRAFT");
            payroll.setIsActive(true);
            payroll.setPayPeriod("MONTHLY");

            // Set default values (these should come from employee salary configuration)
            payroll.setBasicSalary(BigDecimal.ZERO);
            payroll.setWorkingDays(getWorkingDaysInMonth(month, year));

            payroll.calculateNetSalary();

            Payroll savedPayroll = payrollRepository.save(payroll);
            generatedPayrolls.add(savedPayroll);

            createHistoryEntry(savedPayroll, "GENERATED", null, null, "Payroll auto-generated");
        }

        return payrollMapper.toDTOList(generatedPayrolls);
    }

    @Override
    @Transactional
    public List<PayrollDTO> bulkApprovePayrolls(List<Long> payrollIds, Long approvedBy) {
        log.info("Bulk approving {} payrolls", payrollIds.size());

        List<Payroll> payrolls = payrollRepository.findAllById(payrollIds);
        List<Payroll> approvedPayrolls = new ArrayList<>();

        for (Payroll payroll : payrolls) {
            String previousStatus = payroll.getStatus();
            payroll.setStatus("APPROVED");
            payroll.setApprovedBy(approvedBy);
            payroll.setApprovedAt(LocalDate.now());

            Payroll updated = payrollRepository.save(payroll);
            approvedPayrolls.add(updated);

            createHistoryEntry(updated, "APPROVED", previousStatus, null, "Bulk approved");
        }

        return payrollMapper.toDTOList(approvedPayrolls);
    }

    @Override
    @Transactional
    public List<PayrollDTO> bulkMarkAsPaid(List<Long> payrollIds, Long paidBy) {
        log.info("Bulk marking {} payrolls as paid", payrollIds.size());

        List<Payroll> payrolls = payrollRepository.findAllById(payrollIds);
        List<Payroll> paidPayrolls = new ArrayList<>();

        for (Payroll payroll : payrolls) {
            if (!"APPROVED".equals(payroll.getStatus())) {
                log.warn("Skipping payroll {} - not approved", payroll.getId());
                continue;
            }

            String previousStatus = payroll.getStatus();
            payroll.setStatus("PAID");
            payroll.setPaidBy(paidBy);
            payroll.setPaidAt(LocalDate.now());

            Payroll updated = payrollRepository.save(payroll);
            paidPayrolls.add(updated);

            createHistoryEntry(updated, "PAID", previousStatus, null, "Bulk marked as paid");
        }

        return payrollMapper.toDTOList(paidPayrolls);
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollSummaryDTO getPayrollSummary(Long organizationId, Integer month, Integer year) {
        List<Payroll> payrolls = payrollRepository.findByOrganizationAndPeriod(organizationId, month, year);

        PayrollSummaryDTO summary = new PayrollSummaryDTO();
        summary.setMonth(month);
        summary.setYear(year);
        summary.setTotalEmployees((long) payrolls.size());

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalDeductions = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        long pending = 0;
        long approved = 0;
        long paid = 0;

        for (Payroll payroll : payrolls) {
            totalGross = totalGross.add(payroll.getGrossSalary() != null ? payroll.getGrossSalary() : BigDecimal.ZERO);
            totalDeductions = totalDeductions.add(payroll.getTotalDeductions() != null ? payroll.getTotalDeductions() : BigDecimal.ZERO);
            totalNet = totalNet.add(payroll.getNetSalary() != null ? payroll.getNetSalary() : BigDecimal.ZERO);

            switch (payroll.getStatus()) {
                case "PENDING":
                case "DRAFT":
                    pending++;
                    break;
                case "APPROVED":
                    approved++;
                    break;
                case "PAID":
                    paid++;
                    break;
            }
        }

        summary.setTotalGrossSalary(totalGross);
        summary.setTotalDeductions(totalDeductions);
        summary.setTotalNetSalary(totalNet);
        summary.setPendingApprovals(pending);
        summary.setApprovedPayrolls(approved);
        summary.setPaidPayrolls(paid);

        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollHistoryDTO> getPayrollHistory(Long payrollId) {
        List<PayrollHistory> history = payrollHistoryRepository.findByPayrollIdOrderByActionDateDesc(payrollId);
        return history.stream()
                .map(this::toHistoryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollHistoryDTO> getEmployeePayrollHistoryLogs(Long employeeId) {
        List<PayrollHistory> history = payrollHistoryRepository.findByEmployeeIdOrderByActionDateDesc(employeeId);
        return history.stream()
                .map(this::toHistoryDTO)
                .collect(Collectors.toList());
    }

    // Helper methods

    private void createHistoryEntry(Payroll payroll, String action, String previousStatus, 
                                     BigDecimal previousNetSalary, String remarks) {
        PayrollHistory history = new PayrollHistory();
        history.setPayrollId(payroll.getId());
        history.setEmployee(payroll.getEmployee());
        history.setOrganizationId(payroll.getOrganizationId());
        history.setAction(action);
        history.setActionBy(1L); // TODO: Get from security context
        history.setActionDate(LocalDate.now());
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(payroll.getStatus());
        history.setPreviousNetSalary(previousNetSalary);
        history.setNewNetSalary(payroll.getNetSalary());
        history.setRemarks(remarks);

        payrollHistoryRepository.save(history);
    }

    private PayrollHistoryDTO toHistoryDTO(PayrollHistory history) {
        PayrollHistoryDTO dto = new PayrollHistoryDTO();
        dto.setId(history.getId());
        dto.setPayrollId(history.getPayrollId());
        dto.setEmployeeId(history.getEmployee() != null ? history.getEmployee().getId() : null);
        dto.setAction(history.getAction());
        dto.setActionBy(history.getActionBy());
        dto.setActionDate(history.getActionDate());
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        dto.setPreviousNetSalary(history.getPreviousNetSalary());
        dto.setNewNetSalary(history.getNewNetSalary());
        dto.setRemarks(history.getRemarks());
        dto.setChanges(history.getChanges());
        dto.setOrganizationId(history.getOrganizationId());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }

    private Integer getWorkingDaysInMonth(Integer month, Integer year) {
        // Simple calculation - should be enhanced with holiday calendar
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.plusMonths(1).minusDays(1);
        int workingDays = 0;

        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            if (date.getDayOfWeek().getValue() < 6) { // Monday to Friday
                workingDays++;
            }
        }

        return workingDays;
    }
}
