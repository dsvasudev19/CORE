package com.dev.core.security.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.core.security.CustomUserDetailsService;
import com.dev.core.security.JwtTokenProvider;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Extracts JWT from Authorization header and builds authentication context.
 * Automatically skips /api/auth/** endpoints (login, refresh, logout, etc.)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String header = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Extract token if present
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            username = jwtTokenProvider.extractUsername(token);
        }

        // Validate token and set authentication context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = userDetailsService.loadUserByUsername(username);
            log.info("After user details {}",userDetails);
            if (jwtTokenProvider.validateToken(token, userDetails)) {
            	log.info("Token validated");
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                log.info("Auth {}",auth);
                try {
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.info("✅ JWT validated and authentication set for '{}'", username);
                } catch (Exception e) {
                    log.error("❌ Failed to set authentication", e);
                }
            } else {
                log.warn("❌ Invalid JWT token for '{}'", username);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Skip JWT filter for authentication-related endpoints.
     * This prevents token parsing on login, refresh, logout, etc.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean skip = path.startsWith("/api/auth/");
        if (skip) {
            log.trace("⏩ Skipping JwtAuthenticationFilter for path: {}", path);
        }
        return skip;
    }
}
