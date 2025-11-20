package com.dev.core.domain;

import java.util.Map;

import com.dev.core.constants.MfaType;
import com.dev.core.converter.MapToJsonConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_mfa_factors",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "type"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserMfaFactor extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private MfaType type;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = false;

    @Column(name = "verified", nullable = false)
    private boolean verified = false;

    // TOTP (Google Authenticator)
    @Column(name = "totp_secret")
    private String totpSecret;

    // SMS OTP
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    // Email OTP (optional custom OTP email)
    @Column(name = "email_for_otp", length = 150)
    private String emailForOtp;

    // Backup Codes (JSON array, hashed or plain salted)
    @Column(name = "backup_codes_json", columnDefinition = "TEXT")
    private String backupCodesJson;
    
    @Column(name = "metadata", columnDefinition = "TEXT")
    @Convert(converter = MapToJsonConverter.class)
    private Map<String, Object> metadata;

}
