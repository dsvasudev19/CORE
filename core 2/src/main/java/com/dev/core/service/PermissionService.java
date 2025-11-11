package com.dev.core.service;


import com.dev.core.model.PermissionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PermissionService {

    PermissionDTO createPermission(PermissionDTO dto);

    void deletePermission(Long id);

    List<PermissionDTO> getPermissions(Long organizationId);

    Page<PermissionDTO> searchPermissions(Long organizationId, String keyword, Pageable pageable);
}
