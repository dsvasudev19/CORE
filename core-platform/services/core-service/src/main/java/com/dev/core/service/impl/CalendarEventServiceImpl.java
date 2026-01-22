package com.dev.core.service.impl;

import com.dev.core.domain.CalendarEvent;
import com.dev.core.domain.Employee;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.CalendarEventMapper;
import com.dev.core.model.CalendarEventDTO;
import com.dev.core.repository.CalendarEventRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CalendarEventServiceImpl implements CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        authorizationService.authorize("CALENDAR_EVENT", action);
    }

    @Override
    public CalendarEventDTO createEvent(CalendarEventDTO dto) {
        authorize("CREATE");

        Employee createdByEmployee = null;
        if (dto.getCreatedByEmployeeId() != null) {
            createdByEmployee = employeeRepository.findById(dto.getCreatedByEmployeeId())
                    .orElseThrow(() -> new BaseException("error.employee.not.found", 
                            new Object[]{dto.getCreatedByEmployeeId()}));
        }

        CalendarEvent entity = new CalendarEvent();
        CalendarEventMapper.updateEntityFromDTO(dto, entity, createdByEmployee);
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(true);

        if (entity.getStatus() == null) {
            entity.setStatus("Scheduled");
        }

        CalendarEvent saved = calendarEventRepository.save(entity);
        return CalendarEventMapper.toDTO(saved);
    }

    @Override
    public CalendarEventDTO updateEvent(Long id, CalendarEventDTO dto) {
        authorize("UPDATE");

        CalendarEvent entity = calendarEventRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.calendar.event.not.found", new Object[]{id}));

        Employee createdByEmployee = null;
        if (dto.getCreatedByEmployeeId() != null) {
            createdByEmployee = employeeRepository.findById(dto.getCreatedByEmployeeId())
                    .orElseThrow(() -> new BaseException("error.employee.not.found", 
                            new Object[]{dto.getCreatedByEmployeeId()}));
        }

        CalendarEventMapper.updateEntityFromDTO(dto, entity, createdByEmployee);
        CalendarEvent updated = calendarEventRepository.save(entity);
        return CalendarEventMapper.toDTO(updated);
    }

    @Override
    public void deleteEvent(Long id) {
        authorize("DELETE");

        CalendarEvent entity = calendarEventRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.calendar.event.not.found", new Object[]{id}));

        entity.setActive(false);
        calendarEventRepository.save(entity);
    }

    @Override
    public void cancelEvent(Long id) {
        authorize("UPDATE");

        CalendarEvent entity = calendarEventRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.calendar.event.not.found", new Object[]{id}));

        entity.setStatus("Cancelled");
        calendarEventRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public CalendarEventDTO getEventById(Long id) {
        authorize("READ");

        return calendarEventRepository.findById(id)
                .map(CalendarEventMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.calendar.event.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CalendarEventDTO> getAllEvents(Long organizationId, Pageable pageable) {
        authorize("READ");

        return calendarEventRepository.findByOrganizationIdAndActiveTrue(organizationId, pageable)
                .map(CalendarEventMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsBetweenDates(Long organizationId, LocalDateTime startDate, LocalDateTime endDate) {
        authorize("READ");

        return calendarEventRepository.findEventsBetweenDates(organizationId, startDate, endDate)
                .stream()
                .map(CalendarEventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByTypeAndDateRange(Long organizationId, String eventType, 
                                                               LocalDateTime startDate, LocalDateTime endDate) {
        authorize("READ");

        return calendarEventRepository.findEventsByTypeAndDateRange(organizationId, eventType, startDate, endDate)
                .stream()
                .map(CalendarEventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByEmployee(Long organizationId, Long employeeId) {
        authorize("READ");

        return calendarEventRepository.findByCreatedByEmployee(organizationId, employeeId)
                .stream()
                .map(CalendarEventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CalendarEventDTO> searchEvents(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");

        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllEvents(organizationId, pageable);
        }

        return calendarEventRepository.searchEvents(organizationId, keyword, pageable)
                .map(CalendarEventMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByStatus(Long organizationId, String status) {
        authorize("READ");

        return calendarEventRepository.findByStatus(organizationId, status)
                .stream()
                .map(CalendarEventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getRecurringEvents(Long organizationId) {
        authorize("READ");

        return calendarEventRepository.findRecurringEvents(organizationId)
                .stream()
                .map(CalendarEventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEventStats(Long organizationId) {
        authorize("READ");

        Map<String, Object> stats = new HashMap<>();
        
        Long scheduledCount = calendarEventRepository.countByOrganizationIdAndActiveTrueAndStatus(organizationId, "Scheduled");
        Long completedCount = calendarEventRepository.countByOrganizationIdAndActiveTrueAndStatus(organizationId, "Completed");
        Long cancelledCount = calendarEventRepository.countByOrganizationIdAndActiveTrueAndStatus(organizationId, "Cancelled");
        
        stats.put("scheduled", scheduledCount);
        stats.put("completed", completedCount);
        stats.put("cancelled", cancelledCount);
        stats.put("total", scheduledCount + completedCount + cancelledCount);
        
        return stats;
    }
}
