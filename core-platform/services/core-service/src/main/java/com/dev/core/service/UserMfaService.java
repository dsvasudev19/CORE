package com.dev.core.service;


import com.dev.core.constants.MfaType;
import com.dev.core.model.UserMfaFactorDTO;

import java.util.List;

public interface UserMfaService {

    // ---------------------------
    // MFA Onboarding / Enrollment
    // ---------------------------

    /**
     * Generates secret or OTP to start MFA enrollment (TOTP QR, SMS OTP, Email OTP).
     */
    UserMfaFactorDTO initiateEnrollment(Long userId, MfaType type);

    /**
     * User provides OTP or TOTP code to complete enrollment.
     */
    boolean verifyEnrollment(Long userId, MfaType type, String otpOrCode);

    /**
     * Enable an MFA factor AFTER it's verified.
     */
    UserMfaFactorDTO enableFactor(Long userId, MfaType type);

    /**
     * Disable an MFA factor (soft disable).
     */
    void disableFactor(Long userId, MfaType type);

    // ---------------------------
    // MFA During Login
    // ---------------------------

    /**
     * Determine which factor should be used for login challenge
     * based on preferred order & enabled factors.
     */
    MfaType determineChallengeFactor(Long userId);

    /**
     * Send MFA challenge (SMS OTP, email OTP, TOTP prompt, etc.).
     */
    void sendChallenge(Long userId, MfaType type);

    /**
     * User enters the MFA code during login challenge.
     */
    boolean verifyChallenge(Long userId, MfaType type, String otpOrCode);

    // ---------------------------
    // Backup Codes
    // ---------------------------

    /**
     * Generate new backup codes and overwrite old ones.
     */
    List<String> generateBackupCodes(Long userId);

    /**
     * Validate backup code during login.
     */
    boolean verifyBackupCode(Long userId, String code);

    // ---------------------------
    // Retrieval
    // ---------------------------

    /**
     * List all MFA factors with statuses.
     */
    List<UserMfaFactorDTO> getUserMfaFactors(Long userId);

    /**
     * Get details about a specific factor.
     */
    UserMfaFactorDTO getFactor(Long userId, MfaType type);
}
