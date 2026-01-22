package com.dev.core.repository;

import com.dev.core.domain.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByOrganizationId(Long organizationId);
    List<Issue> findByProjectId(Long projectId);
    List<Issue> findBySprintId(Long sprintId);
    List<Issue> findByEpicId(Long epicId);
    List<Issue> findByAssigneeId(Long assigneeId);
    Optional<Issue> findByKey(String key);
    List<Issue> findBySprintIdIsNull();
}
