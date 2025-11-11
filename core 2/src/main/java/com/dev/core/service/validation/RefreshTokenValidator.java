package com.dev.core.service.validation;


import org.springframework.stereotype.Component;

import com.dev.core.exception.BaseException;
import com.dev.core.model.RefreshTokenDTO;
import com.dev.core.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RefreshTokenValidator {

    private final RefreshTokenRepository refreshTokenRepository;

    public void validateBeforeCreate(RefreshTokenDTO dto) {
        if (dto.getUserId() == null)
            throw new BaseException("error.token.user.required");
        if (dto.getToken() == null || dto.getToken().isBlank())
            throw new BaseException("error.token.value.required");
    }

    public void validateTokenExists(String token) {
        if (token == null || token.isBlank())
            throw new BaseException("error.token.value.required");
        if (refreshTokenRepository.findByToken(token).isEmpty())
            throw new BaseException("error.token.not.found");
    }
}
