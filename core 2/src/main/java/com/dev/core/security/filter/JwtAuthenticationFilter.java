package com.dev.core.security.filter;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.core.security.CustomUserDetails;
import com.dev.core.security.CustomUserDetailsService;
import com.dev.core.security.JwtTokenProvider;
import com.dev.core.wrapper.OrganizationRequestWrapper;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

        try {
            if (header != null && header.startsWith("Bearer ")) {
                token = header.substring(7);
                username = jwtTokenProvider.extractUsername(token);
            }

//            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                var userDetails = userDetailsService.loadUserByUsername(username);
//                if (jwtTokenProvider.validateToken(token, userDetails)) {
//                    UsernamePasswordAuthenticationToken auth =
//                            new UsernamePasswordAuthenticationToken(
//                                    userDetails, null, userDetails.getAuthorities());
//                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                    SecurityContextHolder.getContext().setAuthentication(auth);
//                    log.info("✅ JWT validated successfully for user: {}", username);
//                }
//            }
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtTokenProvider.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    log.info("JWT validated for user {}", username);

                    // Inject orgId
                    Long orgId = ((CustomUserDetails) userDetails).getOrganizationId();

                    OrganizationRequestWrapper wrappedRequest =
                            new OrganizationRequestWrapper(request, orgId);

                    filterChain.doFilter(wrappedRequest, response);
                    return;
                }
            }


            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            log.warn("⚠️ JWT expired: {}", ex.getMessage());
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Token expired. Please login again.");

        } catch (SignatureException ex) {
            log.error("❌ Invalid JWT signature: {}", ex.getMessage());
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Invalid token signature.");

        } catch (MalformedJwtException ex) {
            log.error("❌ Malformed JWT: {}", ex.getMessage());
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Malformed token.");

        } catch (UnsupportedJwtException ex) {
            log.error("❌ Unsupported JWT: {}", ex.getMessage());
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Unsupported token format.");

        } catch (IllegalArgumentException ex) {
            log.error("❌ JWT token missing or invalid: {}", ex.getMessage());
            sendErrorResponse(response, HttpStatus.BAD_REQUEST, "Missing or invalid token.");

        } catch (Exception ex) {
            log.error("❌ Unexpected error during JWT processing: {}", ex.getMessage(), ex);
            sendErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected authentication error.");
        }
    }

    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(String.format("""
            {
              "success": false,
              "status": %d,
              "message": "%s"
            }
            """, status.value(), message));
    }

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

