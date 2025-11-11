package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.TeamDTO;
import com.dev.core.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeamValidator {

    private final TeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public void validateBeforeCreate(TeamDTO dto) {
        if (dto == null)
            throw new ValidationFailedException("error.team.null", "Team data cannot be null");

        if (dto.getName() == null || dto.getName().isBlank())
            throw new ValidationFailedException("error.team.name.required", "Team name is required");

        boolean exists = teamRepository.existsByNameAndOrganizationId(dto.getName(), dto.getOrganizationId());
        if (exists)
            throw new ValidationFailedException("error.team.name.exists", new Object[]{dto.getName()});

        if (dto.getDepartmentId() != null && !departmentRepository.existsById(dto.getDepartmentId()))
            throw new ValidationFailedException("error.department.notfound", new Object[]{dto.getDepartmentId()});
    }

    public void validateBeforeUpdate(Long id, TeamDTO dto) {
        if (id == null)
            throw new ValidationFailedException("error.team.id.required", "Team ID is required");

        if (!teamRepository.existsById(id))
            throw new ValidationFailedException("error.team.notfound", new Object[]{id});
    }

    public void validateAddMember(Long teamId, Long employeeId) {
        if (teamId == null || employeeId == null)
            throw new ValidationFailedException("error.team.member.invalid", "Team and Employee IDs are required");

        if (!teamRepository.existsById(teamId))
            throw new ValidationFailedException("error.team.notfound", new Object[]{teamId});

        if (!employeeRepository.existsById(employeeId))
            throw new ValidationFailedException("error.employee.notfound", new Object[]{employeeId});
    }
}
