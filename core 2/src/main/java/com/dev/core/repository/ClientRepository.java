package com.dev.core.repository;

import com.dev.core.domain.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {

    // 🔹 Tenant-scoped finders
    Optional<Client> findByIdAndOrganizationId(Long id, Long organizationId);

    List<Client> findByOrganizationIdAndActiveTrue(Long organizationId);

    Page<Client> findByOrganizationIdAndActiveTrue(Long organizationId, Pageable pageable);

    // 🔹 Validation support
    boolean existsByOrganizationIdAndCode(Long organizationId, String code);

    boolean existsByOrganizationIdAndNameIgnoreCase(Long organizationId, String name);

    // 🔹 Search operations
    Page<Client> findByOrganizationIdAndNameContainingIgnoreCaseOrCodeContainingIgnoreCaseOrIndustryContainingIgnoreCase(
            Long organizationId, String name, String code, String industry, Pageable pageable);
}
