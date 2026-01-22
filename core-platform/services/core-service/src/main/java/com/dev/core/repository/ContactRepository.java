package com.dev.core.repository;

import com.dev.core.domain.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long>, JpaSpecificationExecutor<Contact> {

    // 🔹 Tenant-aware access
    Optional<Contact> findByIdAndOrganizationId(Long id, Long organizationId);

    List<Contact> findByOrganizationIdAndActiveTrue(Long organizationId);

    Page<Contact> findByOrganizationIdAndActiveTrue(Long organizationId, Pageable pageable);

    // 🔹 Validation
    boolean existsByOrganizationIdAndEmailIgnoreCase(Long organizationId, String email);

    // 🔹 Search & Filters
    Page<Contact> findByOrganizationIdAndNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrTypeContainingIgnoreCase(
            Long organizationId, String name, String email, String type, Pageable pageable);

    List<Contact> findByOrganizationIdAndTypeIgnoreCase(Long organizationId, String type);
}
