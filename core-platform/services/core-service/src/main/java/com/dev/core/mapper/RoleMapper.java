//package com.dev.core.mapper;
//
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//import com.dev.core.domain.Permission;
//import com.dev.core.domain.Role;
//import com.dev.core.model.PermissionDTO;
//import com.dev.core.model.RoleDTO;
//
//public class RoleMapper {
//
//    public static RoleDTO toDTO(Role entity) {
//        if (entity == null) return null;
//
//        return RoleDTO.builder()
//                .id(entity.getId())
//                .organizationId(entity.getOrganizationId())
//                .name(entity.getName())
//                .description(entity.getDescription())
//                .createdAt(entity.getCreatedAt())
//                .updatedAt(entity.getUpdatedAt())
//                .createdBy(entity.getCreatedBy())
//                .updatedBy(entity.getUpdatedBy())
//                .active(entity.getActive())
//                .permissions(entity.getPermissions() != null
//                        ? entity.getPermissions().stream()
//                                .map(PermissionMapper::toDTO)
//                                .collect(Collectors.toSet())
//                        : null)
//                .build();
//    }
//
//    public static Role toEntity(RoleDTO dto) {
//        if (dto == null) return null;
//
//        Role entity = new Role();
//        entity.setId(dto.getId());
//        entity.setOrganizationId(dto.getOrganizationId());
//        entity.setName(dto.getName());
//        entity.setDescription(dto.getDescription());
//        entity.setCreatedAt(dto.getCreatedAt());
//        entity.setUpdatedAt(dto.getUpdatedAt());
//        entity.setCreatedBy(dto.getCreatedBy());
//        entity.setUpdatedBy(dto.getUpdatedBy());
//        entity.setActive(dto.getActive());
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
//    public static List<RoleDTO> toDTOList(List<Role> entities) {
//        return entities == null ? null :
//                entities.stream().map(RoleMapper::toDTO).collect(Collectors.toList());
//    }
//}
package com.dev.core.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.dev.core.domain.Permission;
import com.dev.core.domain.Role;
import com.dev.core.model.PermissionDTO;
import com.dev.core.model.RoleDTO;

public class RoleMapper {

    public static RoleDTO toDTO(Role entity) {
        if (entity == null) return null;

        RoleDTO dto = RoleDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                // keep full PermissionDTO for internal use
                .permissions(entity.getPermissions() != null
                        ? entity.getPermissions().stream()
                                .map(PermissionMapper::toDTO)
                                .collect(Collectors.toSet())
                        : null)
                .build();

        // Lightweight keys for API response
        if (dto.getPermissions() != null) {
            dto.setPermissionKeys(
                    dto.getPermissions().stream()
                            .map(RoleMapper::permissionKey)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private static String permissionKey(PermissionDTO perm) {
        if (perm == null) return null;

        String resource = perm.getResource() != null
                ? (perm.getResource().getCode() != null
                    ? perm.getResource().getCode()
                    : perm.getResource().getName())
                : "UNKNOWN_RESOURCE";

        String action = perm.getAction() != null
                ? (perm.getAction().getCode() != null
                    ? perm.getAction().getCode()
                    : perm.getAction().getName())
                : "UNKNOWN_ACTION";

        return resource + "-" + action; // e.g. USER-READ
    }

    public static Role toEntity(RoleDTO dto) {
        if (dto == null) return null;

        Role entity = new Role();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        if (dto.getPermissions() != null) {
            Set<Permission> permissions = dto.getPermissions().stream()
                    .map(PermissionMapper::toEntity)
                    .collect(Collectors.toSet());
            entity.setPermissions(permissions);
        }

        return entity;
    }

    public static List<RoleDTO> toDTOList(List<Role> entities) {
        return entities == null ? null :
                entities.stream().map(RoleMapper::toDTO).collect(Collectors.toList());
    }
}

