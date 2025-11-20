package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.core.constants.MfaType;
import com.dev.core.domain.User;
import com.dev.core.domain.UserMfaFactor;

public interface UserMfaFactorRepository extends JpaRepository<UserMfaFactor, Long> {
	List<UserMfaFactor> findByUserAndEnabledTrue(User user);

	Optional<UserMfaFactor> findByUserAndType(User user, MfaType type);
	
	// In UserMfaFactorRepository.java
	List<UserMfaFactor> findByUserId(Long userId);
	Optional<UserMfaFactor> findByUserIdAndType(Long userId, MfaType type);
}