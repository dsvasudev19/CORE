package com.dev.core.service.impl;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.dev.core.domain.Bug;
import com.dev.core.domain.Project;
import com.dev.core.domain.Task;
import com.dev.core.domain.TimeLog;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.TimeLogMapper;
import com.dev.core.model.TimeLogDTO;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.repository.TimeLogRepository;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.TimeLogService;
import com.dev.core.service.validation.TimeLogValidator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TimeLogServiceImpl implements TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final TaskRepository taskRepository;
    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;

    private final TimeLogValidator validator;
    private final SecurityContextUtil securityContextUtil;


    // ---------------------------------------------------------
    //  Helpers
    // ---------------------------------------------------------

    private Project resolveProjectFromTaskOrBug(Task task, Bug bug) {
        if (task != null)
            return task.getProject();

        if (bug != null)
            return bug.getProject();

        return null;
    }

    private TimeLog loadActiveTimer(Long userId) {
        return timeLogRepository.findByUserIdAndActiveTrue(userId)
                .orElseThrow(() -> new BaseException("error.timelog.not.active", new Object[]{userId}));
    }


    // ---------------------------------------------------------
    //  TIMER OPERATIONS
    // ---------------------------------------------------------

    @Override
    public TimeLogDTO startTimer(Long userId, Long taskId, Long bugId, String note) {
        validator.validateStartTimer(userId, taskId, bugId);

        // Only 1 active timer allowed
        timeLogRepository.findByUserIdAndActiveTrue(userId).ifPresent(t -> {
            throw new BaseException("error.timelog.active.exists", new Object[]{userId});
        });

        Task task = null;
        Bug bug = null;
        Project project = null;

        if (taskId != null) {
            task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));
        }

        if (bugId != null) {
            bug = bugRepository.findById(bugId)
                    .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));
        }

        project = resolveProjectFromTaskOrBug(task, bug);

        TimeLog log = new TimeLog();
        log.setUserId(userId);
        log.setStartTime(LocalDateTime.now());
        log.setWorkDate(LocalDate.now());
        log.setNote(note);
        log.setActive(true);
        log.setTask(task);
        log.setBug(bug);
        log.setProject(project);
        log.setOrganizationId(securityContextUtil.getCurrentOrganizationId());

        TimeLog saved = timeLogRepository.save(log);
        return TimeLogMapper.toDTO(saved);
    }


    @Override
    public TimeLogDTO stopTimer(Long userId) {
        validator.validateStopTimer(userId);

        TimeLog active = loadActiveTimer(userId);

        active.setEndTime(LocalDateTime.now());
        active.setDurationMinutes(
                Duration.between(active.getStartTime(), active.getEndTime()).toMinutes()
        );
        active.setActive(false);

        TimeLog saved = timeLogRepository.save(active);
        return TimeLogMapper.toDTO(saved);
    }


    @Override
    public TimeLogDTO getActiveTimer(Long userId) {
        return timeLogRepository.findByUserIdAndActiveTrue(userId)
                .map(TimeLogMapper::toDTO)
                .orElse(null);
    }


    // ---------------------------------------------------------
    //  MANUAL ENTRY OPERATIONS
    // ---------------------------------------------------------

    @Override
    public TimeLogDTO createManualEntry(TimeLogDTO dto) {
        validator.validateCreateManual(dto);

        Task task = null;
        Bug bug = null;
        Project project = null;

        if (dto.getTaskId() != null) {
            task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{dto.getTaskId()}));
        }

        if (dto.getBugId() != null) {
            bug = bugRepository.findById(dto.getBugId())
                    .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{dto.getBugId()}));
        }

        project = resolveProjectFromTaskOrBug(task, bug);

        TimeLog entity = TimeLogMapper.toEntity(dto, project, task, bug);
        entity.setOrganizationId(securityContextUtil.getCurrentOrganizationId());

        TimeLog saved = timeLogRepository.save(entity);
        return TimeLogMapper.toDTO(saved);
    }


    @Override
    public TimeLogDTO updateManualEntry(Long id, TimeLogDTO dto) {
        validator.validateUpdateManual(id, dto);

        TimeLog existing = timeLogRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.timelog.not.found", new Object[]{id}));

        Task task = null;
        Bug bug = null;
        Project project = null;

        if (dto.getTaskId() != null) {
            task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{dto.getTaskId()}));
        }

        if (dto.getBugId() != null) {
            bug = bugRepository.findById(dto.getBugId())
                    .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{dto.getBugId()}));
        }

        project = resolveProjectFromTaskOrBug(task, bug);

        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());
        existing.setWorkDate(dto.getWorkDate());
        existing.setDurationMinutes(dto.getDurationMinutes());
        existing.setNote(dto.getNote());
        existing.setTask(task);
        existing.setBug(bug);
        existing.setProject(project);

        TimeLog saved = timeLogRepository.save(existing);
        return TimeLogMapper.toDTO(saved);
    }


    @Override
    public void delete(Long id) {
        validator.validateDelete(id);

        if (!timeLogRepository.existsById(id))
            throw new BaseException("error.timelog.not.found", new Object[]{id});

        timeLogRepository.deleteById(id);
    }


    // ---------------------------------------------------------
    //  FETCH OPERATIONS
    // ---------------------------------------------------------

    @Override
    public List<TimeLogDTO> getTimeLogs(Long userId, Long projectId, Long taskId, Long bugId, LocalDate fromDate, LocalDate toDate) {

        List<TimeLog> logs;

        if (fromDate != null && toDate != null) {
            validator.validateRange(fromDate, toDate);
            logs = timeLogRepository.findByUserIdAndWorkDateBetween(userId, fromDate, toDate);
        } else {
            logs = timeLogRepository.findByUserId(userId);
        }

        return logs.stream()
                .filter(l ->
                        (projectId == null || (l.getProject() != null && l.getProject().getId().equals(projectId))) &&
                        (taskId == null || (l.getTask() != null && l.getTask().getId().equals(taskId))) &&
                        (bugId == null || (l.getBug() != null && l.getBug().getId().equals(bugId)))
                )
                .map(TimeLogMapper::toDTO)
                .toList();
    }


    @Override
    public List<TimeLogDTO> getDailyLogs(Long userId, LocalDate date) {
        validator.validateDailyFetch(userId, date);
        return timeLogRepository.findByUserIdAndWorkDate(userId, date)
                .stream()
                .map(TimeLogMapper::toDTO)
                .toList();
    }


    @Override
    public List<TimeLogDTO> getWeeklyLogs(Long userId, LocalDate monday) {
        validator.validateWeeklyFetch(userId, monday);

        LocalDate sunday = monday.plusDays(6);

        return timeLogRepository.findByUserIdAndWorkDateBetween(userId, monday, sunday)
                .stream()
                .map(TimeLogMapper::toDTO)
                .toList();
    }


    @Override
    public List<TimeLogDTO> getMonthlyLogs(Long userId, int year, int month) {
        validator.validateMonthlyFetch(userId, year, month);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);

        return timeLogRepository.findByUserIdAndWorkDateBetween(userId, start, end)
                .stream()
                .map(TimeLogMapper::toDTO)
                .toList();
    }


    // ---------------------------------------------------------
    //  TOTALS
    // ---------------------------------------------------------

    @Override
    public Long getDailyTotalMinutes(Long userId, LocalDate date) {
        validator.validateDailyFetch(userId, date);
        Long total = timeLogRepository.getDailyTotal(userId, date);
        return total == null ? 0L : total;
    }


    @Override
    public Map<LocalDate, Long> getWeeklyBreakdown(Long userId, LocalDate start) {
        validator.validateWeeklyFetch(userId, start);

        LocalDate end = start.plusDays(6);
        List<Map<String, Object>> rows = timeLogRepository.getWeeklyBreakdown(userId, start, end);

        Map<LocalDate, Long> result = new LinkedHashMap<>();
        rows.forEach(r -> result.put(
                (LocalDate) r.get("day"),
                (Long) r.get("minutes")
        ));

        return result;
    }


    @Override
    public Map<LocalDate, Long> getMonthlyBreakdown(Long userId, int year, int month) {
        validator.validateMonthlyFetch(userId, year, month);

        List<Map<String, Object>> rows = timeLogRepository.getMonthlyBreakdown(userId, year, month);

        Map<LocalDate, Long> result = new LinkedHashMap<>();
        rows.forEach(r -> result.put(
                (LocalDate) r.get("day"),
                (Long) r.get("minutes")
        ));

        return result;
    }


    @Override
    public Long getTotalTimeForProject(Long userId, Long projectId) {
        Long total = timeLogRepository.getTotalForProject(userId, projectId);
        return total == null ? 0L : total;
    }

    @Override
    public Long getTotalTimeForTask(Long userId, Long taskId) {
        Long total = timeLogRepository.getTotalForTask(userId, taskId);
        return total == null ? 0L : total;
    }

    @Override
    public Long getTotalTimeForBug(Long userId, Long bugId) {
        Long total = timeLogRepository.getTotalForBug(userId, bugId);
        return total == null ? 0L : total;
    }


    // ---------------------------------------------------------
    //  COMPANY-LEVEL TOTALS
    // ---------------------------------------------------------

    @Override
    public Long getCompanyDailyTotal(LocalDate date) {
        validator.validateCompanyDaily(date);
        Long total = timeLogRepository.getCompanyDailyTotal(securityContextUtil.getCurrentOrganizationId(), date);
        return total == null ? 0L : total;
    }


    @Override
    public Long getCompanyWeeklyTotal(LocalDate start) {
        validator.validateCompanyWeekly(start);

        Long total = timeLogRepository.getCompanyRangeTotal(
                securityContextUtil.getCurrentOrganizationId(),
                start,
                start.plusDays(6)
        );
        return total == null ? 0L : total;
    }


    @Override
    public Long getCompanyMonthlyTotal(int year, int month) {
        validator.validateCompanyMonthly(year, month);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);

        Long total = timeLogRepository.getCompanyRangeTotal(
                securityContextUtil.getCurrentOrganizationId(),
                start, end
        );
        return total == null ? 0L : total;
    }


    @Override
    public Map<Long, Long> getCompanyDailyBreakdown(LocalDate date) {
        List<Map<String, Object>> rows =
                timeLogRepository.getCompanyDailyBreakdown(
                        securityContextUtil.getCurrentOrganizationId(), date);

        Map<Long, Long> result = new LinkedHashMap<>();

        rows.forEach(r -> result.put(
                ((Number) r.get("userId")).longValue(),
                ((Number) r.get("minutes")).longValue()
        ));

        return result;
    }


    // ---------------------------------------------------------
    //  PROJECT BREAKDOWN
    // ---------------------------------------------------------

    @Override
    public Map<Long, Long> getUserProjectBreakdown(Long userId, LocalDate from, LocalDate to) {
        validator.validateRange(from, to);

        List<Map<String, Object>> rows = timeLogRepository.getUserProjectBreakdown(userId, from, to);

        Map<Long, Long> result = new LinkedHashMap<>();

        rows.forEach(r -> result.put(
                ((Number) r.get("projectId")).longValue(),
                ((Number) r.get("minutes")).longValue()
        ));

        return result;
    }


    @Override
    public Map<Long, Long> getCompanyProjectBreakdown(LocalDate from, LocalDate to) {
        validator.validateRange(from, to);

        List<Map<String, Object>> rows =
                timeLogRepository.getCompanyProjectBreakdown(
                        securityContextUtil.getCurrentOrganizationId(), from, to);

        Map<Long, Long> result = new LinkedHashMap<>();

        rows.forEach(r -> result.put(
                ((Number) r.get("projectId")).longValue(),
                ((Number) r.get("minutes")).longValue()
        ));

        return result;
    }


    // ---------------------------------------------------------
    //  CALENDAR SUMMARY
    // ---------------------------------------------------------

    @Override
    public Map<LocalDate, Long> getCalendarSummary(Long userId, int year, int month) {
        List<Map<String, Object>> rows =
                timeLogRepository.getMonthlyBreakdown(userId, year, month);

        Map<LocalDate, Long> result = new LinkedHashMap<>();

        rows.forEach(r -> result.put(
                (LocalDate) r.get("day"),
                (Long) r.get("minutes")
        ));

        return result;
    }

	
}
