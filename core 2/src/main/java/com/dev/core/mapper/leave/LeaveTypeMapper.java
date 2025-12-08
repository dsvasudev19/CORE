
package com.dev.core.mapper.leave;

import com.dev.core.domain.leave.LeaveType;
import com.dev.core.model.leave.LeaveTypeDTO;
import com.dev.core.model.leave.MinimalLeaveTypeDTO;

public class LeaveTypeMapper {

    private LeaveTypeMapper() {}

    public static LeaveTypeDTO toDTO(LeaveType entity) {
        if (entity == null) return null;

        return LeaveTypeDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())

                .name(entity.getName())
                .annualLimit(entity.getAnnualLimit())
                .monthlyLimit(entity.getMonthlyLimit())
                .quarterlyLimit(entity.getQuarterlyLimit())
                .earnedLeave(entity.getEarnedLeave())
                .carryForward(entity.getCarryForward())
                .maxCarryForward(entity.getMaxCarryForward())

                .build();
    }

    public static MinimalLeaveTypeDTO toMinimalDTO(LeaveType entity) {
        if (entity == null) return null;

        return new MinimalLeaveTypeDTO(
                entity.getId(),
                entity.getName()
        );
    }
}
