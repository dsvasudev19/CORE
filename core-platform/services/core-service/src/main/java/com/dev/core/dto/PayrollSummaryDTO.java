package com.dev.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for payroll summary and statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayrollSummaryDTO {
    private Long totalEmployees;
    private BigDecimal totalGrossSalary;
    private BigDecimal totalDeductions;
    private BigDecimal totalNetSalary;
    private Long pendingApprovals;
    private Long approvedPayrolls;
    private Long paidPayrolls;
    private Integer month;
    private Integer year;
}
