package com.dev.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "resources",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"code"})
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceEntity extends BaseEntity {

    @Column(name = "name", nullable = false, length = 128)
    private String name; // e.g., PROJECT, TASK

    @Column(name = "code", nullable = false, length = 128)
    private String code; // unique resource key

    @Column(name = "description", length = 500)
    private String description;
}
