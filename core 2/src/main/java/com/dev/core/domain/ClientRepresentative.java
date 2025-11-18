package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client_representatives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientRepresentative extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Column(name = "role")
    private String role; // DECISION_MAKER, TECH_LEAD, BILLING, etc.

    @Column(name = "primary_contact", nullable = false)
    private boolean primaryContact = false;

    // Convenience method to ensure only one primary per client
    public void setPrimaryContact(boolean primaryContact) {
        this.primaryContact = primaryContact;
        if (primaryContact && client != null) {
            client.getRepresentatives().stream()
                .filter(r -> !r.equals(this))
                .forEach(r -> r.setPrimaryContact(false));
        }
    }
}