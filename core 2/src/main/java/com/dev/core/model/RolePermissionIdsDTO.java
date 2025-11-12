package com.dev.core.model;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolePermissionIdsDTO extends RoleDTO {
    private Set<Long> permissionIds;
}