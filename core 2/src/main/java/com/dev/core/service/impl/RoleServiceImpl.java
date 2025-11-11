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
//import com.dev.core.domain.Role;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.RoleMapper;
//import com.dev.core.model.RoleDTO;
//import com.dev.core.repository.RoleRepository;
//import com.dev.core.service.RoleService;
//import com.dev.core.service.validation.RoleValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class RoleServiceImpl implements RoleService {
//
//    private final RoleRepository roleRepository;
//    private final RoleValidator roleValidator;
//
//    @Override
//    public RoleDTO createRole(RoleDTO dto) {
//        roleValidator.validateBeforeCreate(dto);
//        Role saved = roleRepository.save(RoleMapper.toEntity(dto));
//        return RoleMapper.toDTO(saved);
//    }
//
//    @Override
//    public RoleDTO updateRole(Long id, RoleDTO dto) {
//        roleValidator.validateBeforeUpdate(id);
//        Role existing = roleRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.role.not.found", new Object[]{id}));
//
//        existing.setName(dto.getName());
//        existing.setDescription(dto.getDescription());
//
//        if (dto.getPermissions() != null) {
//            existing.setPermissions(dto.getPermissions().stream()
//                    .map(p -> com.dev.core.mapper.PermissionMapper.toEntity(p)).collect(Collectors.toSet()));
//        }
//
//        return RoleMapper.toDTO(roleRepository.save(existing));
//    }
//
//    @Override
//    public void deleteRole(Long id) {
//        roleValidator.validateBeforeUpdate(id); // reuse to check existence
//        roleRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public RoleDTO getRoleById(Long id) {
//        return roleRepository.findById(id).map(RoleMapper::toDTO)
//                .orElseThrow(() -> new BaseException("error.role.not.found", new Object[]{id}));
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<RoleDTO> getRolesByOrganization(Long organizationId) {
//        return roleRepository.findAllByOrganizationId(organizationId).stream()
//                .map(RoleMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<RoleDTO> searchRoles(Long organizationId, String keyword, Pageable pageable) {
//        Page<Role> page = roleRepository.findAll(
//                SpecificationBuilder.of(Role.class)
//                        .equals("organizationId", organizationId)
//                        .contains("name", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(RoleMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Role;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.PermissionMapper;
import com.dev.core.mapper.RoleMapper;
import com.dev.core.model.RoleDTO;
import com.dev.core.repository.RoleRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.RoleService;
import com.dev.core.service.validation.RoleValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleValidator roleValidator;
    private final AuthorizationService authorizationService; // ✅ Injected

    // Small helper for automatic resource name inference
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public RoleDTO createRole(RoleDTO dto) {
        authorize("CREATE"); // ✅ dynamic RBAC
        roleValidator.validateBeforeCreate(dto);

        Role saved = roleRepository.save(RoleMapper.toEntity(dto));
        return RoleMapper.toDTO(saved);
    }

    @Override
    public RoleDTO updateRole(Long id, RoleDTO dto) {
        authorize("UPDATE"); // ✅ dynamic RBAC
        roleValidator.validateBeforeUpdate(id);

        Role existing = roleRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.role.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());

        if (dto.getPermissions() != null) {
            existing.setPermissions(dto.getPermissions().stream()
                    .map(PermissionMapper::toEntity)
                    .collect(Collectors.toSet()));
        }

        return RoleMapper.toDTO(roleRepository.save(existing));
    }

    @Override
    public void deleteRole(Long id) {
        authorize("DELETE"); // ✅ dynamic RBAC
        roleValidator.validateBeforeUpdate(id); // reuse to check existence
        roleRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDTO getRoleById(Long id) {
        authorize("READ"); // ✅ dynamic RBAC
        return roleRepository.findById(id)
                .map(RoleMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.role.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleDTO> getRolesByOrganization(Long organizationId) {
        authorize("READ"); // ✅ dynamic RBAC
        return roleRepository.findAllByOrganizationId(organizationId)
                .stream()
                .map(RoleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoleDTO> searchRoles(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ"); // ✅ dynamic RBAC
        Page<Role> page = roleRepository.findAll(
                SpecificationBuilder.of(Role.class)
                        .equals("organizationId", organizationId)
                        .contains("name", keyword)
                        .build(),
                pageable
        );
        return page.map(RoleMapper::toDTO);
    }
}
