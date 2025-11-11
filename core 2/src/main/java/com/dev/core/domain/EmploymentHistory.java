package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employment_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmploymentHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private String previousDepartment;
    private String previousDesignation;
    private String newDepartment;
    private String newDesignation;

    private LocalDate effectiveDate;
    private String remarks;
}
