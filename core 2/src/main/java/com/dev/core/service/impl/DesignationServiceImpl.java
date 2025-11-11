package com.dev.core.service.impl;

import com.dev.core.domain.Designation;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.DesignationMapper;
import com.dev.core.model.DesignationDTO;
import com.dev.core.repository.DesignationRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.DesignationService;
import com.dev.core.service.validation.DesignationValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;
    private final DesignationValidator designationValidator;
    private final AuthorizationService authorizationService;

    /**
     * RBAC helper
     */
    private void authorize(String action) {
        authorizationService.authorize("DESIGNATION", action);
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    @Override
    public DesignationDTO createDesignation(DesignationDTO dto) {
        authorize("CREATE");
        designationValidator.validateBeforeCreate(dto);

        Designation entity = DesignationMapper.toEntity(dto);
        Designation saved = designationRepository.save(entity);

        log.info("✅ Designation created: {} (Org={})", saved.getTitle(), saved.getOrganizationId());
        return DesignationMapper.toDTO(saved);
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    @Override
    public DesignationDTO updateDesignation(Long id, DesignationDTO dto) {
        authorize("UPDATE");
        designationValidator.validateBeforeUpdate(id, dto);

        Designation existing = designationRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.designation.notfound", new Object[]{id}));

        if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
//        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());
//        if (dto.isActive() != existing.isActive()) existing.setActive(dto.isActive());

        Designation updated = designationRepository.save(existing);
        log.info("✏️ Designation updated: {}", updated.getTitle());
        return DesignationMapper.toDTO(updated);
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @Override
    public void deleteDesignation(Long id) {
        authorize("DELETE");
        designationValidator.validateBeforeDelete(id);

        designationRepository.deleteById(id);
        log.info("🗑️ Designation deleted: {}", id);
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public DesignationDTO getDesignationById(Long id) {
        authorize("READ");
        Designation desig = designationRepository.findById(id)
                .orElseThrow(() -> new ValidationFailedException("error.designation.notfound", new Object[]{id}));
        return DesignationMapper.toDTO(desig);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DesignationDTO> getAllDesignations(Long organizationId) {
        authorize("READ");
        return designationRepository.findByOrganizationId(organizationId)
                .stream()
                .map(DesignationMapper::toDTO)
                .collect(Collectors.toList());
    }
}
