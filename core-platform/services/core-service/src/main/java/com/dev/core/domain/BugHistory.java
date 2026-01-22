package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bug_history", indexes = {
        @Index(columnList = "bug_id"),
        @Index(columnList = "changed_by")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BugHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bug_id", nullable = false)
    private Bug bug;

    @Column(name = "changed_field", length = 100)
    private String changedField;

    @Column(name = "old_value", length = 255)
    private String oldValue;

    @Column(name = "new_value", length = 255)
    private String newValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private Employee changedBy;


    @Column(name = "changed_at")
    private LocalDateTime changedAt = LocalDateTime.now();

    @Column(length = 500)
    private String note; // Optional reason or remark
}
