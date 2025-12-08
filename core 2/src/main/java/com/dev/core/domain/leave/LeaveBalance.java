package com.dev.core.domain.leave;

import com.dev.core.domain.BaseEntity;
import com.dev.core.domain.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leave_balances",
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id","leave_type_id","year"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id")
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "opening_balance")
    private Integer openingBalance = 0;

    @Column(name = "earned")
    private Integer earned = 0;

    @Column(name = "used")
    private Integer used = 0;

    @Column(name = "closing_balance")
    private Integer closingBalance = 0;
}
