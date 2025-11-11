package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {

    List<Permission> findAllByOrganizationId(Long organizationId);
    
    Optional<Permission> findByOrganizationIdAndResourceIdAndActionId(long organizationId,long resourceId,long actionId);

    Optional<Permission> findByResource_IdAndAction_IdAndOrganizationId(Long resourceId, Long actionId, Long organizationId);

    Page<Permission> findAllByOrganizationId(Long organizationId, Pageable pageable);

    Page<Permission> findByOrganizationIdAndDescriptionContainingIgnoreCase(Long organizationId, String description, Pageable pageable);
}

