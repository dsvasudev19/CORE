package com.dev.core.service;

import com.dev.core.model.RefreshTokenDTO;
import com.dev.core.model.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface RefreshTokenService {

    RefreshTokenDTO createToken(UserDTO user, String userAgent, String ipAddress);

    Optional<RefreshTokenDTO> getByToken(String token);

    void revokeToken(String token);

    void revokeTokensForUser(Long userId);

    Page<RefreshTokenDTO> getTokens(Long organizationId, Pageable pageable);
}
