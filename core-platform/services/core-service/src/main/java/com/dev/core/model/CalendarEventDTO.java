package com.dev.core.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CalendarEventDTO extends BaseDTO {
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String eventType;
    private String location;
    private Boolean isAllDay;
    private String color;
    private String priority;
    private String status;
    private Integer reminderMinutes;
    private Boolean isRecurring;
    private String recurrencePattern;
    private LocalDateTime recurrenceEndDate;
    private Long createdByEmployeeId;
    private String createdByEmployeeName;
    private String attendees;
    private String meetingLink;
    private String notes;
}
