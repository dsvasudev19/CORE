package com.dev.core.service.impl.bug;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.dev.core.constants.BugSeverity;
import com.dev.core.constants.BugStatus;
import com.dev.core.domain.Bug;
import com.dev.core.domain.Task;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.bug.BugMapper;
import com.dev.core.mapper.options.BugMapperOptions;
import com.dev.core.model.bug.BugDTO;
import com.dev.core.model.bug.BugHistoryDTO;
import com.dev.core.repository.bug.BugRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.bug.BugAutomationService;
import com.dev.core.service.bug.BugHistoryService;
import com.dev.core.service.bug.BugService;
import com.dev.core.service.validation.BugValidator;
import com.dev.core.specification.SpecificationBuilder;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BugServiceImpl implements BugService {

    private final BugRepository bugRepository;
    private final BugValidator bugValidator;
    private final BugHistoryService bugHistoryService;
    private final BugAutomationService bugAutomationService;
    private final AuthorizationService authorizationService;
    private final TaskRepository taskRepository;

    // 🔒 Authorization Helper
    private void authorize(String action) {
        authorizationService.authorize("BUG", action);
    }

    // --------------------------------------------------------------
    // CREATE BUG
    // --------------------------------------------------------------
    @Override
    public BugDTO createBug(BugDTO dto) {
        authorize("CREATE");
        bugValidator.validateBeforeCreate(dto);

        Bug entity = BugMapper.toEntity(dto);
        entity.setStatus(BugStatus.OPEN);
        entity.setCreatedAt(LocalDateTime.now());

        Bug saved = bugRepository.save(entity);

        bugAutomationService.onBugReported(saved.getId());
        logHistory(saved.getId(), "status", null, BugStatus.OPEN.name(), "Bug created");

        return BugMapper.toDTO(saved, BugMapperOptions.builder().includeProject(true).build());
    }

    // --------------------------------------------------------------
    // UPDATE BUG
    // --------------------------------------------------------------
    @Override
    public BugDTO updateBug(Long id, BugDTO dto) {
        authorize("UPDATE");
        bugValidator.validateBeforeUpdate(id, dto);

        Bug bug = bugRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{id}));

        String oldSeverity = bug.getSeverity() != null ? bug.getSeverity().name() : null;
        String newSeverity = dto.getSeverity() != null ? dto.getSeverity().name() : null;

        bug.setTitle(dto.getTitle());
        bug.setDescription(dto.getDescription());
        bug.setSeverity(dto.getSeverity());
        bug.setEnvironment(dto.getEnvironment());
        bug.setAppVersion(dto.getAppVersion());
        bug.setDueDate(dto.getDueDate());
        bug.setAssignedTo(dto.getAssignedTo());
        bug.setUpdatedAt(LocalDateTime.now());

        Bug updated = bugRepository.save(bug);

        if (oldSeverity != null && !oldSeverity.equals(newSeverity)) {
            bugValidator.validateSeverityChange(oldSeverity, newSeverity);
            logHistory(id, "severity", oldSeverity, newSeverity, "Severity changed");
            bugAutomationService.onBugSeverityChanged(id, oldSeverity, newSeverity);
        }

        return BugMapper.toDTO(updated, BugMapperOptions.builder().includeProject(true).build());
    }

    // --------------------------------------------------------------
    // DELETE BUG
    // --------------------------------------------------------------
    @Override
    public void deleteBug(Long id) {
        authorize("DELETE");

        if (!bugRepository.existsById(id))
            throw new BaseException("error.bug.not.found", new Object[]{id});

        bugRepository.deleteById(id);
    }

    // --------------------------------------------------------------
    // GET BUG BY ID
    // --------------------------------------------------------------
    @Override
    public BugDTO getBugById(Long id, boolean includeDetails) {
        authorize("READ");

        Bug bug = bugRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{id}));

        BugMapperOptions opts = BugMapperOptions.builder()
                .includeAttachments(includeDetails)
                .includeComments(includeDetails)
                .includeHistory(includeDetails)
                .includeProject(true)
                .includeLinkedTask(true)
                .build();

        return BugMapper.toDTO(bug, opts);
    }

    // --------------------------------------------------------------
    // SEARCH BUGS
    // --------------------------------------------------------------
    @Override
    public Page<BugDTO> searchBugs(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");

        Page<Bug> page = bugRepository.findAll(
                SpecificationBuilder.of(Bug.class)
                        .equals("organizationId", organizationId)
                        .contains("title", keyword)
                        .build(),
                pageable
        );

        return page.map(bug -> BugMapper.toDTO(bug, BugMapperOptions.builder().includeProject(true).build()));
    }

    // --------------------------------------------------------------
    // BUGS BY PROJECT / ASSIGNEE
    // --------------------------------------------------------------
    @Override
    public List<BugDTO> getBugsByProject(Long projectId) {
        authorize("READ");
        return bugRepository.findByProject_Id(projectId)
                .stream()
                .map(bug -> BugMapper.toDTO(bug, BugMapperOptions.builder().build()))
                .toList();
    }

    @Override
    public List<BugDTO> getBugsByAssignee(Long userId) {
        authorize("READ");
        return bugRepository.findByAssignedTo(userId)
                .stream()
                .map(bug -> BugMapper.toDTO(bug, BugMapperOptions.builder().includeProject(true).build()))
                .toList();
    }

    // --------------------------------------------------------------
    // STATUS CHANGE
    // --------------------------------------------------------------
    @Override
    public BugDTO changeBugStatus(Long bugId, String newStatus) {
        authorize("UPDATE");

        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));

        BugStatus oldStatus = bug.getStatus();
        BugStatus status = BugStatus.valueOf(newStatus.toUpperCase());

        bugValidator.validateStatusChange(oldStatus, status);

        bug.setStatus(status);
        bug.setUpdatedAt(LocalDateTime.now());

        Bug updated = bugRepository.save(bug);
        logHistory(bugId, "status", oldStatus.name(), newStatus, "Status changed");

        bugAutomationService.onBugStatusChanged(bugId, oldStatus.name(), newStatus);

        if (status == BugStatus.RESOLVED)
            bugAutomationService.onBugResolved(bugId);
        else if (status == BugStatus.CLOSED)
            bugAutomationService.onBugClosed(bugId);
        else if (status == BugStatus.REOPENED)
            bugAutomationService.onBugReopened(bugId);

        return BugMapper.toDTO(updated, BugMapperOptions.builder().includeProject(true).build());
    }

    // --------------------------------------------------------------
    // SEVERITY CHANGE
    // --------------------------------------------------------------
    @Override
    public BugDTO changeBugSeverity(Long bugId, String newSeverity) {
        authorize("UPDATE");

        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));

        String oldSeverity = bug.getSeverity().name();
        bugValidator.validateSeverityChange(oldSeverity, newSeverity);

        bug.setSeverity(BugSeverity.valueOf(newSeverity.toUpperCase()));
        bug.setUpdatedAt(LocalDateTime.now());

        Bug updated = bugRepository.save(bug);
        logHistory(bugId, "severity", oldSeverity, newSeverity, "Severity updated");

        bugAutomationService.onBugSeverityChanged(bugId, oldSeverity, newSeverity);

        return BugMapper.toDTO(updated, BugMapperOptions.builder().includeProject(true).build());
    }

    // --------------------------------------------------------------
    // LIFECYCLE ACTIONS
    // --------------------------------------------------------------
    @Override
    public void reopenBug(Long bugId) {
        changeBugStatus(bugId, BugStatus.REOPENED.name());
    }

    @Override
    public void verifyBug(Long bugId, Long verifiedBy) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));

        bug.setVerifiedBy(verifiedBy);
        bug.setStatus(BugStatus.VERIFIED);
        bug.setUpdatedAt(LocalDateTime.now());
        bugRepository.save(bug);

        logHistory(bugId, "status", null, BugStatus.VERIFIED.name(), "Bug verified by user " + verifiedBy);
    }

    @Override
    public void closeBug(Long bugId) {
        changeBugStatus(bugId, BugStatus.CLOSED.name());
    }

    @Override
    public void escalateBug(Long bugId, String reason) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));

        logHistory(bugId, "escalation", null, "Escalated", reason);
    }

    @Override
    public void linkBugToTask(Long bugId, Long taskId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));
        Optional<Task> task=taskRepository.findById(taskId);
        bug.setLinkedTask(task.get());
        bugRepository.save(bug);
        logHistory(bugId, "linkedTaskId", null, String.valueOf(taskId), "Linked to task");
    }

    @Override
    public void unlinkBugFromTask(Long bugId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new BaseException("error.bug.not.found", new Object[]{bugId}));
        bug.setLinkedTask(null);
        bugRepository.save(bug);
        logHistory(bugId, "linkedTaskId", null, null, "Unlinked from task");
    }

    // --------------------------------------------------------------
    // HISTORY HELPER
    // --------------------------------------------------------------
    private void logHistory(Long bugId, String field, String oldVal, String newVal, String note) {
        try {
            BugHistoryDTO history = BugHistoryDTO.builder()
                    .bugId(bugId)
                    .changedField(field)
                    .oldValue(oldVal)
                    .newValue(newVal)
                    .note(note)
                    .changedAt(LocalDateTime.now())
                    .build();
            bugHistoryService.logHistory(history);
        } catch (Exception e) {
            log.warn("⚠️ Failed to log history for bug {} - {}", bugId, e.getMessage());
        }
    }
    
}
