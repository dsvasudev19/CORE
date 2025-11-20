package com.dev.core.model;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DesignationDTO extends BaseDTO {
    private String title;
    private String description;
    private String code;

    private Set<EmployeeDTO> employees;
}
