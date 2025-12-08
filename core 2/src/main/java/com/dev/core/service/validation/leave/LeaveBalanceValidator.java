package com.dev.core.service.validation.leave;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.leave.LeaveBalanceDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.leave.LeaveBalanceRepository;
import com.dev.core.repository.leave.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveBalanceValidator {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final EmployeeRepository employeeRepository;

    public void validateBeforeInitialize(LeaveBalanceDTO dto) {

        if (dto == null)
            throw new ValidationFailedException("error.leaveBalance.null", null);

        if (dto.getEmployeeId() == null)
            throw new ValidationFailedException("error.leaveBalance.employee.required", null);

        if (!employeeRepository.existsById(dto.getEmployeeId()))
            throw new ValidationFailedException(
                    "error.leaveBalance.employee.notfound",
                    new Object[]{dto.getEmployeeId()}
            );

        if (dto.getLeaveTypeId() == null)
            throw new ValidationFailedException("error.leaveBalance.type.required", null);

        if (!leaveTypeRepository.existsById(dto.getLeaveTypeId()))
            throw new ValidationFailedException(
                    "error.leaveBalance.type.notfound",
                    new Object[]{dto.getLeaveTypeId()}
            );

        if (dto.getYear() == null)
            throw new ValidationFailedException("error.leaveBalance.year.required", null);

        if (leaveBalanceRepository.existsByEmployeeIdAndLeaveTypeIdAndYear(
                dto.getEmployeeId(), dto.getLeaveTypeId(), dto.getYear()))
        {
            throw new ValidationFailedException(
                    "error.leaveBalance.exists",
                    new Object[]{dto.getEmployeeId(), dto.getLeaveTypeId(), dto.getYear()}
            );
        }
    }

    public void validateExists(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.leaveBalance.id.required", null);

        if (!leaveBalanceRepository.existsById(id))
            throw new ValidationFailedException("error.leaveBalance.notfound", new Object[]{id});
    }
}
