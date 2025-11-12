package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserValidator {

    private final UserRepository userRepository;

    public void validateBeforeCreate(UserDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.user.null");

        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new ValidationFailedException("error.user.email.required");

        if (dto.getUsername() == null || dto.getUsername().isBlank())
            throw new ValidationFailedException("error.user.username.required");

        if (dto.getOrganizationId() == null)
            throw new ValidationFailedException("error.user.organization.required");

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new ValidationFailedException("error.user.email.exists", new Object[]{dto.getEmail()});

        if (userRepository.existsByUsernameAndOrganizationId(dto.getUsername(), dto.getOrganizationId()))
            throw new ValidationFailedException("error.user.username.exists", new Object[]{dto.getUsername()});
    }

    public void validateBeforeUpdate(Long id, UserDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.user.id.required");

        if (!userRepository.existsById(id))
            throw new ValidationFailedException("error.user.notfound", new Object[]{id});

        if (dto != null) {
            if (dto.getEmail() != null && userRepository.existsByEmail(dto.getEmail()))
                throw new ValidationFailedException("error.user.email.exists", new Object[]{dto.getEmail()});

            if (dto.getUsername() != null &&
                    dto.getOrganizationId() != null &&
                    userRepository.existsByUsernameAndOrganizationId(dto.getUsername(), dto.getOrganizationId()))
                throw new ValidationFailedException("error.user.username.exists", new Object[]{dto.getUsername()});
        }
    }
}
