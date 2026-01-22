package com.dev.core.service;

import com.dev.core.model.IssueDTO;

import java.util.List;

public interface IssueService {
    IssueDTO createIssue(IssueDTO dto);
    IssueDTO updateIssue(Long id, IssueDTO dto);
    void deleteIssue(Long id);
    IssueDTO getIssueById(Long id);
    List<IssueDTO> getAllIssues(Long organizationId);
    List<IssueDTO> getIssuesByProject(Long projectId);
    List<IssueDTO> getIssuesBySprint(Long sprintId);
    List<IssueDTO> getIssuesByEpic(Long epicId);
    List<IssueDTO> getBacklogIssues(Long organizationId);
    IssueDTO moveToSprint(Long issueId, Long sprintId);
    IssueDTO moveToBacklog(Long issueId);
    IssueDTO assignIssue(Long issueId, Long employeeId);
    IssueDTO changeStatus(Long issueId, String status);
}
