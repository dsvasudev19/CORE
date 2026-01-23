package com.dev.core.service.impl;


import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.core.auth.service.AuthService;
import com.dev.core.service.validation.AuthValidator;
import com.dev.core.domain.PasswordResetToken;
import com.dev.core.domain.Role;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.UserMapper;
import com.dev.core.model.AuthRequest;
import com.dev.core.model.AuthResponse;
import com.dev.core.model.CurrentUserResponse;
import com.dev.core.model.RefreshTokenDTO;
import com.dev.core.model.RoleSummary;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.PasswordResetTokenRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.security.JwtTokenProvider;
import com.dev.core.service.NotificationService;
import com.dev.core.service.RefreshTokenService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final AuthValidator validator;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    private static final long ACCESS_TOKEN_EXPIRATION_MINUTES = 60;
    
    @Value("${app.frontend.baseurl}")
    private String baseUrl;

    @Override
    public AuthResponse login(AuthRequest request, String userAgent, String ipAddress) {

        validator.validateLogin(request);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtTokenProvider.generateToken(user.getUsername());

        RefreshTokenDTO refreshToken = refreshTokenService.createToken(
                UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .organizationId(user.getOrganizationId())
                        .build(),
                userAgent,
                ipAddress
        );

        Set<String> roles = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                : Set.of();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .organizationId(user.getOrganizationId())
                .roles(roles)
                .expiresAt(Instant.now().plus(ACCESS_TOKEN_EXPIRATION_MINUTES, ChronoUnit.MINUTES).toEpochMilli())
                .build();
    }

    @Override
    public AuthResponse refreshAccessToken(String refreshToken) {
        validator.validateToken(refreshToken);

        RefreshTokenDTO token = refreshTokenService.getByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtTokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .organizationId(user.getOrganizationId())
                .roles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()))
                .expiresAt(Instant.now().plus(ACCESS_TOKEN_EXPIRATION_MINUTES, ChronoUnit.MINUTES).toEpochMilli())
                .build();
    }

    @Override
    public void logout(String refreshToken) {
        validator.validateToken(refreshToken);
        refreshTokenService.revokeToken(refreshToken);
    }

    @Override
    public CurrentUserResponse getCurrentUser(String token) {
        validator.validateToken(token);
        token = token.replace("\"", "").trim();

        // Try Access Token first
        try {
            String username = jwtTokenProvider.extractUsername(token);
            Date expiration = jwtTokenProvider.extractExpiration(token);

            if (expiration.before(new Date())) {
                throw new ExpiredJwtException(null, null, "Token expired");
            }

            User user = userRepository.findByUsernameOrEmailWithRoles(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return buildCurrentUserResponse(user);

        } catch (ExpiredJwtException | SignatureException | MalformedJwtException ex) {
            // try refresh token below
        }

        // Fallback: is it a refresh token?
        RefreshTokenDTO stored = refreshTokenService.getByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildCurrentUserResponse(user);
    }

    private CurrentUserResponse buildCurrentUserResponse(User user) {
        Set<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream()
                        .map(p -> p.getResource().getCode() + ":" + p.getAction().getCode()))
                .collect(Collectors.toSet());

        List<RoleSummary> roleSummaries = user.getRoles().stream()
                .map(role -> RoleSummary.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .description(role.getDescription())
                        .build())
                .collect(Collectors.toList());

        return CurrentUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .organizationId(user.getOrganizationId())
                .status(user.getStatus().name())
                .lastLoginAt(user.getLastLoginAt())
                .roles(roleSummaries)
                .permissions(permissions)
                .build();
    }
    
    @Override
    public void initiateForgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BaseException("error.user.not.found"));

        // Create a secure random token
        String tokenValue = UUID.randomUUID().toString();

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(tokenValue);
        token.setUser(user);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(20));
        token.setActive(true); // newly created token is active

        tokenRepository.save(token);

        // Build final URL for frontend
        String resetLink = baseUrl + "/auth/reset-password?token=" + tokenValue;

        log.info("Sending password reset link to {}", user.getEmail());

        // send email
        notificationService.sendEmail(user.getEmail(),"Password Reset ", resetLink);
    }

    // -----------------------------------------------------
    // 2. Verify Token (frontend calls this to display email)
    // -----------------------------------------------------
    @Override
    public UserDTO verifyResetToken(String tokenValue) {

        PasswordResetToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BaseException("error.token.invalid"));

        // inactive token means used or manually deactivated
        if (!token.getActive()) {
            throw new BaseException("error.token.used.or.invalid");
        }

        // expired token → mark inactive, fail request
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            token.setActive(false);
            tokenRepository.save(token);
            throw new BaseException("error.token.expired");
        }

        // success → return user details
        return UserMapper.toDTO(token.getUser());
    }

    // -----------------------------------------------------
    // 3. Reset Password With Token
    // -----------------------------------------------------
    @Override
    public void resetPasswordWithToken(String tokenValue, String newPassword) {

        PasswordResetToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BaseException("error.token.invalid"));

        // token validity checks
        if (!token.getActive()) {
            throw new BaseException("error.token.used.or.invalid");
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            token.setActive(false);
            tokenRepository.save(token);
            throw new BaseException("error.token.expired");
        }

        // IMPORTANT: Reload the user fully to avoid null password issue
        Long userId = token.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("error.user.not.found"));

        // Update password safely
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token inactive
        token.setActive(false);
        tokenRepository.save(token);
    }

}
