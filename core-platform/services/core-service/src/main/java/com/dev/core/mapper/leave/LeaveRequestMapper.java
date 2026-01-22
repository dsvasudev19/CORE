package com.dev.core.mapper.leave;


import com.dev.core.domain.leave.LeaveRequest;
import com.dev.core.mapper.MinimalEmployeeMapper;
import com.dev.core.model.leave.LeaveRequestDTO;
import com.dev.core.model.leave.MinimalLeaveRequestDTO;

public class LeaveRequestMapper {

    private LeaveRequestMapper() {}

    public static LeaveRequestDTO toDTO(LeaveRequest entity) {
        if (entity == null) return null;

        return LeaveRequestDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())

                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : null)
                .employee(MinimalEmployeeMapper.toMinimalDTO(entity.getEmployee()))

                .leaveTypeId(entity.getLeaveType() != null ? entity.getLeaveType().getId() : null)
                .leaveType(LeaveTypeMapper.toDTO(entity.getLeaveType()))

                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .totalDays(entity.getTotalDays())

                .status(entity.getStatus())
                .reason(entity.getReason())

                .managerId(entity.getManager() != null ? entity.getManager().getId() : null)
                .manager(MinimalEmployeeMapper.toMinimalDTO(entity.getManager()))

                .managerComment(entity.getManagerComment())
                .approvedAt(entity.getApprovedAt())
                .rejectedAt(entity.getRejectedAt())

                .build();
    }

    public static MinimalLeaveRequestDTO toMinimalDTO(LeaveRequest entity) {
        if (entity == null) return null;

        return new MinimalLeaveRequestDTO(
                entity.getId(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getTotalDays(),
                entity.getStatus(),
                entity.getLeaveType() != null ? entity.getLeaveType().getId() : null,
                entity.getLeaveType() != null ? entity.getLeaveType().getName() : null
        );
    }
}
