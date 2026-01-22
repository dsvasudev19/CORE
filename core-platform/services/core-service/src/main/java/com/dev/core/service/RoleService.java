package com.dev.core.service;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dev.core.model.RoleDTO;
import com.dev.core.model.RolePermissionIdsDTO;

public interface RoleService {

    RoleDTO createRole(RoleDTO dto);

    RoleDTO updateRole(Long id, RoleDTO dto);

    void deleteRole(Long id);

    RoleDTO getRoleById(Long id);

    List<RoleDTO> getRolesByOrganization(Long organizationId);

    Page<RoleDTO> searchRoles(Long organizationId, String keyword, Pageable pageable);
    
    RoleDTO assignPermissionsToRole(Long roleId, RolePermissionIdsDTO dto);

    RoleDTO removePermissionsFromRole(Long roleId, RolePermissionIdsDTO dto);
}
