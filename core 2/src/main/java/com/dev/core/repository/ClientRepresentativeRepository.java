package com.dev.core.repository;

import com.dev.core.domain.ClientRepresentative;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepresentativeRepository extends JpaRepository<ClientRepresentative, Long> {

    // 🔹 Tenant & client scope
    List<ClientRepresentative> findByOrganizationIdAndClientIdAndActiveTrue(Long organizationId, Long clientId);

    Page<ClientRepresentative> findByOrganizationIdAndClientIdAndActiveTrue(Long organizationId, Long clientId, Pageable pageable);

    // 🔹 Primary contact retrieval
    Optional<ClientRepresentative> findByClientIdAndPrimaryContactTrue(Long clientId);

    // 🔹 Validation
    boolean existsByClientIdAndContactId(Long clientId, Long contactId);

    // 🔹 Common filters
    List<ClientRepresentative> findByOrganizationIdAndActiveTrue(Long organizationId);
}
