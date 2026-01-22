package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "task_tags")
@Getter
@Setter
@NoArgsConstructor
public class TaskTag extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "color", length = 20)
    private String color; // e.g., HEX or CSS color code
}
