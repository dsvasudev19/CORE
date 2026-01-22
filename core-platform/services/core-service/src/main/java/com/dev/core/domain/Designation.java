package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "designations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Designation extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 255)
    private String description;
    
    @Column(nullable=false)
    private String code;
    @OneToMany(mappedBy = "designation", fetch = FetchType.LAZY)
    private Set<Employee> employees;
}
