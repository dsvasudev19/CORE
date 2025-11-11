package com.dev.core.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@Getter
@Setter
public class TeamMemberDTO extends BaseDTO {

    private Long teamId;
    private TeamDTO team;

    private Long employeeId;
    private EmployeeDTO employee;

    private boolean isLead;
    private boolean isManager;
}
