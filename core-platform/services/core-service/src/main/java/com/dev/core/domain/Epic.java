package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "epics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Epic extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EpicStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "epic", cascade = CascadeType.ALL)
    private Set<Issue> issues;

    public enum EpicStatus {
        PLANNING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
