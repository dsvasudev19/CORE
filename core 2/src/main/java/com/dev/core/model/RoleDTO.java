package com.dev.core.model;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO extends BaseDTO {
    private String name;
    private String description;
    private Set<PermissionDTO> permissions;
}
