package com.dev.core.service;

import com.dev.core.model.AttendanceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AttendanceService {

    AttendanceDTO markAttendance(AttendanceDTO dto);

    AttendanceDTO updateAttendance(Long id, AttendanceDTO dto);

    AttendanceDTO checkIn(Long employeeId, LocalDate date, String location);

    AttendanceDTO checkOut(Long employeeId, LocalDate date);

    AttendanceDTO getAttendanceById(Long id);

    AttendanceDTO getEmployeeAttendanceForDate(Long employeeId, LocalDate date);

    Page<AttendanceDTO> getAttendanceByDate(Long organizationId, LocalDate date, Pageable pageable);

    Page<AttendanceDTO> getAttendanceByDateRange(Long organizationId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    List<AttendanceDTO> getEmployeeAttendanceHistory(Long employeeId, LocalDate startDate, LocalDate endDate);

    Map<String, Object> getAttendanceStats(Long organizationId, LocalDate date);

    Map<String, Object> getEmployeeAttendanceSummary(Long employeeId, LocalDate startDate, LocalDate endDate);
}
