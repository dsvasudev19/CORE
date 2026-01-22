package com.dev.core.controller;

import com.dev.core.model.AttendanceDTO;
import com.dev.core.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<AttendanceDTO> markAttendance(@RequestBody AttendanceDTO dto) {
        AttendanceDTO created = attendanceService.markAttendance(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDTO> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceDTO dto) {
        AttendanceDTO updated = attendanceService.updateAttendance(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceDTO> checkIn(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String location) {
        AttendanceDTO attendance = attendanceService.checkIn(employeeId, date, location);
        return ResponseEntity.status(201).body(attendance);
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceDTO> checkOut(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AttendanceDTO attendance = attendanceService.checkOut(employeeId, date);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDTO> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/employee/{employeeId}/date/{date}")
    public ResponseEntity<AttendanceDTO> getEmployeeAttendanceForDate(
            @PathVariable Long employeeId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AttendanceDTO attendance = attendanceService.getEmployeeAttendanceForDate(employeeId, date);
        return attendance != null ? ResponseEntity.ok(attendance) : ResponseEntity.notFound().build();
    }

    @GetMapping("/organization/{organizationId}/date/{date}")
    public ResponseEntity<Page<AttendanceDTO>> getAttendanceByDate(
            @PathVariable Long organizationId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(organizationId, date, pageable));
    }

    @GetMapping("/organization/{organizationId}/range")
    public ResponseEntity<Page<AttendanceDTO>> getAttendanceByDateRange(
            @PathVariable Long organizationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDateRange(organizationId, startDate, endDate, pageable));
    }

    @GetMapping("/employee/{employeeId}/history")
    public ResponseEntity<List<AttendanceDTO>> getEmployeeAttendanceHistory(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendanceHistory(employeeId, startDate, endDate));
    }

    @GetMapping("/organization/{organizationId}/stats")
    public ResponseEntity<Map<String, Object>> getAttendanceStats(
            @PathVariable Long organizationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceStats(organizationId, date));
    }

    @GetMapping("/employee/{employeeId}/summary")
    public ResponseEntity<Map<String, Object>> getEmployeeAttendanceSummary(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendanceSummary(employeeId, startDate, endDate));
    }
}
