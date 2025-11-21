

package com.dev.core.domain.email;

import com.dev.core.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "email_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailTemplate extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String code;  // Example: WELCOME_EMAIL, RESET_PASSWORD

    @Column(nullable = false)
    private String name;  // Human-friendly name: "Welcome Email Template"

    @Column(nullable = false)
    private String subject;

    @Lob
    @Column(nullable = false)
    private String templateHtml; // Full Thymeleaf HTML template

    @Column(name = "description")
    private String description; // What this template is used for
}
