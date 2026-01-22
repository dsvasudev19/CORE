package com.dev.core.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username,String email);

    Optional<User> findByUsernameAndOrganizationId(String username, Long organizationId);

    Set<User> findByOrganizationId(Long organizationId);

    boolean existsByEmail(String email);

    boolean existsByUsernameAndOrganizationId(String username, Long organizationId);

    // Pagination & Search
    Page<User> findAllByOrganizationId(Long organizationId, Pageable pageable);

    Page<User> findByOrganizationIdAndUsernameContainingIgnoreCase(Long organizationId, String username, Pageable pageable);

    Page<User> findByOrganizationIdAndEmailContainingIgnoreCase(Long organizationId, String email, Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username OR u.email = :username")
    Optional<User> findByUsernameOrEmailWithRoles(@Param("username") String username);

}
