package com.dev.core.domain;
//
//import java.time.LocalDate;
//import java.util.List;
//
//import com.dev.core.constants.ProjectStatus;
//import com.dev.core.constants.ProjectType;
//
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.Index;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.OneToMany;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name = "projects", indexes = {
//        @Index(columnList = "organization_id"),
//        @Index(columnList = "client_id"),
//        @Index(columnList = "status")
//})
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Project extends BaseEntity {
//
//    @Column(nullable = false, length = 200)
//    private String name;
//
//    @Column(length = 100)
//    private String code; // Optional, unique per org
//
//    @Column(length = 2000)
//    private String description;
//
//    @Enumerated(EnumType.STRING)
//    @Column(length = 30, nullable = false)
//    private ProjectStatus status = ProjectStatus.DRAFT;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "client_id", nullable = true)
//    private Client client; // NULL → Internal Project, NOT NULL → External Project
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "project_type", nullable = false, length = 20)
//    private ProjectType projectType = ProjectType.INTERNAL;
//
//    @Column(name = "start_date")
//    private LocalDate startDate;
//
//    @Column(name = "end_date")
//    private LocalDate endDate;
//
//    @Column(name = "expected_delivery_date")
//    private LocalDate expectedDeliveryDate;
//
//    @Column(name = "actual_delivery_date")
//    private LocalDate actualDeliveryDate;
//
//    @Column(name = "progress_percentage")
//    private Integer progressPercentage = 0;
//
//    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ProjectPhase> phases;
//
//    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ProjectFile> files;
//}

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.dev.core.constants.ProjectPriority;
import com.dev.core.constants.ProjectStatus;
import com.dev.core.constants.ProjectType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "projects", indexes = {
        @Index(columnList = "organization_id"),
        @Index(columnList = "client_id"),
        @Index(columnList = "status"),
        @Index(columnList = "project_type")
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
    private String code;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProjectStatus status = ProjectStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_type", length = 20, nullable = false)
    private ProjectType projectType = ProjectType.INTERNAL;
    
    @Enumerated(EnumType.STRING)
    @Column(name="project_priority",length=30,nullable=false)
    private ProjectPriority projectPriority;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    private Integer progressPercentage = 0;

    // NEW FIELDS
    private Double budget;
    private Double spent;
    private String color;

    @Column(name = "is_starred")
    private Boolean isStarred = false;

    private LocalDateTime lastActivity;

    @ElementCollection
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectMember> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectPhase> phases;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectFile> files;
}

