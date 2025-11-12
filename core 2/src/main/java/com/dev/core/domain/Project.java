package com.dev.core.domain;

import com.dev.core.constants.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projects", indexes = {
        @Index(columnList = "organization_id"),
        @Index(columnList = "client_id"),
        @Index(columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String code; // Optional, unique per org

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private ProjectStatus status = ProjectStatus.DRAFT;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDate actualDeliveryDate;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectPhase> phases;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectFile> files;
}
