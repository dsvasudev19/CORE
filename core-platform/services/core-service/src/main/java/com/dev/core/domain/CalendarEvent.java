package com.dev.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEvent extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "event_type")
    private String eventType; // Meeting, Deadline, Holiday, Training, Other

    @Column(name = "location")
    private String location;

    @Column(name = "is_all_day")
    @Builder.Default
    private Boolean isAllDay = false;

    @Column(name = "color")
    private String color; // For UI display

    @Column(name = "priority")
    private String priority; // Low, Medium, High, Critical

    @Column(name = "status")
    private String status; // Scheduled, Completed, Cancelled

    @Column(name = "reminder_minutes")
    private Integer reminderMinutes; // Minutes before event to send reminder

    @Column(name = "is_recurring")
    @Builder.Default
    private Boolean isRecurring = false;

    @Column(name = "recurrence_pattern")
    private String recurrencePattern; // Daily, Weekly, Monthly, Yearly

    @Column(name = "recurrence_end_date")
    private LocalDateTime recurrenceEndDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_employee_id")
    private Employee createdByEmployee;

    @Column(name = "attendees", length = 1000)
    private String attendees; // Comma-separated employee IDs or JSON

    @Column(name = "meeting_link")
    private String meetingLink;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
