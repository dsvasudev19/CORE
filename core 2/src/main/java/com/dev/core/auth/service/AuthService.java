package com.dev.core.auth.service;

import com.dev.core.domain.User;
import com.dev.core.model.AuthRequest;
import com.dev.core.model.AuthResponse;
import com.dev.core.model.CurrentUserResponse;
import com.dev.core.model.UserDTO;

public interface AuthService {

    AuthResponse login(AuthRequest request, String userAgent, String ip);

    AuthResponse refreshAccessToken(String refreshToken);

    void logout(String refreshToken);

    CurrentUserResponse getCurrentUser(String token);
    
    /** Step 1: Initiate forgot password with email */
    void initiateForgotPassword(String email);

    /** Step 2: Validate token and return user info (used by frontend to show email) */
    UserDTO verifyResetToken(String token);

    /** Step 3: Reset password using token */
    void resetPasswordWithToken(String token, String newPassword);
}
