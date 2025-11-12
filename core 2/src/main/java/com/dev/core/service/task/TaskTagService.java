package com.dev.core.service.task;

import com.dev.core.model.task.TaskTagDTO;

import java.util.List;

public interface TaskTagService {

    TaskTagDTO createTag(TaskTagDTO dto);

    TaskTagDTO updateTag(Long id, TaskTagDTO dto);

    void deleteTag(Long id);

    List<TaskTagDTO> getAllTags(Long organizationId);
}
