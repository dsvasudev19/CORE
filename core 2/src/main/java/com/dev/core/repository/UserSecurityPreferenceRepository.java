package com.dev.core.repository;

import com.dev.core.domain.UserSecurityPreference;
import com.dev.core.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserSecurityPreferenceRepository extends JpaRepository<UserSecurityPreference, Long> {
	Optional<UserSecurityPreference> findByUser(User user);
}