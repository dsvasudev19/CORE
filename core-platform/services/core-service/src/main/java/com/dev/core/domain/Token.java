package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
@Getter
@Setter
public class Token extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String token;
    @Column(nullable = false)
    private LocalDateTime expiry;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Column(nullable = false)
    private boolean active = true;
}

