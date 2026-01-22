package com.dev.core.service.validation;


import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.TimeLogDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class TimeLogValidator {

    // ---------------------------------------------------------
    // TIMER OPERATIONS
    // ---------------------------------------------------------

    public void validateStartTimer(Long userId, Long taskId, Long bugId) {

        if (userId == null || userId <= 0)
            throw new ValidationFailedException("error.timelog.user.required",null);

        // Mutually exclusive: task or bug or none
        if (taskId != null && bugId != null) {
            throw new ValidationFailedException("error.timelog.only.one.association.allowed",null);
        }

        // No other validations required here — 
        // existence checks belong in service layer (repositories).
    }

    public void validateStopTimer(Long userId) {
        if (userId == null || userId <= 0)
            throw new ValidationFailedException("error.timelog.user.required",null);
    }

    // ---------------------------------------------------------
    // MANUAL ENTRY
    // ---------------------------------------------------------

    public void validateCreateManual(TimeLogDTO dto) {

        if (dto == null)
            throw new ValidationFailedException("error.timelog.dto.required",null);

        if (dto.getUserId() == null)
            throw new ValidationFailedException("error.timelog.user.required",null);

        if (dto.getStartTime() == null)
            throw new ValidationFailedException("error.timelog.start.required",null);

        if (dto.getEndTime() == null)
            throw new ValidationFailedException("error.timelog.end.required",null);

        if (dto.getStartTime().isAfter(dto.getEndTime()))
            throw new ValidationFailedException("error.timelog.invalid.range",null);

        // Optional: Must match workDate
        if (dto.getWorkDate() == null)
            throw new ValidationFailedException("error.timelog.workdate.required",null);

        LocalDate calculated = dto.getStartTime().toLocalDate();
        if (!dto.getWorkDate().equals(calculated))
            throw new ValidationFailedException("error.timelog.workdate.mismatch",null);

        // Mutually exclusive constraint again
        if (dto.getTaskId() != null && dto.getBugId() != null)
            throw new ValidationFailedException("error.timelog.only.one.association.allowed",null);
    }

    public void validateUpdateManual(Long id, TimeLogDTO dto) {

        if (id == null || id <= 0)
            throw new ValidationFailedException("error.timelog.id.required",null);

        
    }

    public void validateDelete(Long id) {
        if (id == null || id <= 0)
            throw new ValidationFailedException("error.timelog.id.required",null);
    }

    // ---------------------------------------------------------
    // FETCH OPERATIONS
    // ---------------------------------------------------------

    public void validateDailyFetch(Long userId, LocalDate date) {

        if (userId == null)
            throw new ValidationFailedException("error.timelog.user.required",null);

        if (date == null)
            throw new ValidationFailedException("error.timelog.date.required",null);
    }

    public void validateWeeklyFetch(Long userId, LocalDate weekStart) {

        if (userId == null)
            throw new ValidationFailedException("error.timelog.user.required",null);

        if (weekStart == null)
            throw new ValidationFailedException("error.timelog.weekstart.required",null);

        if (weekStart.getDayOfWeek().getValue() != 1) // 1 = Monday
            throw new ValidationFailedException("error.timelog.weekstart.invalid",null);
    }

    public void validateMonthlyFetch(Long userId, Integer year, Integer month) {

        if (userId == null)
            throw new ValidationFailedException("error.timelog.user.required",null);

        if (year == null || year <= 0)
            throw new ValidationFailedException("error.timelog.year.required",null);

        if (month == null || month < 1 || month > 12)
            throw new ValidationFailedException("error.timelog.month.invalid",null);
    }

    public void validateRange(LocalDate from, LocalDate to) {

        if (from == null || to == null)
            throw new ValidationFailedException("error.timelog.range.required",null);

        if (from.isAfter(to))
            throw new ValidationFailedException("error.timelog.range.invalid",null);
    }

    // ---------------------------------------------------------
    // COMPANY-WIDE VALIDATIONS
    // ---------------------------------------------------------

    public void validateCompanyDaily(LocalDate date) {
        if (date == null)
            throw new ValidationFailedException("error.timelog.date.required",null);
    }

    public void validateCompanyWeekly(LocalDate weekStart) {
        validateWeeklyFetch(null, weekStart);
    }

    public void validateCompanyMonthly(int year, int month) {
        validateMonthlyFetch(null, year, month);
    }
}
