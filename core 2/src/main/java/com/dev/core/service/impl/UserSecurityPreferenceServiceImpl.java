package com.dev.core.service.impl;

import com.dev.core.constants.MfaType;
import com.dev.core.domain.User;
import com.dev.core.domain.UserSecurityPreference;
import com.dev.core.exception.ResourceNotFoundException;
import com.dev.core.mapper.UserSecurityPreferenceMapper;
import com.dev.core.model.UserSecurityPreferenceDTO;
import com.dev.core.repository.UserRepository;
import com.dev.core.repository.UserSecurityPreferenceRepository;
import com.dev.core.service.UserSecurityPreferenceService;
import com.dev.core.service.validation.UserSecurityPreferenceValidator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserSecurityPreferenceServiceImpl implements UserSecurityPreferenceService {

    private final UserRepository userRepository;
    private final UserSecurityPreferenceRepository preferenceRepository;

    private final UserSecurityPreferenceMapper mapper;
    private final UserSecurityPreferenceValidator validator;

    // -----------------------------------------------------------------
    // Fetch user preferences
    // -----------------------------------------------------------------
    @Override
    public UserSecurityPreferenceDTO getPreferences(Long userId) {

        validator.validateBeforeUpdate(userId, new UserSecurityPreferenceDTO()); // just validates user existence

        UserSecurityPreference pref = getOrCreatePreference(userId);

        return mapper.toDTO(pref);
    }

    // -----------------------------------------------------------------
    // Update preferences
    // -----------------------------------------------------------------
    @Override
    public UserSecurityPreferenceDTO updatePreferences(Long userId, UserSecurityPreferenceDTO dto) {

        validator.validateBeforeUpdate(userId, dto);

        UserSecurityPreference pref = getOrCreatePreference(userId);

        mapper.updateEntityFromDTO(dto, pref);

        preferenceRepository.save(pref);

        return mapper.toDTO(pref);
    }

    // -----------------------------------------------------------------
    // Enable MFA Requirement
    // -----------------------------------------------------------------
    @Override
    public void enableMfaRequirement(Long userId) {

        validator.validateBeforeUpdate(userId, new UserSecurityPreferenceDTO());

        UserSecurityPreference pref = getOrCreatePreference(userId);
        pref.setMfaRequired(true);

        preferenceRepository.save(pref);
    }

    // -----------------------------------------------------------------
    // Disable MFA Requirement
    // -----------------------------------------------------------------
    @Override
    public void disableMfaRequirement(Long userId) {

        validator.validateBeforeUpdate(userId, new UserSecurityPreferenceDTO());

        UserSecurityPreference pref = getOrCreatePreference(userId);
        pref.setMfaRequired(false);

        preferenceRepository.save(pref);
    }

    // -----------------------------------------------------------------
    // Set preferred MFA type
    // -----------------------------------------------------------------
    @Override
    public void setPreferredMfa(Long userId, MfaType type) {

        validator.validateBeforeUpdate(userId, new UserSecurityPreferenceDTO());

        UserSecurityPreference pref = getOrCreatePreference(userId);
        pref.setPreferredMfa(type);

        preferenceRepository.save(pref);
    }

    // -----------------------------------------------------------------
    // Helper Methods
    // -----------------------------------------------------------------
    private UserSecurityPreference getOrCreatePreference(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        return preferenceRepository.findByUser(user)
                .orElseGet(() -> {
                    UserSecurityPreference pref = new UserSecurityPreference();
                    pref.setUser(user);
                    return preferenceRepository.save(pref);
                });
    }
}
