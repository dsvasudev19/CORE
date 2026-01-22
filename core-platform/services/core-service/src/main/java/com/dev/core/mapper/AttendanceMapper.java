package com.dev.core.mapper;

import com.dev.core.domain.Attendance;
import com.dev.core.domain.Employee;
import com.dev.core.model.AttendanceDTO;

public class AttendanceMapper {

    private AttendanceMapper() {} // static utility

    public static AttendanceDTO toDTO(Attendance entity) {
        if (entity == null) return null;

        AttendanceDTO.AttendanceDTOBuilder builder = AttendanceDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .attendanceDate(entity.getAttendanceDate())
                .checkInTime(entity.getCheckInTime())
                .checkOutTime(entity.getCheckOutTime())
                .workHours(entity.getWorkHours())
                .status(entity.getStatus())
                .location(entity.getLocation())
                .notes(entity.getNotes())
                .isLate(entity.getIsLate())
                .lateByMinutes(entity.getLateByMinutes());

        if (entity.getEmployee() != null) {
            builder.employeeId(entity.getEmployee().getId())
                   .employeeName(entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName())
                   .employeeCode(entity.getEmployee().getEmployeeCode());
            
            if (entity.getEmployee().getDepartment() != null) {
                builder.department(entity.getEmployee().getDepartment().getName());
            }
        }

        return builder.build();
    }

    public static void updateEntityFromDTO(AttendanceDTO dto, Attendance entity, Employee employee) {
        if (dto == null || entity == null) return;

        entity.setEmployee(employee);
        entity.setAttendanceDate(dto.getAttendanceDate());
        entity.setCheckInTime(dto.getCheckInTime());
        entity.setCheckOutTime(dto.getCheckOutTime());
        entity.setWorkHours(dto.getWorkHours());
        entity.setStatus(dto.getStatus());
        entity.setLocation(dto.getLocation());
        entity.setNotes(dto.getNotes());
        entity.setIsLate(dto.getIsLate());
        entity.setLateByMinutes(dto.getLateByMinutes());
    }
}
