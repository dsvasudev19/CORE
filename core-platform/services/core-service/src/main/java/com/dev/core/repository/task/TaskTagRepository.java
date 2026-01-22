package com.dev.core.repository.task;

import com.dev.core.domain.TaskTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskTagRepository extends JpaRepository<TaskTag, Long>, JpaSpecificationExecutor<TaskTag> {

    boolean existsByOrganizationIdAndNameIgnoreCase(Long organizationId, String name);

    List<TaskTag> findByOrganizationId(Long organizationId);
}
