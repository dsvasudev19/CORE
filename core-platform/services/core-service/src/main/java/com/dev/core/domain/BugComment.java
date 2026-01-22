package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bug_comments", indexes = {
        @Index(columnList = "bug_id"),
        @Index(columnList = "parent_comment_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BugComment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bug_id", nullable = false)
    private Bug bug;

    @Column(name = "comment_text", nullable = false, length = 2000)
    private String commentText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commented_by", nullable = false)
    private Employee commentedBy;


    @Column(name = "commented_at", nullable = false)
    private LocalDateTime commentedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private BugComment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BugComment> replies;
}
