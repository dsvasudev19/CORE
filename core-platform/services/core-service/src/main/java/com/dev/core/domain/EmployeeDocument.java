package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EmployeeDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 200)
    private String documentName;

    @Column(length = 100)
    private String documentType;

    @Column(length = 500)
    private String filePath;

    private boolean verified;
    
    @Column(name = "file_id", nullable = false)
    private String fileId;

}
