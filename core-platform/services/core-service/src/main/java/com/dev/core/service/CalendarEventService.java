package com.dev.core.service;

import com.dev.core.model.CalendarEventDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface CalendarEventService {

    CalendarEventDTO createEvent(CalendarEventDTO dto);

    CalendarEventDTO updateEvent(Long id, CalendarEventDTO dto);

    void deleteEvent(Long id);

    void cancelEvent(Long id);

    CalendarEventDTO getEventById(Long id);

    Page<CalendarEventDTO> getAllEvents(Long organizationId, Pageable pageable);

    List<CalendarEventDTO> getEventsBetweenDates(Long organizationId, LocalDateTime startDate, LocalDateTime endDate);

    List<CalendarEventDTO> getEventsByTypeAndDateRange(Long organizationId, String eventType, LocalDateTime startDate, LocalDateTime endDate);

    List<CalendarEventDTO> getEventsByEmployee(Long organizationId, Long employeeId);

    Page<CalendarEventDTO> searchEvents(Long organizationId, String keyword, Pageable pageable);

    List<CalendarEventDTO> getEventsByStatus(Long organizationId, String status);

    List<CalendarEventDTO> getRecurringEvents(Long organizationId);

    Map<String, Object> getEventStats(Long organizationId);
}
