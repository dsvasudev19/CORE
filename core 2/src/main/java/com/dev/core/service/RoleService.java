package com.dev.core.service;


import com.dev.core.model.RoleDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoleService {

    RoleDTO createRole(RoleDTO dto);

    RoleDTO updateRole(Long id, RoleDTO dto);

    void deleteRole(Long id);

    RoleDTO getRoleById(Long id);

    List<RoleDTO> getRolesByOrganization(Long organizationId);

    Page<RoleDTO> searchRoles(Long organizationId, String keyword, Pageable pageable);
}
