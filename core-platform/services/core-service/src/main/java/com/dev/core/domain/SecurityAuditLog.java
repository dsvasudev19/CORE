package com.dev.core.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "security_audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SecurityAuditLog extends BaseEntity {


@ManyToOne
@JoinColumn(name = "user_id")
private User user;


@Column(name = "action", length = 50)
private String action;


@Column(name = "success")
private boolean success;


@Column(name = "ip_address", length = 50)
private String ipAddress;


@Column(name = "user_agent", length = 255)
private String userAgent;


@Column(name = "details", columnDefinition = "TEXT")
private String details;


@Column(name = "event_at")
private LocalDateTime eventAt;
}