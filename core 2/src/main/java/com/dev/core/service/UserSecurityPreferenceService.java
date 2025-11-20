package com.dev.core.service;

import com.dev.core.constants.MfaType;
import com.dev.core.model.UserSecurityPreferenceDTO;

public interface UserSecurityPreferenceService {

    /**
     * Get a user's security preference settings.
     */
    UserSecurityPreferenceDTO getPreferences(Long userId);

    /**
     * Update notification & preference settings.
     */
    UserSecurityPreferenceDTO updatePreferences(Long userId, UserSecurityPreferenceDTO dto);

    /**
     * Whether user has mandated MFA for their account.
     */
    void enableMfaRequirement(Long userId);

    void disableMfaRequirement(Long userId);

    /**
     * Set which MFA type should be used first during login.
     */
    void setPreferredMfa(Long userId, MfaType type);
}
