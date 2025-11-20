package com.dev.core.controller;


import com.dev.core.constants.MfaType;
import com.dev.core.model.UserMfaFactorDTO;
import com.dev.core.service.UserMfaService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mfa")
@RequiredArgsConstructor
public class UserMfaController {

    private final UserMfaService mfaService;

    // ======================================================================
    // Enrollment (AUTHENTICATOR + EMAIL)
    // ======================================================================

    @PostMapping("/{userId}/enroll/{type}")
    public ResponseEntity<UserMfaFactorDTO> initiateEnrollment(
            @PathVariable Long userId,
            @PathVariable MfaType type
    ) {
        return ResponseEntity.ok(mfaService.initiateEnrollment(userId, type));
    }

    @PostMapping("/{userId}/enroll/{type}/verify")
    public ResponseEntity<Boolean> verifyEnrollment(
            @PathVariable Long userId,
            @PathVariable MfaType type,
            @RequestParam String code
    ) {
        return ResponseEntity.ok(mfaService.verifyEnrollment(userId, type, code));
    }

    // ======================================================================
    // Enable / Disable MFA Factor
    // ======================================================================

    @PostMapping("/{userId}/enable/{type}")
    public ResponseEntity<UserMfaFactorDTO> enableFactor(
            @PathVariable Long userId,
            @PathVariable MfaType type
    ) {
        return ResponseEntity.ok(mfaService.enableFactor(userId, type));
    }

    @PostMapping("/{userId}/disable/{type}")
    public ResponseEntity<Void> disableFactor(
            @PathVariable Long userId,
            @PathVariable MfaType type
    ) {
        mfaService.disableFactor(userId, type);
        return ResponseEntity.ok().build();
    }

    // ======================================================================
    // Determine challenge factor (during login)
    // ======================================================================

    @GetMapping("/{userId}/challenge")
    public ResponseEntity<MfaType> determineChallenge(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(mfaService.determineChallengeFactor(userId));
    }

    // ======================================================================
    // Send challenge OTP (email) or prompt TOTP code
    // ======================================================================

    @PostMapping("/{userId}/challenge/{type}/send")
    public ResponseEntity<Void> sendChallenge(
            @PathVariable Long userId,
            @PathVariable MfaType type
    ) {
        mfaService.sendChallenge(userId, type);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/challenge/{type}/verify")
    public ResponseEntity<Boolean> verifyChallenge(
            @PathVariable Long userId,
            @PathVariable MfaType type,
            @RequestParam String code
    ) {
        return ResponseEntity.ok(mfaService.verifyChallenge(userId, type, code));
    }

    // ======================================================================
    // Backup Codes
    // ======================================================================

    @PostMapping("/{userId}/backup-codes")
    public ResponseEntity<List<String>> generateBackupCodes(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(mfaService.generateBackupCodes(userId));
    }

    @PostMapping("/{userId}/backup-codes/verify")
    public ResponseEntity<Boolean> verifyBackupCode(
            @PathVariable Long userId,
            @RequestParam String code
    ) {
        return ResponseEntity.ok(mfaService.verifyBackupCode(userId, code));
    }

    // ======================================================================
    // Retrieval
    // ======================================================================

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserMfaFactorDTO>> getUserMfaFactors(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(mfaService.getUserMfaFactors(userId));
    }

    @GetMapping("/{userId}/{type}")
    public ResponseEntity<UserMfaFactorDTO> getFactor(
            @PathVariable Long userId,
            @PathVariable MfaType type
    ) {
        return ResponseEntity.ok(mfaService.getFactor(userId, type));
    }
}
