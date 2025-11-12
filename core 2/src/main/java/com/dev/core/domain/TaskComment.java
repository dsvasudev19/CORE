package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_comments",
       indexes = {@Index(columnList = "task_id")})
@Getter
@Setter
@NoArgsConstructor
public class TaskComment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "comment_text", nullable = false, length = 2000)
    private String commentText;

    @Column(name = "commented_by")
    private Long commentedBy;

    @Column(name = "commented_at")
    private LocalDateTime commentedAt = LocalDateTime.now();

    @Column(name = "parent_comment_id")
    private Long parentCommentId; // For threaded replies
}
