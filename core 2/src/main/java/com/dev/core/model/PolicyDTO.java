package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyDTO extends BaseDTO {
    private RoleDTO role;
    private ResourceDTO resource;
    private ActionDTO action;
    private String condition;
    private String description;
}
