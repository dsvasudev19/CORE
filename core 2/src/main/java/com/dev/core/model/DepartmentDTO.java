package com.dev.core.model;

import java.util.Set;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@Getter
@Setter
public class DepartmentDTO extends BaseDTO {
    private String name;
    private String description;

    // Relations
    private Set<EmployeeDTO> employees;
    private Set<TeamDTO> teams;
}
