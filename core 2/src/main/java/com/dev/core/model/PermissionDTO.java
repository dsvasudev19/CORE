package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PermissionDTO extends BaseDTO {
    private ResourceDTO resource;
    private ActionDTO action;
    private String description;
}
