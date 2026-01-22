package com.dev.core.domain.performance;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import com.dev.core.domain.BaseEntity;
import lombok.*;

@Entity
@Table(name = "performance_cycles", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"year","quarter","organization_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PerformanceCycle extends BaseEntity {

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer quarter;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;
}
