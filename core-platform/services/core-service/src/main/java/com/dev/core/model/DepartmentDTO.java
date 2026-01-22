package com.dev.core.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.dev.core.constants.UserStatus;

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
public class DepartmentDTO extends BaseDTO {
    private String name;
    private String description;
    private String code;

    // Relations
    private Set<EmployeeDTO> employees;
    private Set<TeamDTO> teams;
}
