package com.dev.core.auth.service;

import com.dev.core.model.AuthRequest;
import com.dev.core.model.AuthResponse;
import com.dev.core.model.CurrentUserResponse;

public interface AuthService {

    AuthResponse login(AuthRequest request, String userAgent, String ip);

    AuthResponse refreshAccessToken(String refreshToken);

    void logout(String refreshToken);

    CurrentUserResponse getCurrentUser(String token);
}
