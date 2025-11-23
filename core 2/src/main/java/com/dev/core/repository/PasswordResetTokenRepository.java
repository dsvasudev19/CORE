package com.dev.core.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.dev.core.domain.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /** Find token entry by token string */
    Optional<PasswordResetToken> findByToken(String token);

    /** Deactivate all existing tokens for a user (optional but useful) */
    void deleteByUserId(Long userId);
    
    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.active = false WHERE t.user.id = :userId")
    void deactivateTokensByUserId(Long userId);
    
    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiresAt < CURRENT_TIMESTAMP")
    void deleteExpiredTokens();


}
