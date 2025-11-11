package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the login request payload.
 * Used for user authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {

    /**
     * User's email address (unique identifier for login)
     */
    private String email;

    /**
     * Raw password input.
     */
    private String password;
}
