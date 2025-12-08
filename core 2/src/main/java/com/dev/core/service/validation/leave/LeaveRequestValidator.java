package com.dev.core.service.validation.leave;

import com.dev.core.constants.LeaveStatus;
import com.dev.core.domain.leave.LeaveRequest;
import com.dev.core.exception.UnauthorizedAccessException;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.leave.LeaveRequestDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.leave.LeaveBalanceRepository;
import com.dev.core.repository.leave.LeaveRequestRepository;
import com.dev.core.repository.leave.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveRequestValidator {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public void validateBeforeCreate(LeaveRequestDTO dto) {

        if (dto == null)
            throw new ValidationFailedException("error.leaveRequest.null", null);

        if (dto.getEmployeeId() == null)
            throw new ValidationFailedException("error.leaveRequest.employee.required", null);

        if (!employeeRepository.existsById(dto.getEmployeeId()))
            throw new ValidationFailedException(
                    "error.leaveRequest.employee.notfound",
                    new Object[]{dto.getEmployeeId()}
            );

        if (dto.getLeaveTypeId() == null)
            throw new ValidationFailedException("error.leaveRequest.type.required", null);

        if (!leaveTypeRepository.existsById(dto.getLeaveTypeId()))
            throw new ValidationFailedException(
                    "error.leaveRequest.type.notfound",
                    new Object[]{dto.getLeaveTypeId()}
            );

        if (dto.getStartDate() == null)
            throw new ValidationFailedException("error.leaveRequest.startdate.required", null);

        if (dto.getEndDate() == null)
            throw new ValidationFailedException("error.leaveRequest.enddate.required", null);

        if (dto.getEndDate().isBefore(dto.getStartDate()))
            throw new ValidationFailedException("error.leaveRequest.date.invalid", null);

        // Ensure balance exists for this year
        int year = dto.getStartDate().getYear();

        if (!leaveBalanceRepository.existsByEmployeeIdAndLeaveTypeIdAndYear(
                dto.getEmployeeId(), dto.getLeaveTypeId(), year))
        {
            throw new ValidationFailedException(
                    "error.leaveRequest.balance.notfound",
                    new Object[]{dto.getEmployeeId(), dto.getLeaveTypeId(), year}
            );
        }
    }

    public void validateBeforeUpdate(Long id) {
        if (id == null)
            throw new ValidationFailedException("error.leaveRequest.id.required", null);

        if (!leaveRequestRepository.existsById(id))
            throw new ValidationFailedException("error.leaveRequest.notfound", new Object[]{id});
    }

    public void validateBeforeApproval(Long id, Long managerId) {
        if (!leaveRequestRepository.existsById(id))
            throw new ValidationFailedException("error.leaveRequest.notfound", new Object[]{id});

        if (managerId == null)
            throw new ValidationFailedException("error.leaveRequest.manager.required", null);
    }
    
    public void validateManagerAuthorization(Long requestId, Long managerId) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ValidationFailedException("error.leaveRequest.notfound", new Object[]{requestId})
                );

        if (managerId == null)
            throw new ValidationFailedException("error.leaveRequest.manager.required", null);

        Long actualManagerId = request.getEmployee().getManager() != null
                ? request.getEmployee().getManager().getId()
                : null;

        if (actualManagerId == null)
            throw new UnauthorizedAccessException("This employee has no assigned manager.");

        if (!actualManagerId.equals(managerId))
            throw new UnauthorizedAccessException("You are not authorized to approve this leave request.");
    }
}
