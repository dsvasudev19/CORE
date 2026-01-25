package com.dev.core.controller;

import com.dev.core.model.CalendarEventDTO;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar/events")
@RequiredArgsConstructor
public class CalendarEventController {

    private final CalendarEventService calendarEventService;
    private final SecurityContextUtil securityContextUtil;

    @PostMapping
    public ResponseEntity<CalendarEventDTO> createEvent(@RequestBody CalendarEventDTO dto) {
        CalendarEventDTO created = calendarEventService.createEvent(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEventDTO> updateEvent(
            @PathVariable Long id,
            @RequestBody CalendarEventDTO dto) {
        CalendarEventDTO updated = calendarEventService.updateEvent(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        calendarEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelEvent(@PathVariable Long id) {
        calendarEventService.cancelEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEventDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(calendarEventService.getEventById(id));
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<Page<CalendarEventDTO>> getAllEvents(
            @PathVariable Long organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(calendarEventService.getAllEvents(organizationId, pageable));
    }

    @GetMapping("/organization/{organizationId}/range")
    public ResponseEntity<List<CalendarEventDTO>> getEventsBetweenDates(
            @PathVariable Long organizationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(calendarEventService.getEventsBetweenDates(organizationId, startDate, endDate));
    }

    @GetMapping("/organization/{organizationId}/type/{eventType}")
    public ResponseEntity<List<CalendarEventDTO>> getEventsByTypeAndDateRange(
            @PathVariable Long organizationId,
            @PathVariable String eventType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(calendarEventService.getEventsByTypeAndDateRange(organizationId, eventType, startDate, endDate));
    }

    /**
     * Get events for the currently authenticated employee
     * Uses SecurityContextUtil to get the current employee ID from the JWT token
     */
    @GetMapping("/my-events")
    public ResponseEntity<List<CalendarEventDTO>> getMyEvents() {
        MinimalEmployeeDTO currentEmployee = securityContextUtil.getCurrentEmployee();
        Long organizationId = securityContextUtil.getCurrentOrganizationId();
        return ResponseEntity.ok(calendarEventService.getEventsByEmployee(organizationId, currentEmployee.getId()));
    }

    @GetMapping("/organization/{organizationId}/search")
    public ResponseEntity<Page<CalendarEventDTO>> searchEvents(
            @PathVariable Long organizationId,
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(calendarEventService.searchEvents(organizationId, keyword, pageable));
    }

    @GetMapping("/organization/{organizationId}/status/{status}")
    public ResponseEntity<List<CalendarEventDTO>> getEventsByStatus(
            @PathVariable Long organizationId,
            @PathVariable String status) {
        return ResponseEntity.ok(calendarEventService.getEventsByStatus(organizationId, status));
    }

    @GetMapping("/organization/{organizationId}/recurring")
    public ResponseEntity<List<CalendarEventDTO>> getRecurringEvents(@PathVariable Long organizationId) {
        return ResponseEntity.ok(calendarEventService.getRecurringEvents(organizationId));
    }

    @GetMapping("/organization/{organizationId}/stats")
    public ResponseEntity<Map<String, Object>> getEventStats(@PathVariable Long organizationId) {
        return ResponseEntity.ok(calendarEventService.getEventStats(organizationId));
    }
}
