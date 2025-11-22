package com.dev.core.repository;


import com.dev.core.domain.ProjectActivity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectActivityRepository extends JpaRepository<ProjectActivity, Long> {
    Page<ProjectActivity> findByProjectIdOrderByCreatedAtDesc(Long projectId, Pageable pageable);
    List<ProjectActivity>  findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
