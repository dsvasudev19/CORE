package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "file_id", nullable = false)
    private String fileId; // UUID from file storage service

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "category")
    private String category; // CONTRACT, NDA, PROPOSAL, etc.

    @Column(name = "uploaded_by")
    private Long uploadedBy;

    @Column(name = "description", length = 1000)
    private String description;
}