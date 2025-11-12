package com.dev.core.domain;

import com.dev.core.constants.FileVisibility;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "task_attachments",
       indexes = {@Index(columnList = "task_id")})
@Getter
@Setter
@NoArgsConstructor
public class TaskAttachment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "stored_path", nullable = false)
    private String storedPath;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility")
    private FileVisibility visibility = FileVisibility.INTERNAL;

    @Column(name = "description", length = 1000)
    private String description;
}
