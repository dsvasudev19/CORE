package com.dev.core.model;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the response payload returned after successful authentication.
 * Includes JWT tokens and user profile metadata.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    /**
     * Short-lived JWT access token.
     */
    private String accessToken;

    /**
     * Long-lived refresh token (UUID format).
     */
    private String refreshToken;

    /**
     * The authenticated user's ID.
     */
    private Long userId;

    /**
     * The authenticated user's email address.
     */
    private String email;

    /**
     * The organization (tenant) ID of the user.
     */
    private Long organizationId;

    /**
     * The roles assigned to the user (for RBAC display/awareness).
     */
    private Set<String> roles;

    /**
     * Optional expiration time (epoch millis) for access token.
     */
    private Long expiresAt;
}
