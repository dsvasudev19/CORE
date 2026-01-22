//package com.dev.core.service.impl;
//
//
//import java.util.Optional;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.Organization;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.OrganizationMapper;
//import com.dev.core.model.OrganizationDTO;
//import com.dev.core.repository.OrganizationRepository;
//import com.dev.core.service.OrganizationService;
//import com.dev.core.service.validation.OrganizationValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class OrganizationServiceImpl implements OrganizationService {
//
//    private final OrganizationRepository organizationRepository;
//    private final OrganizationValidator organizationValidator;
//
//    @Override
//    public OrganizationDTO createOrganization(OrganizationDTO dto) {
//        organizationValidator.validateBeforeCreate(dto);
//        var saved = organizationRepository.save(OrganizationMapper.toEntity(dto));
//        return OrganizationMapper.toDTO(saved);
//    }
//
//    @Override
//    public OrganizationDTO updateOrganization(Long id, OrganizationDTO dto) {
//        organizationValidator.validateBeforeUpdate(id);
//        var existing = organizationRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.organization.not.found", new Object[]{id}));
//
//        existing.setName(dto.getName());
//        existing.setCode(dto.getCode());
//        existing.setDomain(dto.getDomain());
//        existing.setStatus(dto.getStatus());
//
//        var updated = organizationRepository.save(existing);
//        return OrganizationMapper.toDTO(updated);
//    }
//
//    @Override
//    public void deleteOrganization(Long id) {
//        organizationValidator.validateBeforeUpdate(id);
//        organizationRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public OrganizationDTO getOrganizationById(Long id) {
//        return organizationRepository.findById(id).map(OrganizationMapper::toDTO)
//                .orElseThrow(() -> new BaseException("error.organization.not.found", new Object[]{id}));
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Optional<OrganizationDTO> getByCode(String code) {
//        return organizationRepository.findByCode(code).map(OrganizationMapper::toDTO);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Optional<OrganizationDTO> getByDomain(String domain) {
//        return organizationRepository.findByDomain(domain).map(OrganizationMapper::toDTO);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<OrganizationDTO> searchOrganizations(String keyword, Pageable pageable) {
//        Page<Organization> page = organizationRepository.findAll(
//                SpecificationBuilder.of(Organization.class)
//                        .contains("name", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(OrganizationMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Organization;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.OrganizationMapper;
import com.dev.core.model.OrganizationDTO;
import com.dev.core.repository.OrganizationRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct import for RBAC
import com.dev.core.service.OrganizationService;
import com.dev.core.service.validation.OrganizationValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationValidator organizationValidator;
    private final AuthorizationService authorizationService; // ✅ Injected

    /**
     * Helper method for dynamic policy-based authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public OrganizationDTO createOrganization(OrganizationDTO dto) {
        authorize("CREATE"); // ✅ Check CREATE access for ORGANIZATION
        organizationValidator.validateBeforeCreate(dto);
        var saved = organizationRepository.save(OrganizationMapper.toEntity(dto));
        return OrganizationMapper.toDTO(saved);
    }

    @Override
    public OrganizationDTO updateOrganization(Long id, OrganizationDTO dto) {
        authorize("UPDATE"); // ✅ Check UPDATE access for ORGANIZATION
        organizationValidator.validateBeforeUpdate(id);

        var existing = organizationRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.organization.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setCode(dto.getCode());
        existing.setDomain(dto.getDomain());
        existing.setStatus(dto.getStatus());

        var updated = organizationRepository.save(existing);
        return OrganizationMapper.toDTO(updated);
    }

    @Override
    public void deleteOrganization(Long id) {
        authorize("DELETE"); // ✅ Check DELETE access for ORGANIZATION
        organizationValidator.validateBeforeUpdate(id);
        organizationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationDTO getOrganizationById(Long id) {
        authorize("READ"); // ✅ Check READ access for ORGANIZATION
        return organizationRepository.findById(id)
                .map(OrganizationMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.organization.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationDTO> getByCode(String code) {
        authorize("READ"); // ✅ Check READ access for ORGANIZATION
        return organizationRepository.findByCode(code).map(OrganizationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationDTO> getByDomain(String domain) {
        authorize("READ"); // ✅ Check READ access for ORGANIZATION
        return organizationRepository.findByDomain(domain).map(OrganizationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationDTO> searchOrganizations(String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Check READ access for ORGANIZATION
        Page<Organization> page = organizationRepository.findAll(
                SpecificationBuilder.of(Organization.class)
                        .contains("name", keyword)
                        .build(),
                pageable
        );
        return page.map(OrganizationMapper::toDTO);
    }
}
