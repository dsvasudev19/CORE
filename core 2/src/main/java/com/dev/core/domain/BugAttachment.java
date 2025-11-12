package com.dev.core.domain;

import com.dev.core.constants.FileVisibility;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bug_attachments", indexes = {
        @Index(columnList = "bug_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BugAttachment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bug_id", nullable = false)
    private Bug bug;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "stored_path", nullable = false)
    private String storedPath;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", length = 20)
    private FileVisibility visibility;

    @Column(length = 500)
    private String description;
}
