package com.dev.core.repository;

import com.dev.core.domain.Epic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EpicRepository extends JpaRepository<Epic, Long> {
    List<Epic> findByOrganizationId(Long organizationId);
    List<Epic> findByProjectId(Long projectId);
    Optional<Epic> findByKey(String key);
}
