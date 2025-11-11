package com.dev.core.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.ResourceEntity;

@Repository
public interface ResourceRepository extends JpaRepository<ResourceEntity, Long>, JpaSpecificationExecutor<ResourceEntity> {

    Optional<ResourceEntity> findByCode(String code);

    List<ResourceEntity> findAllByOrganizationId(Long organizationId);
    Optional<ResourceEntity> findByCodeAndOrganizationId(String code, Long organizationId);

    Page<ResourceEntity> findAllByOrganizationId(Long organizationId, Pageable pageable);

    Page<ResourceEntity> findByOrganizationIdAndNameContainingIgnoreCase(Long organizationId, String name, Pageable pageable);

    Page<ResourceEntity> findByOrganizationIdAndCodeContainingIgnoreCase(Long organizationId, String code, Pageable pageable);
}
