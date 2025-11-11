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
@Table(name = "actions",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"code"})
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionEntity extends BaseEntity {

    @Column(name = "name", nullable = false, length = 64)
    private String name; // e.g., READ, CREATE

    @Column(name = "code", nullable = false, length = 64)
    private String code; // unique key
}
