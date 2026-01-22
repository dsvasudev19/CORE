package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "sprints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Sprint extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String goal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SprintStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "sprint", cascade = CascadeType.ALL)
    private Set<Issue> issues;

    public enum SprintStatus {
        PLANNING,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }
}
