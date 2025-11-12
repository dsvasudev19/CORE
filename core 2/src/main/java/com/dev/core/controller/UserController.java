package com.dev.core.controller;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.UserDTO;
import com.dev.core.model.UserPermissionIdsDTO;
import com.dev.core.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserDTO dto) {
        return helper.success("User created successfully", userService.createUser(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserDTO dto) {
        return helper.success("User updated successfully", userService.updateUser(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return helper.success("User deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return helper.success("User fetched", userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam Long organizationId) {
    	log.info("Getting inside the user controller",organizationId);
        List<UserDTO> list = userService.getAllUsers(organizationId);
        return helper.success("Users fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long organizationId,
                                    @RequestParam(required = false) String keyword,
                                    Pageable pageable) {
        Page<UserDTO> result = userService.searchUsers(organizationId, keyword, pageable);
        return helper.success("Users searched", result);
    }
    @PatchMapping("/{id}/permissions/assign")
    public ResponseEntity<?> assignPermissions(@PathVariable Long id,
                                               @RequestBody UserPermissionIdsDTO dto) {
        UserDTO updatedUser = userService.assignPermissionsToUser(id, dto);
        return helper.success("Permissions assigned to user successfully", updatedUser);
    }

    /**
     * Remove permissions from user by permission IDs.
     */
    @PatchMapping("/{id}/permissions/remove")
    public ResponseEntity<?> removePermissions(@PathVariable Long id,
                                               @RequestBody UserPermissionIdsDTO dto) {
        UserDTO updatedUser = userService.removePermissionsFromUser(id, dto);
        return helper.success("Permissions removed from user successfully", updatedUser);
    }
}
