package com.dev.core.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.PermissionDTO;
import com.dev.core.service.PermissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PermissionDTO dto) {
        return helper.success("Permission created successfully", permissionService.createPermission(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return helper.success("Permission deleted successfully");
    }

    @GetMapping
    public ResponseEntity<?> getByOrganization(@RequestParam Long organizationId) {
        List<PermissionDTO> list = permissionService.getPermissions(organizationId);
        return helper.success("Permissions fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long organizationId,
                                    @RequestParam(required = false) String keyword,
                                    Pageable pageable) {
        Page<PermissionDTO> result = permissionService.searchPermissions(organizationId, keyword, pageable);
        return helper.success("Permissions searched", result);
    }
}
