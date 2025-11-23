
package com.dev.core.controller;

import org.springframework.http.ResponseEntity;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.dev.core.api.ControllerHelper;
import com.dev.core.auth.service.AuthService;
import com.dev.core.model.AuthRequest;
import com.dev.core.model.UserDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final AuthService authService;
    private final ControllerHelper helper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request,
                                   @RequestHeader(value = "User-Agent", required = false) String userAgent,
                                   @RequestHeader(value = "X-Forwarded-For", required = false) String ipAddress) {

        return helper.success("Login successful",
                authService.login(request, userAgent, ipAddress));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestParam String refreshToken) {
        return helper.success("Access token refreshed",
                authService.refreshAccessToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String refreshToken) {
        authService.logout(refreshToken);
        return helper.success("Logged out successfully");
    }

    @PostMapping("/me")
    public ResponseEntity<?> me(@RequestBody String token) {
        return helper.success("User details fetched",
                authService.getCurrentUser(token));
    }
    
    @PostMapping("/forgot-password/initiate")
    public ResponseEntity<?> initiate(@RequestParam String email) {
        authService.initiateForgotPassword(email);
        return helper.success("Reset password link sent");
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        UserDTO user = authService.verifyResetToken(token);
        return helper.success("Token valid", Map.of("email", user.getEmail()));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> reset(@RequestParam String token,
                                   @RequestParam String newPassword) {
        authService.resetPasswordWithToken(token, newPassword);
        return helper.success("Password reset successful");
    }

}
