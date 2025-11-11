package com.dev.core.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.dev.core.domain.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long>, JpaSpecificationExecutor<Organization> {

    Optional<Organization> findByCode(String code);

    Optional<Organization> findByDomain(String domain);

    boolean existsByCode(String code);

    Page<Organization> findAll(Pageable pageable);

    Page<Organization> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Organization> findByCodeContainingIgnoreCase(String code, Pageable pageable);
}
