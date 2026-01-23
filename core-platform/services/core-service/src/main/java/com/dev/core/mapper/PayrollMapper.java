package com.dev.core.mapper;

import com.dev.core.domain.Payroll;
import com.dev.core.dto.PayrollDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PayrollMapper {

    public PayrollDTO toDTO(Payroll payroll) {
        if (payroll == null) {
            return null;
        }

        PayrollDTO dto = new PayrollDTO();
        dto.setId(payroll.getId());
        dto.setEmployeeId(payroll.getEmployee() != null ? payroll.getEmployee().getId() : null);
        dto.setEmployeeCode(payroll.getEmployee() != null ? payroll.getEmployee().getEmployeeCode() : null);
        dto.setEmployeeName(payroll.getEmployee() != null ? payroll.getEmployee().getFullName() : null);
        dto.setDesignation(payroll.getEmployee() != null && payroll.getEmployee().getDesignation() != null 
            ? payroll.getEmployee().getDesignation().getTitle() : null);
        dto.setDepartment(payroll.getEmployee() != null && payroll.getEmployee().getDepartment() != null 
            ? payroll.getEmployee().getDepartment().getName() : null);

        // Salary Components
        dto.setBasicSalary(payroll.getBasicSalary());
        dto.setHra(payroll.getHra());
        dto.setTransportAllowance(payroll.getTransportAllowance());
        dto.setMedicalAllowance(payroll.getMedicalAllowance());
        dto.setSpecialAllowance(payroll.getSpecialAllowance());
        dto.setOtherAllowances(payroll.getOtherAllowances());
        dto.setBonus(payroll.getBonus());
        dto.setOvertimePay(payroll.getOvertimePay());

        // Deductions
        dto.setProvidentFund(payroll.getProvidentFund());
        dto.setProfessionalTax(payroll.getProfessionalTax());
        dto.setIncomeTax(payroll.getIncomeTax());
        dto.setInsurance(payroll.getInsurance());
        dto.setLoanDeduction(payroll.getLoanDeduction());
        dto.setOtherDeductions(payroll.getOtherDeductions());

        // Calculated Fields
        dto.setGrossSalary(payroll.getGrossSalary());
        dto.setTotalDeductions(payroll.getTotalDeductions());
        dto.setNetSalary(payroll.getNetSalary());

        // Payment Details
        dto.setPaymentMode(payroll.getPaymentMode());
        dto.setBankName(payroll.getBankName());
        dto.setAccountNumber(payroll.getAccountNumber());
        dto.setIfscCode(payroll.getIfscCode());

        // Period Information
        dto.setPayPeriod(payroll.getPayPeriod());
        dto.setEffectiveDate(payroll.getEffectiveDate());
        dto.setPayDate(payroll.getPayDate());
        dto.setMonth(payroll.getMonth());
        dto.setYear(payroll.getYear());

        // Status
        dto.setStatus(payroll.getStatus());
        dto.setApprovedBy(payroll.getApprovedBy());
        dto.setApprovedAt(payroll.getApprovedAt());
        dto.setPaidBy(payroll.getPaidBy());
        dto.setPaidAt(payroll.getPaidAt());

        // Additional Information
        dto.setWorkingDays(payroll.getWorkingDays());
        dto.setPresentDays(payroll.getPresentDays());
        dto.setLeaveDays(payroll.getLeaveDays());
        dto.setAbsentDays(payroll.getAbsentDays());
        dto.setOvertimeHours(payroll.getOvertimeHours());
        dto.setRemarks(payroll.getRemarks());

        dto.setIsActive(payroll.getIsActive());
        dto.setOrganizationId(payroll.getOrganizationId());
        dto.setCreatedAt(payroll.getCreatedAt());
        dto.setUpdatedAt(payroll.getUpdatedAt());

        return dto;
    }

    public List<PayrollDTO> toDTOList(List<Payroll> payrolls) {
        if (payrolls == null) {
            return null;
        }
        return payrolls.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Payroll toEntity(PayrollDTO dto) {
        if (dto == null) {
            return null;
        }

        Payroll payroll = new Payroll();
        payroll.setId(dto.getId());
        // Note: Employee relationship should be set by the service layer

        // Salary Components
        payroll.setBasicSalary(dto.getBasicSalary());
        payroll.setHra(dto.getHra());
        payroll.setTransportAllowance(dto.getTransportAllowance());
        payroll.setMedicalAllowance(dto.getMedicalAllowance());
        payroll.setSpecialAllowance(dto.getSpecialAllowance());
        payroll.setOtherAllowances(dto.getOtherAllowances());
        payroll.setBonus(dto.getBonus());
        payroll.setOvertimePay(dto.getOvertimePay());

        // Deductions
        payroll.setProvidentFund(dto.getProvidentFund());
        payroll.setProfessionalTax(dto.getProfessionalTax());
        payroll.setIncomeTax(dto.getIncomeTax());
        payroll.setInsurance(dto.getInsurance());
        payroll.setLoanDeduction(dto.getLoanDeduction());
        payroll.setOtherDeductions(dto.getOtherDeductions());

        // Payment Details
        payroll.setPaymentMode(dto.getPaymentMode());
        payroll.setBankName(dto.getBankName());
        payroll.setAccountNumber(dto.getAccountNumber());
        payroll.setIfscCode(dto.getIfscCode());

        // Period Information
        payroll.setPayPeriod(dto.getPayPeriod());
        payroll.setEffectiveDate(dto.getEffectiveDate());
        payroll.setPayDate(dto.getPayDate());
        payroll.setMonth(dto.getMonth());
        payroll.setYear(dto.getYear());

        // Status
        payroll.setStatus(dto.getStatus());
        payroll.setApprovedBy(dto.getApprovedBy());
        payroll.setApprovedAt(dto.getApprovedAt());
        payroll.setPaidBy(dto.getPaidBy());
        payroll.setPaidAt(dto.getPaidAt());

        // Additional Information
        payroll.setWorkingDays(dto.getWorkingDays());
        payroll.setPresentDays(dto.getPresentDays());
        payroll.setLeaveDays(dto.getLeaveDays());
        payroll.setAbsentDays(dto.getAbsentDays());
        payroll.setOvertimeHours(dto.getOvertimeHours());
        payroll.setRemarks(dto.getRemarks());

        payroll.setIsActive(dto.getIsActive());
        payroll.setOrganizationId(dto.getOrganizationId());

        // Calculate salaries
        payroll.calculateNetSalary();

        return payroll;
    }
}
