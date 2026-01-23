package com.dev.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayrollDTO {
    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String designation;
    private String department;
    
    // Salary Components
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal transportAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal specialAllowance;
    private BigDecimal otherAllowances;
    private BigDecimal bonus;
    private BigDecimal overtimePay;
    
    // Deductions
    private BigDecimal providentFund;
    private BigDecimal professionalTax;
    private BigDecimal incomeTax;
    private BigDecimal insurance;
    private BigDecimal loanDeduction;
    private BigDecimal otherDeductions;
    
    // Calculated Fields
    private BigDecimal grossSalary;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    
    // Payment Details
    private String paymentMode;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    
    // Period Information
    private String payPeriod;
    private LocalDate effectiveDate;
    private LocalDate payDate;
    private Integer month;
    private Integer year;
    
    // Status
    private String status;
    private Long approvedBy;
    private LocalDate approvedAt;
    private Long paidBy;
    private LocalDate paidAt;
    
    // Additional Information
    private Integer workingDays;
    private Integer presentDays;
    private Integer leaveDays;
    private Integer absentDays;
    private BigDecimal overtimeHours;
    private String remarks;
    
    private Boolean isActive;
    private Long organizationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
