package com.dev.core.domain.performance;

import jakarta.persistence.*;
import com.dev.core.domain.BaseEntity;
import lombok.*;

@Entity
@Table(name = "performance_reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"request_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PerformanceReview extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private PerformanceReviewRequest request;

    // core rating (1..5)
    @Column(nullable = false)
    private Integer rating;

    @Column(length = 2000)
    private String strengths;

    @Column(length = 2000)
    private String improvements;

    @Column(length = 2000)
    private String comments;

    @Column(length = 2000)
    private String nextQuarterGoals;
}
