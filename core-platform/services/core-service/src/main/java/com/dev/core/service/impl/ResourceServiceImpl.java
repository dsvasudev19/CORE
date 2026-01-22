//package com.dev.core.service.impl;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.ResourceEntity;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.ResourceMapper;
//import com.dev.core.model.ResourceDTO;
//import com.dev.core.repository.ResourceRepository;
//import com.dev.core.service.ResourceService;
//import com.dev.core.service.validation.ResourceValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class ResourceServiceImpl implements ResourceService {
//
//    private final ResourceRepository resourceRepository;
//    private final ResourceValidator resourceValidator;
//
//    @Override
//    public ResourceDTO createResource(ResourceDTO dto) {
//        resourceValidator.validateBeforeCreate(dto);
//        ResourceEntity saved = resourceRepository.save(ResourceMapper.toEntity(dto));
//        return ResourceMapper.toDTO(saved);
//    }
//
//    @Override
//    public ResourceDTO updateResource(Long id, ResourceDTO dto) {
//        resourceValidator.validateBeforeUpdate(id);
//        ResourceEntity existing = resourceRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.resource.not.found", new Object[]{id}));
//
//        existing.setName(dto.getName());
//        existing.setCode(dto.getCode());
//        existing.setDescription(dto.getDescription());
//
//        return ResourceMapper.toDTO(resourceRepository.save(existing));
//    }
//
//    @Override
//    public void deleteResource(Long id) {
//        resourceValidator.validateBeforeUpdate(id);
//        resourceRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public ResourceDTO getResourceById(Long id) {
//        return resourceRepository.findById(id).map(ResourceMapper::toDTO)
//                .orElseThrow(() -> new BaseException("error.resource.not.found", new Object[]{id}));
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ResourceDTO> getResources(Long organizationId) {
//        return resourceRepository.findAllByOrganizationId(organizationId)
//                .stream().map(ResourceMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<ResourceDTO> searchResources(Long organizationId, String keyword, Pageable pageable) {
//        Page<ResourceEntity> page = resourceRepository.findAll(
//                SpecificationBuilder.of(ResourceEntity.class)
//                        .equals("organizationId", organizationId)
//                        .contains("name", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(ResourceMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.ResourceEntity;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ResourceMapper;
import com.dev.core.model.ResourceDTO;
import com.dev.core.repository.ResourceRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct import for RBAC
import com.dev.core.service.ResourceService;
import com.dev.core.service.validation.ResourceValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceValidator resourceValidator;
    private final AuthorizationService authorizationService; // ✅ Injected

    /**
     * Helper for performing dynamic policy-based authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public ResourceDTO createResource(ResourceDTO dto) {
        authorize("CREATE"); // ✅ Ensure user can CREATE RESOURCE
        resourceValidator.validateBeforeCreate(dto);

        ResourceEntity saved = resourceRepository.save(ResourceMapper.toEntity(dto));
        return ResourceMapper.toDTO(saved);
    }

    @Override
    public ResourceDTO updateResource(Long id, ResourceDTO dto) {
        authorize("UPDATE"); // ✅ Ensure user can UPDATE RESOURCE
        resourceValidator.validateBeforeUpdate(id);

        ResourceEntity existing = resourceRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.resource.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setCode(dto.getCode());
        existing.setDescription(dto.getDescription());

        return ResourceMapper.toDTO(resourceRepository.save(existing));
    }

    @Override
    public void deleteResource(Long id) {
        authorize("DELETE"); // ✅ Ensure user can DELETE RESOURCE
        resourceValidator.validateBeforeUpdate(id);
        resourceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceDTO getResourceById(Long id) {
        authorize("READ"); // ✅ Ensure user can READ RESOURCE
        return resourceRepository.findById(id)
                .map(ResourceMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.resource.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceDTO> getResources(Long organizationId) {
        authorize("READ"); // ✅ Ensure user can READ RESOURCE
        return resourceRepository.findAllByOrganizationId(organizationId)
                .stream()
                .map(ResourceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResourceDTO> searchResources(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Ensure user can READ RESOURCE
        Page<ResourceEntity> page = resourceRepository.findAll(
                SpecificationBuilder.of(ResourceEntity.class)
                        .equals("organizationId", organizationId)
                        .contains("name", keyword)
                        .build(),
                pageable
        );
        return page.map(ResourceMapper::toDTO);
    }
}
