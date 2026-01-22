package com.dev.core.domain;

import com.dev.core.constants.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "project_phases", indexes = {
        @Index(columnList = "project_id"),
        @Index(columnList = "organization_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectPhase extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private ProjectStatus status = ProjectStatus.PLANNING;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "order_index")
    private Integer orderIndex;
}
