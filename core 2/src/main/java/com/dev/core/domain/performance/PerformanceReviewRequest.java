package com.dev.core.domain.performance;

import java.time.LocalDateTime;

import com.dev.core.constants.ReviewStatus;
import com.dev.core.constants.ReviewType;
import com.dev.core.domain.BaseEntity;
import com.dev.core.domain.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "performance_review_requests",
       indexes = {@Index(columnList = "cycle_id"), @Index(columnList = "reviewer_id"), @Index(columnList = "employee_id")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PerformanceReviewRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private PerformanceCycle cycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Employee reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewType type; // MANAGER, PEER

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewStatus status = ReviewStatus.PENDING;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(length = 255)
    private String note; // optional instruction for reviewer
}
