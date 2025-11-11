package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {

    Optional<Role> findByNameAndOrganizationId(String name, Long organizationId);

    List<Role> findAllByOrganizationId(Long organizationId);

    Page<Role> findAllByOrganizationId(Long organizationId, Pageable pageable);

    Page<Role> findByOrganizationIdAndNameContainingIgnoreCase(Long organizationId, String name, Pageable pageable);
}
