//package com.dev.core.mapper;
//
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//import com.dev.core.domain.Permission;
//import com.dev.core.domain.Role;
//import com.dev.core.domain.User;
//import com.dev.core.model.RoleDTO;
//import com.dev.core.model.UserDTO;
//
//public class UserMapper {
//
//    public static UserDTO toDTO(User entity) {
//        if (entity == null) return null;
//
//        return UserDTO.builder()
//                .id(entity.getId())
//                .organizationId(entity.getOrganizationId())
//                .username(entity.getUsername())
//                .email(entity.getEmail())
//                .status(entity.getStatus())
//                .lastLoginAt(entity.getLastLoginAt())
//                .employeeId(entity.getEmployeeId())
//                .createdAt(entity.getCreatedAt())
//                .updatedAt(entity.getUpdatedAt())
//                .createdBy(entity.getCreatedBy())
//                .updatedBy(entity.getUpdatedBy())
//                .active(entity.getActive())
//                .roles(entity.getRoles() != null
//                        ? entity.getRoles().stream()
//                                .map(RoleMapper::toDTO)
//                                .collect(Collectors.toSet())
//                        : null)
//                .permissions(entity.getPermissions() != null
//                ? entity.getPermissions().stream()
//                        .map(PermissionMapper::toDTO)
//                        .collect(Collectors.toSet())
//                : null)
//                .build();
//    }
//
//    public static User toEntity(UserDTO dto) {
//        if (dto == null) return null;
//
//        User entity = new User();
//        entity.setId(dto.getId());
//        entity.setOrganizationId(dto.getOrganizationId());
//        entity.setUsername(dto.getUsername());
//        entity.setEmail(dto.getEmail());
//        entity.setStatus(dto.getStatus());
//        entity.setLastLoginAt(dto.getLastLoginAt());
//        entity.setEmployeeId(dto.getEmployeeId());
//        entity.setCreatedAt(dto.getCreatedAt());
//        entity.setUpdatedAt(dto.getUpdatedAt());
//        entity.setCreatedBy(dto.getCreatedBy());
//        entity.setUpdatedBy(dto.getUpdatedBy());
//        entity.setActive(dto.getActive());
//
//        if (dto.getRoles() != null) {
//            Set<Role> roles = dto.getRoles().stream()
//                    .map(RoleMapper::toEntity)
//                    .collect(Collectors.toSet());
//            entity.setRoles(roles);
//        }
//        
//        if (dto.getPermissions() != null) {
//            Set<Permission> permissions = dto.getPermissions().stream()
//                    .map(PermissionMapper::toEntity)
//                    .collect(Collectors.toSet());
//            entity.setPermissions(permissions);
//        }
//
//        return entity;
//    }
//
//    public static List<UserDTO> toDTOList(List<User> entities) {
//        return entities == null ? null :
//                entities.stream().map(UserMapper::toDTO).collect(Collectors.toList());
//    }
//}

package com.dev.core.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.dev.core.domain.Permission;
import com.dev.core.domain.Role;
import com.dev.core.domain.User;
import com.dev.core.model.PermissionDTO;
import com.dev.core.model.RoleDTO;
import com.dev.core.model.UserDTO;

public class UserMapper {

    public static UserDTO toDTO(User entity) {
        if (entity == null) return null;

        UserDTO dto = UserDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .status(entity.getStatus())
                .lastLoginAt(entity.getLastLoginAt())
                .employeeId(entity.getEmployeeId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                // keep original objects for internal usage
                .roles(entity.getRoles() != null
                        ? entity.getRoles().stream().map(RoleMapper::toDTO).collect(Collectors.toSet())
                        : null)
                .permissions(entity.getPermissions() != null
                        ? entity.getPermissions().stream().map(PermissionMapper::toDTO).collect(Collectors.toSet())
                        : null)

                .build();

        // --- ADD LIGHTWEIGHT ROLE NAMES ---
        if (dto.getRoles() != null) {
            dto.setRoleNames(
                    dto.getRoles().stream()
                            .map(RoleDTO::getName)
                            .collect(Collectors.toList())
            );
        }

        // --- ADD LIGHTWEIGHT PERMISSION KEYS ---
        if (dto.getPermissions() != null) {
            dto.setPermissionKeys(
                    dto.getPermissions().stream()
                            .map(UserMapper::permissionKey)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private static String permissionKey(PermissionDTO perm) {
        if (perm == null) return null;
        String res = perm.getResource() != null
                ? (perm.getResource().getCode() != null ? perm.getResource().getCode() : perm.getResource().getName())
                : "UNKNOWN_RESOURCE";

        String act = perm.getAction() != null
                ? (perm.getAction().getCode() != null ? perm.getAction().getCode() : perm.getAction().getName())
                : "UNKNOWN_ACTION";

        return res + "-" + act; // e.g. STUDENT-VIEW
    }

    public static User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User entity = new User();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setStatus(dto.getStatus());
        entity.setLastLoginAt(dto.getLastLoginAt());
        entity.setEmployeeId(dto.getEmployeeId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        // roles
        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(RoleMapper::toEntity)
                    .collect(Collectors.toSet());
            entity.setRoles(roles);
        }

        // permissions
        if (dto.getPermissions() != null) {
            Set<Permission> permissions = dto.getPermissions().stream()
                    .map(PermissionMapper::toEntity)
                    .collect(Collectors.toSet());
            entity.setPermissions(permissions);
        }

        return entity;
    }

    public static List<UserDTO> toDTOList(List<User> entities) {
        return entities == null ? null :
                entities.stream().map(UserMapper::toDTO).collect(Collectors.toList());
    }
}
