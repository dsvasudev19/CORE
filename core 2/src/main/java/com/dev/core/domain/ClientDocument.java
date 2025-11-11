package com.dev.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "client_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "file_id", nullable = false)
    private String fileId; // UUID or FileResource reference

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "category")
    private String category; // CONTRACT, AGREEMENT, PROPOSAL, NDA, etc.

    @Column(name = "uploaded_by")
    private Long uploadedBy;

    @Column(name = "description", length = 1000)
    private String description;
}
