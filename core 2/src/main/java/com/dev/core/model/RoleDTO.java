package com.dev.core.model;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    private Set<PermissionDTO> permissions;
    private List<String> permissionKeys;

}
