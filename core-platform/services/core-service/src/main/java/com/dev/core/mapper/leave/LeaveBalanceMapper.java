package com.dev.core.mapper.leave;


import com.dev.core.domain.leave.LeaveBalance;
import com.dev.core.mapper.MinimalEmployeeMapper;
import com.dev.core.model.leave.LeaveBalanceDTO;
import com.dev.core.model.leave.MinimalLeaveBalanceDTO;

public class LeaveBalanceMapper {

    private LeaveBalanceMapper() {}

    public static LeaveBalanceDTO toDTO(LeaveBalance entity) {
        if (entity == null) return null;

        return LeaveBalanceDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())

                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .employee(MinimalEmployeeMapper.toMinimalDTO(entity.getEmployee()))

                .leaveTypeId(entity.getLeaveType() != null ? entity.getLeaveType().getId() : null)
                .leaveType(LeaveTypeMapper.toDTO(entity.getLeaveType()))

                .year(entity.getYear())
                .openingBalance(entity.getOpeningBalance())
                .earned(entity.getEarned())
                .used(entity.getUsed())
                .closingBalance(entity.getClosingBalance())

                .build();
    }

    public static MinimalLeaveBalanceDTO toMinimalDTO(LeaveBalance entity) {
        if (entity == null) return null;

        return new MinimalLeaveBalanceDTO(
                entity.getLeaveType() != null ? entity.getLeaveType().getId() : null,
                entity.getLeaveType() != null ? entity.getLeaveType().getName() : null,
                entity.getOpeningBalance(),
                entity.getEarned(),
                entity.getUsed(),
                entity.getClosingBalance()
        );
    }
}
