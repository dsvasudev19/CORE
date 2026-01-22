package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contacts", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_id", "email"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "designation")
    private String designation;

    @Column(name = "department")
    private String department;

    @Column(name = "type")
    private String type; // CLIENT, VENDOR, INTERNAL, etc.

    @Column(name = "notes", length = 1000)
    private String notes;
}