package com.dev.core.controller.bug;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.bug.BugDTO;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.bug.BugService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bugs")
@RequiredArgsConstructor
public class BugController {

    private final BugService bugService;
    private final ControllerHelper helper;
    private final SecurityContextUtil securityContextUtil;


    // --------------------------------------------------------------
    // CREATE
    // --------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> create(@RequestBody BugDTO dto) {
        log.info("🐞 Creating new bug: {}", dto.getTitle());
        BugDTO created = bugService.createBug(dto);
        return helper.success("Bug created successfully", created);
    }

    // --------------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody BugDTO dto) {
        log.info("📝 Updating bug [{}]", id);
        BugDTO updated = bugService.updateBug(id, dto);
        return helper.success("Bug updated successfully", updated);
    }

    // --------------------------------------------------------------
    // DELETE
    // --------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        log.info("🗑️ Deleting bug [{}]", id);
        bugService.deleteBug(id);
        return helper.success("Bug deleted successfully");
    }

    // --------------------------------------------------------------
    // GET BY ID
    // --------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,
                                     @RequestParam(defaultValue = "false") boolean includeDetails) {
        log.info("🔍 Fetching bug [{}]", id);
        return helper.success("Bug fetched", bugService.getBugById(id, includeDetails));
    }

    // --------------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long organizationId,
                                    @RequestParam(required = false) String keyword,
                                    Pageable pageable) {
        log.info("🔎 Searching bugs for org [{}]", organizationId);
        Page<BugDTO> result = bugService.searchBugs(organizationId, keyword, pageable);
        return helper.success("Bugs searched", result);
    }

    // --------------------------------------------------------------
    // PROJECT FILTER
    // --------------------------------------------------------------
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        log.info("📂 Getting bugs for project [{}]", projectId);
        List<BugDTO> bugs = bugService.getBugsByProject(projectId);
        return helper.success("Bugs fetched for project", bugs);
    }

    // --------------------------------------------------------------
    // USER FILTER
    // --------------------------------------------------------------
    @GetMapping("/assignee/{userId}")
    public ResponseEntity<?> getByAssignee(@PathVariable Long userId) {
        log.info("👤 Getting bugs assigned to user [{}]", userId);
        List<BugDTO> bugs = bugService.getBugsByAssignee(userId);
        return helper.success("Bugs fetched for assignee", bugs);
    }
    
    @GetMapping("/my-bugs")
    public ResponseEntity<?> getMyBugs() {
        log.info("👤 Getting my bugs (reported by me or assigned to me)");
        Long organizationId = securityContextUtil.getCurrentOrganizationId();
        List<BugDTO> bugs = bugService.getMyBugs(organizationId);
        return helper.success("My bugs fetched successfully", bugs);
    }

    // --------------------------------------------------------------
    // STATUS CHANGE
    // --------------------------------------------------------------
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long id,
                                          @RequestParam String newStatus) {
        log.info("🔄 Changing status for bug [{}] → {}", id, newStatus);
        BugDTO updated = bugService.changeBugStatus(id, newStatus);
        return helper.success("Bug status updated", updated);
    }

    // --------------------------------------------------------------
    // SEVERITY CHANGE
    // --------------------------------------------------------------
    @PutMapping("/{id}/severity")
    public ResponseEntity<?> changeSeverity(@PathVariable Long id,
                                            @RequestParam String newSeverity) {
        log.info("⚠️ Changing severity for bug [{}] → {}", id, newSeverity);
        BugDTO updated = bugService.changeBugSeverity(id, newSeverity);
        return helper.success("Bug severity updated", updated);
    }

    // --------------------------------------------------------------
    // LINK / UNLINK TASK
    // --------------------------------------------------------------
    @PutMapping("/{id}/link-task/{taskId}")
    public ResponseEntity<?> linkToTask(@PathVariable Long id, @PathVariable Long taskId) {
        log.info("🔗 Linking bug [{}] to task [{}]", id, taskId);
        bugService.linkBugToTask(id, taskId);
        return helper.success("Bug linked to task successfully");
    }

    @PutMapping("/{id}/unlink-task")
    public ResponseEntity<?> unlinkFromTask(@PathVariable Long id) {
        log.info("🔗 Unlinking bug [{}] from task", id);
        bugService.unlinkBugFromTask(id);
        return helper.success("Bug unlinked from task successfully");
    }

    // --------------------------------------------------------------
    // CLOSE / REOPEN
    // --------------------------------------------------------------
    @PutMapping("/{id}/close")
    public ResponseEntity<?> closeBug(@PathVariable Long id) {
        log.info("📁 Closing bug [{}]", id);
        bugService.closeBug(id);
        return helper.success("Bug closed successfully");
    }

    @PutMapping("/{id}/reopen")
    public ResponseEntity<?> reopenBug(@PathVariable Long id) {
        log.info("🔁 Reopening bug [{}]", id);
        bugService.reopenBug(id);
        return helper.success("Bug reopened successfully");
    }
}
