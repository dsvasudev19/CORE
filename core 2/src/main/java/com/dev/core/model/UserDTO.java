package com.dev.core.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.dev.core.constants.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO extends BaseDTO {
    private String username;
    private String email;
    private String password;
    private UserStatus status;
    private LocalDateTime lastLoginAt;
    private Long employeeId;
    @JsonIgnore
    private Set<RoleDTO> roles;
    @JsonIgnore
    private Set<PermissionDTO> permissions;   // ✅ NEW LINE
    
    private List<String> roleNames;       // Only role names
    private List<String> permissionKeys;  // resource-action format

}
