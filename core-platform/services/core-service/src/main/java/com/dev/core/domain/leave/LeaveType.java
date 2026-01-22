package com.dev.core.domain.leave;

import com.dev.core.domain.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leave_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveType extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;  // e.g., "SICK", "CASUAL", "EARNED"

    @Column(name = "annual_limit")
    private Integer annualLimit;   // Yearly quota

    @Column(name = "monthly_limit")
    private Integer monthlyLimit;

    @Column(name = "quarterly_limit")
    private Integer quarterlyLimit;

    @Column(name = "is_earned_leave")
    private Boolean earnedLeave = false;

    @Column(name = "carry_forward")
    private Boolean carryForward = false;

    @Column(name = "max_carry_forward")
    private Integer maxCarryForward = 15;
}
