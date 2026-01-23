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
public class PayrollHistoryDTO {
    private Long id;
    private Long payrollId;
    private Long employeeId;
    private String action;
    private Long actionBy;
    private LocalDate actionDate;
    private String previousStatus;
    private String newStatus;
    private BigDecimal previousNetSalary;
    private BigDecimal newNetSalary;
    private String remarks;
    private String changes;
    private Long organizationId;
    private LocalDateTime createdAt;
}
