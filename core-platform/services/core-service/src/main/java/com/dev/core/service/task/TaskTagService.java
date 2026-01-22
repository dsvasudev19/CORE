package com.dev.core.service.task;


import java.util.List;
import java.util.Set;

import com.dev.core.model.task.TaskTagDTO;

public interface TaskTagService {

    void addTags(Long taskId, Set<TaskTagDTO> tagDtos);

    void replaceTags(Long taskId, Set<TaskTagDTO> tagDtos);

    void removeTag(Long taskId, Long tagId);
}
