package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.RefreshTokenDTO;
import com.dev.core.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RefreshTokenValidator {

    private final RefreshTokenRepository refreshTokenRepository;

    public void validateBeforeCreate(RefreshTokenDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.token.null");

        if (dto.getUserId() == null)
            throw new ValidationFailedException("error.token.user.required");

        if (dto.getToken() == null || dto.getToken().isBlank())
            throw new ValidationFailedException("error.token.value.required");
    }

    public void validateTokenExists(String token) {
        if (token == null || token.isBlank())
            throw new ValidationFailedException("error.token.value.required");

        if (refreshTokenRepository.findByToken(token).isEmpty())
            throw new ValidationFailedException("error.token.notfound");
    }
}
