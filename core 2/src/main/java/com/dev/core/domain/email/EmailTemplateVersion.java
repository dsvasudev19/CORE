package com.dev.core.domain.email;

import com.dev.core.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "email_template_versions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailTemplateVersion extends BaseEntity {

    @Column(name = "template_id", nullable = false)
    private Long templateId;

    @Column(nullable = false)
    private String subject;

    @Lob
    @Column(nullable = false)
    private String templateHtml;

    @Column(name = "version_note")
    private String versionNote; // optional: why was it updated?
}
