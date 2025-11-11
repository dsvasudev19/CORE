package com.dev.core.service.validation;

import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserValidator {

    private final UserRepository userRepository;

    public void validateBeforeCreate(UserDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new BaseException("error.user.email.required");
        }
        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new BaseException("error.user.username.required");
        }
        if (dto.getOrganizationId() == null) {
            throw new BaseException("error.user.organization.required");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BaseException("error.user.email.exists", new Object[]{dto.getEmail()});
        }
        if (userRepository.existsByUsernameAndOrganizationId(dto.getUsername(), dto.getOrganizationId())) {
            throw new BaseException("error.user.username.exists", new Object[]{dto.getUsername()});
        }
    }

    public void validateBeforeUpdate(Long id, UserDTO dto) {
        if (id == null) {
            throw new BaseException("error.user.id.required");
        }
        if (!userRepository.existsById(id)) {
            throw new BaseException("error.user.not.found", new Object[]{id});
        }
    }
}
