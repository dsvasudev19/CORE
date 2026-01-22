package com.dev.core.service.impl;

import com.dev.core.domain.*;
import com.dev.core.mapper.IssueMapper;
import com.dev.core.model.IssueDTO;
import com.dev.core.repository.*;
import com.dev.core.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final SprintRepository sprintRepository;
    private final EpicRepository epicRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public IssueDTO createIssue(IssueDTO dto) {
        Issue issue = IssueMapper.toEntity(dto);
        
        if (dto.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found"));
            issue.setSprint(sprint);
        }
        
        if (dto.getEpicId() != null) {
            Epic epic = epicRepository.findById(dto.getEpicId())
                    .orElseThrow(() -> new RuntimeException("Epic not found"));
            issue.setEpic(epic);
        }
        
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            issue.setProject(project);
        }
        
        if (dto.getAssigneeId() != null) {
            Employee assignee = employeeRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            issue.setAssignee(assignee);
        }
        
        if (dto.getReporterId() != null) {
            Employee reporter = employeeRepository.findById(dto.getReporterId())
                    .orElseThrow(() -> new RuntimeException("Reporter not found"));
            issue.setReporter(reporter);
        }
        
        if (issue.getStatus() == null) {
            issue.setStatus(Issue.IssueStatus.TO_DO);
        }
        
        Issue saved = issueRepository.save(issue);
        return IssueMapper.toDTO(saved);
    }

    @Override
    public IssueDTO updateIssue(Long id, IssueDTO dto) {
        Issue existing = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        existing.setKey(dto.getKey());
        existing.setSummary(dto.getSummary());
        existing.setDescription(dto.getDescription());
        existing.setType(dto.getType());
        existing.setPriority(dto.getPriority());
        existing.setStatus(dto.getStatus());
        existing.setStoryPoints(dto.getStoryPoints());
        
        if (dto.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found"));
            existing.setSprint(sprint);
        }
        
        if (dto.getEpicId() != null) {
            Epic epic = epicRepository.findById(dto.getEpicId())
                    .orElseThrow(() -> new RuntimeException("Epic not found"));
            existing.setEpic(epic);
        }
        
        if (dto.getAssigneeId() != null) {
            Employee assignee = employeeRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            existing.setAssignee(assignee);
        }
        
        Issue updated = issueRepository.save(existing);
        return IssueMapper.toDTO(updated);
    }

    @Override
    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public IssueDTO getIssueById(Long id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        return IssueMapper.toDTO(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getAllIssues(Long organizationId) {
        return issueRepository.findByOrganizationId(organizationId).stream()
                .map(IssueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByProject(Long projectId) {
        return issueRepository.findByProjectId(projectId).stream()
                .map(IssueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesBySprint(Long sprintId) {
        return issueRepository.findBySprintId(sprintId).stream()
                .map(IssueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByEpic(Long epicId) {
        return issueRepository.findByEpicId(epicId).stream()
                .map(IssueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getBacklogIssues(Long organizationId) {
        return issueRepository.findByOrganizationId(organizationId).stream()
                .filter(issue -> issue.getSprint() == null)
                .map(IssueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public IssueDTO moveToSprint(Long issueId, Long sprintId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        
        issue.setSprint(sprint);
        Issue updated = issueRepository.save(issue);
        return IssueMapper.toDTO(updated);
    }

    @Override
    public IssueDTO moveToBacklog(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        issue.setSprint(null);
        Issue updated = issueRepository.save(issue);
        return IssueMapper.toDTO(updated);
    }

    @Override
    public IssueDTO assignIssue(Long issueId, Long employeeId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        issue.setAssignee(employee);
        Issue updated = issueRepository.save(issue);
        return IssueMapper.toDTO(updated);
    }

    @Override
    public IssueDTO changeStatus(Long issueId, String status) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        issue.setStatus(Issue.IssueStatus.valueOf(status));
        Issue updated = issueRepository.save(issue);
        return IssueMapper.toDTO(updated);
    }
}
