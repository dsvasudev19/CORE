package com.dev.core.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Data
@SuperBuilder
public class TeamDTO extends BaseDTO {

    private String name;
    private String description;

    private Long departmentId;
    private DepartmentDTO department;

    private Long managerId;
    private EmployeeDTO manager;

    private Set<TeamMemberDTO> members;
}
