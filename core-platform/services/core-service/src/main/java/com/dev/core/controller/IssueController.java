package com.dev.core.controller;

import com.dev.core.model.IssueDTO;
import com.dev.core.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issue")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<IssueDTO> createIssue(@RequestBody IssueDTO dto) {
        IssueDTO created = issueService.createIssue(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<IssueDTO> updateIssue(@PathVariable Long id, @RequestBody IssueDTO dto) {
        IssueDTO updated = issueService.updateIssue(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable Long id) {
        IssueDTO issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<IssueDTO>> getAllIssues(@RequestParam Long organizationId) {
        List<IssueDTO> issues = issueService.getAllIssues(organizationId);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<IssueDTO>> getIssuesByProject(@PathVariable Long projectId) {
        List<IssueDTO> issues = issueService.getIssuesByProject(projectId);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/sprint/{sprintId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<IssueDTO>> getIssuesBySprint(@PathVariable Long sprintId) {
        List<IssueDTO> issues = issueService.getIssuesBySprint(sprintId);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/epic/{epicId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<IssueDTO>> getIssuesByEpic(@PathVariable Long epicId) {
        List<IssueDTO> issues = issueService.getIssuesByEpic(epicId);
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/backlog")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<IssueDTO>> getBacklogIssues(@RequestParam Long organizationId) {
        List<IssueDTO> issues = issueService.getBacklogIssues(organizationId);
        return ResponseEntity.ok(issues);
    }

    @PutMapping("/{id}/move-to-sprint/{sprintId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<IssueDTO> moveToSprint(@PathVariable Long id, @PathVariable Long sprintId) {
        IssueDTO issue = issueService.moveToSprint(id, sprintId);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}/move-to-backlog")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<IssueDTO> moveToBacklog(@PathVariable Long id) {
        IssueDTO issue = issueService.moveToBacklog(id);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}/assign/{employeeId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<IssueDTO> assignIssue(@PathVariable Long id, @PathVariable Long employeeId) {
        IssueDTO issue = issueService.assignIssue(id, employeeId);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<IssueDTO> changeStatus(@PathVariable Long id, @RequestParam String status) {
        IssueDTO issue = issueService.changeStatus(id, status);
        return ResponseEntity.ok(issue);
    }
}
