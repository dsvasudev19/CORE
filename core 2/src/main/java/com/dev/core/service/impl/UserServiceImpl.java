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

import com.dev.core.constants.ProfileType;
import com.dev.core.domain.ClientRepresentative;
import com.dev.core.domain.Employee;
import com.dev.core.domain.Permission;
import com.dev.core.domain.Policy;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.RoleMapper;
import com.dev.core.mapper.UserMapper;
import com.dev.core.model.UserDTO;
import com.dev.core.model.UserPermissionIdsDTO;
import com.dev.core.repository.ClientRepresentativeRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.PermissionRepository;
import com.dev.core.repository.PolicyRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct import
import com.dev.core.service.NotificationService;
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
    private final EmployeeRepository employeeRepository;
    private final ClientRepresentativeRepository clientRepresentativeRepository;
    private final NotificationService notificationService;
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

        Set<Permission> permissionsToAdd =
                new HashSet<>(permissionRepository.findAllById(dto.getPermissionIds()));

        if (user.getPermissions() == null) {
            user.setPermissions(new HashSet<>());
        }

        user.getPermissions().addAll(permissionsToAdd);

        User savedUser = userRepository.save(user);

        for (Permission perm : permissionsToAdd) {

            Long resourceId = perm.getResource().getId();
            Long actionId   = perm.getAction().getId();

            boolean exists = policyRepository.existsByUserIdAndResourceIdAndActionId(
                    userId, resourceId, actionId
            );

            if (!exists) {

                // --- 🔥 Auto-generate description: <RESOURCE>-<ACTION> ---
                String resourceCode = perm.getResource().getCode();
                String actionCode   = perm.getAction().getCode();
                String description  = resourceCode + " - " + actionCode;

                Policy policy = new Policy();
                policy.setUser(user);
                policy.setResource(perm.getResource());
                policy.setAction(perm.getAction());
                policy.setOrganizationId(user.getOrganizationId());
                policy.setDescription(description);  // 🚀 auto-set description
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
    
    @Override
    public UserDTO createUserForEmployee(Long employeeId, UserDTO dto) {
        authorize("CREATE");

        // create user as usual
        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);

        // attach to employee
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{employeeId}));

        employee.setUser(user);
        employeeRepository.save(employee);
        
     // 🔔 Send email notification
        String subject = "Your DevCore Account Has Been Created";
        String body = "Hello " + dto.getUsername() + ",\n\n"
                + "Your user account has been successfully created and linked to your employee profile.\n"
                + "You can now log in using your credentials.\n\n"
                + "Regards,\nDevCore Team";

        notificationService.sendEmail(dto.getEmail(), subject, body);


        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO createUserForClientRepresentative(Long representativeId, UserDTO dto) {
        authorize("CREATE");

        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);

        ClientRepresentative rep = clientRepresentativeRepository.findById(representativeId)
            .orElseThrow(() -> new BaseException("error.client.representative.not.found", new Object[]{representativeId}));

        rep.setUser(user);
        clientRepresentativeRepository.save(rep);
        
     // 🔔 Send email notification
        String subject = "Your DevCore Account Is Ready";
        String body = "Hello " + dto.getUsername() + ",\n\n"
                + "Your DevCore user account has been created and linked to your client representative profile.\n"
                + "Please use your credentials to log in.\n\n"
                + "Regards,\nDevCore Team";

        notificationService.sendEmail(dto.getEmail(), subject, body);


        return UserMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO createUserAndLink(Long profileId, UserDTO dto, ProfileType type) {
        
        userValidator.validateBeforeCreate(dto);

        // create user entity and persist
        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);

        // link depending on profile type
        if (ProfileType.EMPLOYEE.equals(type)) {
            Employee employee = employeeRepository.findById(profileId)
                    .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{profileId}));
            if (employee.getUser() != null) {
                throw new BaseException("error.employee.user.already.linked");
            }
            employee.setUser(user);
            employeeRepository.save(employee);
        } else if (ProfileType.CLIENT_REPRESENTATIVE.equals(type)) {
            ClientRepresentative rep = clientRepresentativeRepository.findById(profileId)
                    .orElseThrow(() -> new BaseException("error.client.representative.not.found", new Object[]{profileId}));
            if (rep.getUser() != null) {
                throw new BaseException("error.client.representative.user.already.linked");
            }
            rep.setUser(user);
            clientRepresentativeRepository.save(rep);
        } else {
            // Unknown type
            throw new BaseException("error.profile.type.unsupported");
        }
        
        // 🔔 Send email notification
        String subject = "DevCore User Account Created";
        String body = "Hello " + dto.getUsername() + ",\n\n"
                + "Your DevCore account has been created and successfully linked to your "
                + type.name().replace("_", " ").toLowerCase() + " profile.\n"
                + "You can now log in using your credentials.\n\n"
                + "Regards,\nDevCore Team";

        notificationService.sendEmail(dto.getEmail(), subject, body);


        return UserMapper.toDTO(user);
    }


}
