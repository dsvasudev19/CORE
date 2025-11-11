//package com.dev.core.service.impl;
//
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.Permission;
//import com.dev.core.mapper.PermissionMapper;
//import com.dev.core.model.PermissionDTO;
//import com.dev.core.repository.PermissionRepository;
//import com.dev.core.service.PermissionService;
//import com.dev.core.service.validation.PermissionValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class PermissionServiceImpl implements PermissionService {
//
//    private final PermissionRepository permissionRepository;
//    private final PermissionValidator permissionValidator;
//
//    @Override
//    public PermissionDTO createPermission(PermissionDTO dto) {
//        permissionValidator.validateBeforeCreate(dto);
//        Permission entity = PermissionMapper.toEntity(dto);
//        Permission saved = permissionRepository.save(entity);
//        return PermissionMapper.toDTO(saved);
//    }
//
//    @Override
//    public void deletePermission(Long id) {
//        permissionValidator.validateBeforeDelete(id);
//        permissionRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<PermissionDTO> getPermissions(Long organizationId) {
//        return permissionRepository.findAllByOrganizationId(organizationId)
//                .stream().map(PermissionMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<PermissionDTO> searchPermissions(Long organizationId, String keyword, Pageable pageable) {
//        Page<Permission> page = permissionRepository.findAll(
//                SpecificationBuilder.of(Permission.class)
//                        .equals("organizationId", organizationId)
//                        .contains("description", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(PermissionMapper::toDTO);
//    }
//}

package com.dev.core.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Permission;
import com.dev.core.mapper.PermissionMapper;
import com.dev.core.model.PermissionDTO;
import com.dev.core.repository.PermissionRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct RBAC import
import com.dev.core.service.PermissionService;
import com.dev.core.service.validation.PermissionValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionValidator permissionValidator;
    private final AuthorizationService authorizationService; // ✅ Injected for dynamic authorization

    /**
     * Helper for dynamic policy-based authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public PermissionDTO createPermission(PermissionDTO dto) {
        authorize("CREATE"); // ✅ Ensure user has CREATE permission
        permissionValidator.validateBeforeCreate(dto);

        Permission entity = PermissionMapper.toEntity(dto);
        Permission saved = permissionRepository.save(entity);
        return PermissionMapper.toDTO(saved);
    }

    @Override
    public void deletePermission(Long id) {
        authorize("DELETE"); // ✅ Ensure user has DELETE permission
        permissionValidator.validateBeforeDelete(id);
        permissionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> getPermissions(Long organizationId) {
        authorize("READ"); // ✅ Ensure user has READ permission
        return permissionRepository.findAllByOrganizationId(organizationId)
                .stream()
                .map(PermissionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PermissionDTO> searchPermissions(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Ensure user has READ permission
        Page<Permission> page = permissionRepository.findAll(
                SpecificationBuilder.of(Permission.class)
                        .equals("organizationId", organizationId)
                        .contains("description", keyword)
                        .build(),
                pageable
        );
        return page.map(PermissionMapper::toDTO);
    }
}
