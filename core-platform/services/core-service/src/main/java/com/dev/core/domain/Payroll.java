package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payroll entity representing employee salary information
 */
@Entity
@Table(name = "payroll",
       indexes = {
           @Index(columnList = "employee_id"),
           @Index(columnList = "organization_id"),
           @Index(columnList = "effective_date"),
           @Index(columnList = "status")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payroll extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    // Salary Components
    @Column(name = "basic_salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal basicSalary;

    @Column(name = "hra", precision = 15, scale = 2)
    private BigDecimal hra; // House Rent Allowance

    @Column(name = "transport_allowance", precision = 15, scale = 2)
    private BigDecimal transportAllowance;

    @Column(name = "medical_allowance", precision = 15, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(name = "special_allowance", precision = 15, scale = 2)
    private BigDecimal specialAllowance;

    @Column(name = "other_allowances", precision = 15, scale = 2)
    private BigDecimal otherAllowances;

    @Column(name = "bonus", precision = 15, scale = 2)
    private BigDecimal bonus;

    @Column(name = "overtime_pay", precision = 15, scale = 2)
    private BigDecimal overtimePay;

    // Deductions
    @Column(name = "provident_fund", precision = 15, scale = 2)
    private BigDecimal providentFund;

    @Column(name = "professional_tax", precision = 15, scale = 2)
    private BigDecimal professionalTax;

    @Column(name = "income_tax", precision = 15, scale = 2)
    private BigDecimal incomeTax;

    @Column(name = "insurance", precision = 15, scale = 2)
    private BigDecimal insurance;

    @Column(name = "loan_deduction", precision = 15, scale = 2)
    private BigDecimal loanDeduction;

    @Column(name = "other_deductions", precision = 15, scale = 2)
    private BigDecimal otherDeductions;

    // Calculated Fields
    @Column(name = "gross_salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "total_deductions", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal netSalary;

    // Payment Details
    @Column(name = "payment_mode", length = 50)
    private String paymentMode; // BANK_TRANSFER, CASH, CHEQUE

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "account_number", length = 50)
    private String accountNumber;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    // Period Information
    @Column(name = "pay_period", length = 20)
    private String payPeriod; // MONTHLY, BI_WEEKLY, WEEKLY

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "pay_date")
    private LocalDate payDate;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "year", nullable = false)
    private Integer year;

    // Status
    @Column(name = "status", nullable = false, length = 20)
    private String status; // DRAFT, PENDING, APPROVED, PAID, CANCELLED

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDate approvedAt;

    @Column(name = "paid_by")
    private Long paidBy;

    @Column(name = "paid_at")
    private LocalDate paidAt;

    // Additional Information
    @Column(name = "working_days")
    private Integer workingDays;

    @Column(name = "present_days")
    private Integer presentDays;

    @Column(name = "leave_days")
    private Integer leaveDays;

    @Column(name = "absent_days")
    private Integer absentDays;

    @Column(name = "overtime_hours", precision = 10, scale = 2)
    private BigDecimal overtimeHours;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Helper methods
    public void calculateGrossSalary() {
        this.grossSalary = basicSalary
            .add(hra != null ? hra : BigDecimal.ZERO)
            .add(transportAllowance != null ? transportAllowance : BigDecimal.ZERO)
            .add(medicalAllowance != null ? medicalAllowance : BigDecimal.ZERO)
            .add(specialAllowance != null ? specialAllowance : BigDecimal.ZERO)
            .add(otherAllowances != null ? otherAllowances : BigDecimal.ZERO)
            .add(bonus != null ? bonus : BigDecimal.ZERO)
            .add(overtimePay != null ? overtimePay : BigDecimal.ZERO);
    }

    public void calculateTotalDeductions() {
        this.totalDeductions = (providentFund != null ? providentFund : BigDecimal.ZERO)
            .add(professionalTax != null ? professionalTax : BigDecimal.ZERO)
            .add(incomeTax != null ? incomeTax : BigDecimal.ZERO)
            .add(insurance != null ? insurance : BigDecimal.ZERO)
            .add(loanDeduction != null ? loanDeduction : BigDecimal.ZERO)
            .add(otherDeductions != null ? otherDeductions : BigDecimal.ZERO);
    }

    public void calculateNetSalary() {
        calculateGrossSalary();
        calculateTotalDeductions();
        this.netSalary = this.grossSalary.subtract(this.totalDeductions);
    }
}
