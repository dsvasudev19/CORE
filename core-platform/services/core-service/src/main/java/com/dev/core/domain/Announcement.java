package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "category")
    private String category; // General, Benefits, Events, Facilities, HR, IT

    @Column(name = "priority")
    private String priority; // High, Medium, Low

    @Column(name = "author")
    private String author;

    @Column(name = "published_date")
    private LocalDate publishedDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "views")
    @Builder.Default
    private Integer views = 0;

    @Column(name = "reactions")
    @Builder.Default
    private Integer reactions = 0;

    @Column(name = "is_pinned")
    @Builder.Default
    private Boolean isPinned = false;

    @Column(name = "status")
    private String status; // Active, Archived, Draft

    @Column(name = "target_audience")
    private String targetAudience; // All Employees, Engineering, HR, etc.
}
