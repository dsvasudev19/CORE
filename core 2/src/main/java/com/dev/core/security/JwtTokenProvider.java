package com.dev.core.security;

import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenProvider {

    // ✅ Static, Base64-encoded 512-bit secret (persistent across restarts)
    private static final String SECRET_KEY_STRING =
        "Z3VhcmQtbXktc3VwZXItc2VjdXJlLXN0YXRpYy1rZXktMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=";

    private static final SecretKey SECRET_KEY =
        Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY_STRING));

    private static final long JWT_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

    // ✅ Generate a token with username as subject
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    // ✅ Extract username (subject) safely
    public String extractUsername(String token) {
    	log.info("Extract username {}",token);
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claimsResolver.apply(claims);
        } catch (ExpiredJwtException e) {
            log.warn("⚠️ Token expired: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            log.error("❌ Invalid JWT signature: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            log.error("❌ Malformed JWT: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            log.error("❌ Unsupported JWT: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.error("❌ Empty or invalid JWT token: {}", e.getMessage());
            throw e;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            log.info("Extracted username {}",username);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            log.error("❌ Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }
}