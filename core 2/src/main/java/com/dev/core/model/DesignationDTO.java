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
public class DesignationDTO extends BaseDTO {
    private String title;
    private String description;

    private Set<EmployeeDTO> employees;
}
