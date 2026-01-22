package com.dev.core.mapper;

import com.dev.core.domain.CalendarEvent;
import com.dev.core.domain.Employee;
import com.dev.core.model.CalendarEventDTO;

public class CalendarEventMapper {

    private CalendarEventMapper() {} // static utility

    public static CalendarEventDTO toDTO(CalendarEvent entity) {
        if (entity == null) return null;

        CalendarEventDTO.CalendarEventDTOBuilder builder = CalendarEventDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .eventType(entity.getEventType())
                .location(entity.getLocation())
                .isAllDay(entity.getIsAllDay())
                .color(entity.getColor())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .reminderMinutes(entity.getReminderMinutes())
                .isRecurring(entity.getIsRecurring())
                .recurrencePattern(entity.getRecurrencePattern())
                .recurrenceEndDate(entity.getRecurrenceEndDate())
                .attendees(entity.getAttendees())
                .meetingLink(entity.getMeetingLink())
                .notes(entity.getNotes());

        if (entity.getCreatedByEmployee() != null) {
            builder.createdByEmployeeId(entity.getCreatedByEmployee().getId())
                   .createdByEmployeeName(entity.getCreatedByEmployee().getFirstName() + " " + 
                                         entity.getCreatedByEmployee().getLastName());
        }

        return builder.build();
    }

    public static void updateEntityFromDTO(CalendarEventDTO dto, CalendarEvent entity, Employee createdByEmployee) {
        if (dto == null || entity == null) return;

        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setEventType(dto.getEventType());
        entity.setLocation(dto.getLocation());
        entity.setIsAllDay(dto.getIsAllDay());
        entity.setColor(dto.getColor());
        entity.setPriority(dto.getPriority());
        entity.setStatus(dto.getStatus());
        entity.setReminderMinutes(dto.getReminderMinutes());
        entity.setIsRecurring(dto.getIsRecurring());
        entity.setRecurrencePattern(dto.getRecurrencePattern());
        entity.setRecurrenceEndDate(dto.getRecurrenceEndDate());
        entity.setAttendees(dto.getAttendees());
        entity.setMeetingLink(dto.getMeetingLink());
        entity.setNotes(dto.getNotes());
        
        if (createdByEmployee != null) {
            entity.setCreatedByEmployee(createdByEmployee);
        }
    }
}
