package com.dev.core.service.validation;

import com.dev.core.constants.MfaType;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.UserSecurityPreferenceDTO;
import com.dev.core.repository.UserRepository;
import com.dev.core.repository.UserSecurityPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSecurityPreferenceValidator {

    private final UserRepository userRepository;
    private final UserSecurityPreferenceRepository preferenceRepository;

    public void validateBeforeCreate(Long userId, UserSecurityPreferenceDTO dto) {

        if (userId == null)
            throw new ValidationFailedException("error.user.id.required", null);

        if (!userRepository.existsById(userId))
            throw new ValidationFailedException("error.user.notfound", new Object[]{userId});

        if (dto == null)
            throw new ValidationFailedException("error.preference.null", null);

        if (dto.getPreferredMfa() == null)
            throw new ValidationFailedException("error.preference.preferredMfa.required", null);

        // Only one preference per user — ensure not already created
        if (preferenceRepository.findByUser(userRepository.getReferenceById(userId)).isPresent())
            throw new ValidationFailedException("error.preference.exists", new Object[]{userId});
    }

    public void validateBeforeUpdate(Long userId, UserSecurityPreferenceDTO dto) {

        if (userId == null)
            throw new ValidationFailedException("error.user.id.required", null);

        if (!userRepository.existsById(userId))
            throw new ValidationFailedException("error.user.notfound", new Object[]{userId});

        if (dto == null)
            throw new ValidationFailedException("error.preference.null", null);

        // Check if preference exists for update
        if (preferenceRepository.findByUser(userRepository.getReferenceById(userId)).isEmpty())
            throw new ValidationFailedException("error.preference.notfound", new Object[]{userId});

        // Validate fields
        if (dto.getPreferredMfa() != null && !isValidMfaType(dto.getPreferredMfa()))
            throw new ValidationFailedException("error.preference.mfa.invalid", new Object[]{dto.getPreferredMfa()});
    }

    private boolean isValidMfaType(MfaType type) {
        for (MfaType t : MfaType.values()) {
            if (t == type) return true;
        }
        return false;
    }
}
