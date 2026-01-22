package com.dev.core.domain;

import com.dev.core.constants.ProjectActivityType;
import com.dev.core.model.MinimalEmployeeDTO;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "project_activities",
    indexes = {
        @Index(columnList = "project_id"),
        @Index(columnList = "performed_by"),
        @Index(columnList = "activity_type"),
        @Index(columnList = "created_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectActivity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", length = 60, nullable = false)
    private ProjectActivityType activityType;

    @Column(name = "performed_by", nullable = false)
    private Long performedBy;

    @Column(name = "summary", length = 500)
    private String summary;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;
    
}
