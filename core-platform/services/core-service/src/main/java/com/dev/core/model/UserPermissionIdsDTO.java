package com.dev.core.model;

import java.util.Set;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissionIdsDTO {
    private Set<Long> permissionIds;
}
