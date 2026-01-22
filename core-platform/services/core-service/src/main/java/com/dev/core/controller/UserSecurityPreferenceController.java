package com.dev.core.controller;


import com.dev.core.constants.MfaType;
import com.dev.core.model.UserSecurityPreferenceDTO;
import com.dev.core.service.UserSecurityPreferenceService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security-preferences")
@RequiredArgsConstructor
public class UserSecurityPreferenceController {

    private final UserSecurityPreferenceService preferenceService;

    // ------------------------------------------------------------------------
    // GET: Fetch user's security preference settings
    // ------------------------------------------------------------------------
    @GetMapping("/{userId}")
    public ResponseEntity<UserSecurityPreferenceDTO> getPreferences(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(preferenceService.getPreferences(userId));
    }

    // ------------------------------------------------------------------------
    // PUT: Update preferences
    // ------------------------------------------------------------------------
    @PutMapping("/{userId}")
    public ResponseEntity<UserSecurityPreferenceDTO> updatePreferences(
            @PathVariable Long userId,
            @RequestBody UserSecurityPreferenceDTO dto
    ) {
        return ResponseEntity.ok(preferenceService.updatePreferences(userId, dto));
    }

    // ------------------------------------------------------------------------
    // Enable / Disable MFA requirement
    // ------------------------------------------------------------------------
    @PostMapping("/{userId}/require-mfa")
    public ResponseEntity<Void> enableMfaRequirement(
            @PathVariable Long userId
    ) {
        preferenceService.enableMfaRequirement(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/require-mfa")
    public ResponseEntity<Void> disableMfaRequirement(
            @PathVariable Long userId
    ) {
        preferenceService.disableMfaRequirement(userId);
        return ResponseEntity.ok().build();
    }

    // ------------------------------------------------------------------------
    // Set preferred MFA type
    // ------------------------------------------------------------------------
    @PostMapping("/{userId}/preferred-mfa/{type}")
    public ResponseEntity<Void> setPreferredMfa(
            @PathVariable Long userId,
            @PathVariable MfaType type
    ) {
        preferenceService.setPreferredMfa(userId, type);
        return ResponseEntity.ok().build();
    }
}
