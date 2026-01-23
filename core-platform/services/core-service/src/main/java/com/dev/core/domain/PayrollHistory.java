package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * PayrollHistory entity for tracking payroll changes and payment history
 */
@Entity
@Table(name = "payroll_history",
       indexes = {
           @Index(columnList = "payroll_id"),
           @Index(columnList = "employee_id"),
           @Index(columnList = "organization_id"),
           @Index(columnList = "action_date")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayrollHistory extends BaseEntity {

    @Column(name = "payroll_id", nullable = false)
    private Long payrollId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "action", nullable = false, length = 50)
    private String action; // CREATED, UPDATED, APPROVED, PAID, CANCELLED

    @Column(name = "action_by", nullable = false)
    private Long actionBy;

    @Column(name = "action_date", nullable = false)
    private LocalDate actionDate;

    @Column(name = "previous_status", length = 20)
    private String previousStatus;

    @Column(name = "new_status", length = 20)
    private String newStatus;

    @Column(name = "previous_net_salary", precision = 15, scale = 2)
    private BigDecimal previousNetSalary;

    @Column(name = "new_net_salary", precision = 15, scale = 2)
    private BigDecimal newNetSalary;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "changes", columnDefinition = "TEXT")
    private String changes; // JSON string of what changed
}
