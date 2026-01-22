package com.dev.core.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AttendanceDTO extends BaseDTO {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String department;
    private LocalDate attendanceDate;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Double workHours;
    private String status;
    private String location;
    private String notes;
    private Boolean isLate;
    private Integer lateByMinutes;
}
