package com.dev.core.service.impl;

import com.dev.core.domain.Attendance;
import com.dev.core.domain.Employee;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.AttendanceMapper;
import com.dev.core.model.AttendanceDTO;
import com.dev.core.repository.AttendanceRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.service.AttendanceService;
import com.dev.core.service.AuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthorizationService authorizationService;

    private static final LocalTime STANDARD_CHECK_IN_TIME = LocalTime.of(9, 0); // 9:00 AM

    private void authorize(String action) {
        authorizationService.authorize("ATTENDANCE", action);
    }

    @Override
    public AttendanceDTO markAttendance(AttendanceDTO dto) {
        authorize("CREATE");

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{dto.getEmployeeId()}));

        // Check if attendance already exists for this date
        attendanceRepository.findByEmployeeIdAndAttendanceDate(dto.getEmployeeId(), dto.getAttendanceDate())
                .ifPresent(existing -> {
                    throw new BaseException("error.attendance.already.exists", 
                            new Object[]{dto.getEmployeeId(), dto.getAttendanceDate()});
                });

        Attendance entity = new Attendance();
        AttendanceMapper.updateEntityFromDTO(dto, entity, employee);
        entity.setOrganizationId(employee.getOrganizationId());
        entity.setActive(true);

        // Calculate if late
        if (dto.getCheckInTime() != null && dto.getCheckInTime().isAfter(STANDARD_CHECK_IN_TIME)) {
            entity.setIsLate(true);
            entity.setLateByMinutes((int) Duration.between(STANDARD_CHECK_IN_TIME, dto.getCheckInTime()).toMinutes());
        }

        // Calculate work hours if both check-in and check-out are present
        if (dto.getCheckInTime() != null && dto.getCheckOutTime() != null) {
            double hours = Duration.between(dto.getCheckInTime(), dto.getCheckOutTime()).toMinutes() / 60.0;
            entity.setWorkHours(hours);
        }

        Attendance saved = attendanceRepository.save(entity);
        return AttendanceMapper.toDTO(saved);
    }

    @Override
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO dto) {
        authorize("UPDATE");

        Attendance entity = attendanceRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.attendance.not.found", new Object[]{id}));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{dto.getEmployeeId()}));

        AttendanceMapper.updateEntityFromDTO(dto, entity, employee);

        // Recalculate if late
        if (dto.getCheckInTime() != null && dto.getCheckInTime().isAfter(STANDARD_CHECK_IN_TIME)) {
            entity.setIsLate(true);
            entity.setLateByMinutes((int) Duration.between(STANDARD_CHECK_IN_TIME, dto.getCheckInTime()).toMinutes());
        } else {
            entity.setIsLate(false);
            entity.setLateByMinutes(0);
        }

        // Recalculate work hours
        if (dto.getCheckInTime() != null && dto.getCheckOutTime() != null) {
            double hours = Duration.between(dto.getCheckInTime(), dto.getCheckOutTime()).toMinutes() / 60.0;
            entity.setWorkHours(hours);
        }

        Attendance updated = attendanceRepository.save(entity);
        return AttendanceMapper.toDTO(updated);
    }

    @Override
    public AttendanceDTO checkIn(Long employeeId, LocalDate date, String location) {
        authorize("CREATE");

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BaseException("error.employee.not.found", new Object[]{employeeId}));

        // Check if already checked in
        attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, date)
                .ifPresent(existing -> {
                    throw new BaseException("error.attendance.already.checked.in", new Object[]{employeeId, date});
                });

        LocalTime checkInTime = LocalTime.now();
        
        Attendance entity = Attendance.builder()
                .employee(employee)
                .attendanceDate(date)
                .checkInTime(checkInTime)
                .location(location)
                .status("Present")
                .build();

        entity.setOrganizationId(employee.getOrganizationId());
        entity.setActive(true);

        // Check if late
        if (checkInTime.isAfter(STANDARD_CHECK_IN_TIME)) {
            entity.setIsLate(true);
            entity.setLateByMinutes((int) Duration.between(STANDARD_CHECK_IN_TIME, checkInTime).toMinutes());
            entity.setStatus("Late");
        }

        Attendance saved = attendanceRepository.save(entity);
        return AttendanceMapper.toDTO(saved);
    }

    @Override
    public AttendanceDTO checkOut(Long employeeId, LocalDate date) {
        authorize("UPDATE");

        Attendance entity = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, date)
                .orElseThrow(() -> new BaseException("error.attendance.not.found.for.date", 
                        new Object[]{employeeId, date}));

        if (entity.getCheckOutTime() != null) {
            throw new BaseException("error.attendance.already.checked.out", new Object[]{employeeId, date});
        }

        LocalTime checkOutTime = LocalTime.now();
        entity.setCheckOutTime(checkOutTime);

        // Calculate work hours
        if (entity.getCheckInTime() != null) {
            double hours = Duration.between(entity.getCheckInTime(), checkOutTime).toMinutes() / 60.0;
            entity.setWorkHours(hours);
        }

        Attendance updated = attendanceRepository.save(entity);
        return AttendanceMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceDTO getAttendanceById(Long id) {
        authorize("READ");

        return attendanceRepository.findById(id)
                .map(AttendanceMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.attendance.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceDTO getEmployeeAttendanceForDate(Long employeeId, LocalDate date) {
        authorize("READ");

        return attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, date)
                .map(AttendanceMapper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceDTO> getAttendanceByDate(Long organizationId, LocalDate date, Pageable pageable) {
        authorize("READ");

        return attendanceRepository.findByOrganizationIdAndAttendanceDate(organizationId, date, pageable)
                .map(AttendanceMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceDTO> getAttendanceByDateRange(Long organizationId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        authorize("READ");

        return attendanceRepository.findByOrganizationIdAndAttendanceDateBetween(organizationId, startDate, endDate, pageable)
                .map(AttendanceMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDTO> getEmployeeAttendanceHistory(Long employeeId, LocalDate startDate, LocalDate endDate) {
        authorize("READ");

        return attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(employeeId, startDate, endDate)
                .stream()
                .map(AttendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAttendanceStats(Long organizationId, LocalDate date) {
        authorize("READ");

        Map<String, Object> stats = new HashMap<>();
        
        Long presentCount = attendanceRepository.countByOrganizationIdAndDateAndStatus(organizationId, date, "Present");
        Long lateCount = attendanceRepository.countByOrganizationIdAndDateAndStatus(organizationId, date, "Late");
        Long absentCount = attendanceRepository.countByOrganizationIdAndDateAndStatus(organizationId, date, "Absent");
        Long onLeaveCount = attendanceRepository.countByOrganizationIdAndDateAndStatus(organizationId, date, "On Leave");
        
        stats.put("presentToday", presentCount + lateCount);
        stats.put("absent", absentCount);
        stats.put("lateArrivals", lateCount);
        stats.put("onLeave", onLeaveCount);
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEmployeeAttendanceSummary(Long employeeId, LocalDate startDate, LocalDate endDate) {
        authorize("READ");

        List<Attendance> records = attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(employeeId, startDate, endDate);
        
        Map<String, Object> summary = new HashMap<>();
        
        long presentDays = records.stream().filter(a -> "Present".equals(a.getStatus()) || "Late".equals(a.getStatus())).count();
        long absentDays = records.stream().filter(a -> "Absent".equals(a.getStatus())).count();
        long lateDays = records.stream().filter(a -> Boolean.TRUE.equals(a.getIsLate())).count();
        double totalHours = records.stream().mapToDouble(a -> a.getWorkHours() != null ? a.getWorkHours() : 0).sum();
        
        summary.put("presentDays", presentDays);
        summary.put("absentDays", absentDays);
        summary.put("lateDays", lateDays);
        summary.put("totalWorkHours", totalHours);
        summary.put("averageWorkHours", presentDays > 0 ? totalHours / presentDays : 0);
        
        return summary;
    }
}
