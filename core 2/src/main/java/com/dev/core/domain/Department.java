package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "departments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Department extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;
    
    @Column(length=20,nullable=false)
    private String code;

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private Set<Employee> employees;

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private Set<Team> teams;
}
