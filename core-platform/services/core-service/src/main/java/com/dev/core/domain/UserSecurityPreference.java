package com.dev.core.domain;

import com.dev.core.constants.MfaType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_security_preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserSecurityPreference extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    // Whether user wants MFA enabled for account security
    @Column(name = "mfa_required", nullable = false)
    private boolean mfaRequired = false;

    // User-selected MFA priority (TOTP, SMS, EMAIL, BACKUP_CODES)
    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_mfa", length = 20)
    private MfaType preferredMfa;

    // Optional additional preferences
    @Column(name = "notify_on_login", nullable = false)
    private boolean notifyOnLogin = true;

    @Column(name = "notify_on_password_change", nullable = false)
    private boolean notifyOnPasswordChange = true;
}
