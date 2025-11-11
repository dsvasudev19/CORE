package com.dev.core.security;


import com.dev.core.exception.BaseException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility to get current user and organization context from SecurityContext.
 */
@Component
public class SecurityContextUtil {

    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new BaseException("error.auth.unauthenticated");
        }

        if (auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getUserId();
        }

        throw new BaseException("error.auth.userinfo.invalid");
    }

    public Long getCurrentOrganizationId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new BaseException("error.auth.unauthenticated");
        }

        if (auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getOrganizationId();
        }

        throw new BaseException("error.auth.orginfo.invalid");
    }
}
