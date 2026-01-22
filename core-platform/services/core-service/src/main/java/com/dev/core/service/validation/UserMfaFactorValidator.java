package com.dev.core.service.validation;

import com.dev.core.constants.MfaType;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.UserMfaFactorDTO;
import com.dev.core.repository.UserMfaFactorRepository;
import com.dev.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMfaFactorValidator {

    private final UserRepository userRepository;
    private final UserMfaFactorRepository factorRepository;

    public void validateBeforeCreate(Long userId, UserMfaFactorDTO dto) {

        if (userId == null)
            throw new ValidationFailedException("error.user.id.required", null);

        if (!userRepository.existsById(userId))
            throw new ValidationFailedException("error.user.notfound", new Object[]{userId});

        if (dto == null)
            throw new ValidationFailedException("error.mfa.null", null);

        if (dto.getType() == null)
            throw new ValidationFailedException("error.mfa.type.required", null);

        if (!isValidMfaType(dto.getType()))
            throw new ValidationFailedException("error.mfa.type.invalid", new Object[]{dto.getType()});

        // Check duplicate MFA type
        if (factorRepository.findByUserAndType(userRepository.getReferenceById(userId), dto.getType()).isPresent())
            throw new ValidationFailedException("error.mfa.type.exists", new Object[]{dto.getType()});
    }

    public void validateBeforeUpdate(Long userId, MfaType type, UserMfaFactorDTO dto) {

        if (userId == null)
            throw new ValidationFailedException("error.user.id.required", null);

        if (!userRepository.existsById(userId))
            throw new ValidationFailedException("error.user.notfound", new Object[]{userId});

        if (type == null)
            throw new ValidationFailedException("error.mfa.type.required", null);

        // Factor must exist
        if (factorRepository.findByUserAndType(userRepository.getReferenceById(userId), type).isEmpty())
            throw new ValidationFailedException("error.mfa.notfound", new Object[]{userId, type});

        // DTO level validations
        if (dto == null)
            throw new ValidationFailedException("error.mfa.null", null);

        if (dto.getType() != null && !isValidMfaType(dto.getType()))
            throw new ValidationFailedException("error.mfa.type.invalid", new Object[]{dto.getType()});

        // Conditional validations
        if (type == MfaType.SMS && (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank()))
            throw new ValidationFailedException("error.mfa.phone.required", null);

        if (type == MfaType.EMAIL && (dto.getEmailForOtp() == null || dto.getEmailForOtp().isBlank()))
            throw new ValidationFailedException("error.mfa.email.required", null);
    }

    private boolean isValidMfaType(MfaType type) {
        for (MfaType t : MfaType.values()) {
            if (t == type) return true;
        }
        return false;
    }
}
