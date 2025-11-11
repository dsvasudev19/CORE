package com.dev.core.service;


import com.dev.core.model.OrganizationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface OrganizationService {

    OrganizationDTO createOrganization(OrganizationDTO dto);

    OrganizationDTO updateOrganization(Long id, OrganizationDTO dto);

    void deleteOrganization(Long id);

    OrganizationDTO getOrganizationById(Long id);

    Optional<OrganizationDTO> getByCode(String code);

    Optional<OrganizationDTO> getByDomain(String domain);

    Page<OrganizationDTO> searchOrganizations(String keyword, Pageable pageable);
}
