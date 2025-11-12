//package com.dev.core.service.impl;
//
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.User;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.UserMapper;
//import com.dev.core.model.UserDTO;
//import com.dev.core.repository.UserRepository;
//import com.dev.core.service.UserService;
//import com.dev.core.service.validation.UserValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class UserServiceImpl implements UserService {
//
//    private final UserRepository userRepository;
//    private final UserValidator userValidator;
//
//    @Override
//    public UserDTO createUser(UserDTO dto) {
//        userValidator.validateBeforeCreate(dto);
//
//        User entity = UserMapper.toEntity(dto);
//        // If password handling required, do it here (hashing) before save.
//        User saved = userRepository.save(entity);
//        return UserMapper.toDTO(saved);
//    }
//
//    @Override
//    public UserDTO updateUser(Long id, UserDTO dto) {
//        userValidator.validateBeforeUpdate(id, dto); // if method expects dto, else validateBeforeUpdate(id)
//        User existing = userRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{id}));
//
//        // Update fields (only allowed fields)
//        existing.setUsername(dto.getUsername());
//        existing.setEmail(dto.getEmail());
//        existing.setStatus(dto.getStatus());
//        existing.setEmployeeId(dto.getEmployeeId());
//        // update roles if provided
//        if (dto.getRoles() != null) {
//            existing.setRoles(dto.getRoles().stream().map(r -> com.dev.core.mapper.RoleMapper.toEntity(r)).collect(Collectors.toSet()));
//        }
//
//        User updated = userRepository.save(existing);
//        return UserMapper.toDTO(updated);
//    }
//
//    @Override
//    public void deleteUser(Long id) {
//        if (id == null) throw new BaseException("error.user.id.required");
//        if (!userRepository.existsById(id)) throw new BaseException("error.user.not.found", new Object[]{id});
//        userRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public UserDTO getUserById(Long id) {
//        return userRepository.findById(id).map(UserMapper::toDTO)
//                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{id}));
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Optional<UserDTO> getUserByEmail(String email) {
//        return userRepository.findByEmail(email).map(UserMapper::toDTO);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<UserDTO> getAllUsers(Long organizationId) {
//        return userRepository.findByOrganizationId(organizationId)
//                .stream().map(UserMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<UserDTO> searchUsers(Long organizationId, String keyword, Pageable pageable) {
//        Page<User> page = userRepository.findAll(
//                SpecificationBuilder.of(User.class)
//                        .equals("organizationId", organizationId)
//                        .contains("username", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(UserMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Permission;
import com.dev.core.domain.Policy;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.RoleMapper;
import com.dev.core.mapper.UserMapper;
import com.dev.core.model.UserDTO;
import com.dev.core.model.UserPermissionIdsDTO;
import com.dev.core.repository.PermissionRepository;
import com.dev.core.repository.PolicyRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct import
import com.dev.core.service.UserService;
import com.dev.core.service.validation.UserValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final AuthorizationService authorizationService; // ✅ Injected for RBAC
    private final PasswordEncoder passwordEncoder;
    private final PolicyRepository policyRepository;
    private final PermissionRepository permissionRepository;
    /**
     * Helper method to perform dynamic policy-based authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public UserDTO createUser(UserDTO dto) {
        authorize("CREATE"); // ✅ Check if current user can CREATE USER
        userValidator.validateBeforeCreate(dto);

        User entity = UserMapper.toEntity(dto);
        // If password hashing required, handle it here before saving.
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        User saved = userRepository.save(entity);
        return UserMapper.toDTO(saved);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {
        authorize("UPDATE"); // ✅ Check if current user can UPDATE USER
        userValidator.validateBeforeUpdate(id, dto);

        User existing = userRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{id}));

        existing.setUsername(dto.getUsername());
        existing.setEmail(dto.getEmail());
        existing.setStatus(dto.getStatus());
        existing.setEmployeeId(dto.getEmployeeId());

        // Update roles if provided
        if (dto.getRoles() != null) {
            existing.setRoles(dto.getRoles().stream()
                    .map(RoleMapper::toEntity)
                    .collect(Collectors.toSet()));
        }

        User updated = userRepository.save(existing);
        return UserMapper.toDTO(updated);
    }

    @Override
    public void deleteUser(Long id) {
        authorize("DELETE"); // ✅ Check if current user can DELETE USER
        if (id == null) throw new BaseException("error.user.id.required");
        if (!userRepository.existsById(id)) {
            throw new BaseException("error.user.not.found", new Object[]{id});
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        authorize("READ"); // ✅ Check if current user can READ USER
        return userRepository.findById(id)
                .map(UserMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserByEmail(String email) {
        authorize("READ"); // ✅ Check if current user can READ USER
        return userRepository.findByEmail(email).map(UserMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers(Long organizationId) {
        authorize("READ"); // ✅ Check if current user can READ USER
        return userRepository.findByOrganizationId(organizationId)
                .stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> searchUsers(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Check if current user can READ USER
        Page<User> page = userRepository.findAll(
                SpecificationBuilder.of(User.class)
                        .equals("organizationId", organizationId)
                        .contains("username", keyword)
                        .build(),
                pageable
        );
        return page.map(UserMapper::toDTO);
    }

    @Override
    @Transactional
    public UserDTO assignPermissionsToUser(Long userId, UserPermissionIdsDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("User not found: " + userId));

        Set<Permission> permissionsToAdd = new HashSet<>(permissionRepository.findAllById(dto.getPermissionIds()));

        if (user.getPermissions() == null) {
            user.setPermissions(new HashSet<>());
        }
        user.getPermissions().addAll(permissionsToAdd);

        User savedUser = userRepository.save(user);

        for (Permission perm : permissionsToAdd) {
            boolean exists = policyRepository.existsByUserIdAndResourceIdAndActionId(
                    userId, perm.getResource().getId(), perm.getAction().getId());
            if (!exists) {
                Policy policy = new Policy();
                policy.setUser(user);
                policy.setResource(perm.getResource());
                policy.setAction(perm.getAction());
                policy.setOrganizationId(user.getOrganizationId());
                policyRepository.save(policy);
            }
        }

        return UserMapper.toDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO removePermissionsFromUser(Long userId, UserPermissionIdsDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("User not found: " + userId));

        Set<Permission> permissionsToRemove = new HashSet<>(permissionRepository.findAllById(dto.getPermissionIds()));

        if (user.getPermissions() != null) {
            user.getPermissions().removeAll(permissionsToRemove);
        }
        User savedUser = userRepository.save(user);

        for (Permission perm : permissionsToRemove) {
            List<Policy> policies = policyRepository.findAllByUserIdAndResourceIdAndActionId(
                    userId, perm.getResource().getId(), perm.getAction().getId());
            policyRepository.deleteAll(policies);
        }

        return UserMapper.toDTO(savedUser);
    }

}
