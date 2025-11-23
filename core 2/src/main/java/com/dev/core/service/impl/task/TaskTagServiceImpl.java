package com.dev.core.service.impl.task;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Task;
import com.dev.core.domain.TaskTag;
import com.dev.core.exception.BaseException;
import com.dev.core.model.task.TaskTagDTO;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.repository.task.TaskTagRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.task.TaskTagService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
@Transactional
public class TaskTagServiceImpl implements TaskTagService {

    private final TaskRepository taskRepository;
    private final TaskTagRepository taskTagRepository;
    private final AuthorizationService authorizationService;

    @Override
    public void addTags(Long taskId, Set<TaskTagDTO> tagDtos) {


        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        for (TaskTagDTO dto : tagDtos) {

            TaskTag tag = new TaskTag();
            tag.setName(dto.getName());
            tag.setColor(dto.getColor());
            tag.setOrganizationId(task.getOrganizationId());  // if the base entity has org id

            tag = taskTagRepository.save(tag);

            task.getTags().add(tag);
        }

        taskRepository.save(task);
    }

    @Override
    public void replaceTags(Long taskId, Set<TaskTagDTO> tagDtos) {


        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        // REMOVE ALL EXISTING TAGS FROM TASK
        task.getTags().clear();

        Set<TaskTag> newTags = tagDtos.stream().map(dto -> {

            TaskTag tag = new TaskTag();
            tag.setName(dto.getName());
            tag.setColor(dto.getColor());
            tag.setOrganizationId(task.getOrganizationId());

            return taskTagRepository.save(tag);

        }).collect(Collectors.toSet());

        task.setTags(newTags);
        taskRepository.save(task);
    }

    @Override
    public void removeTag(Long taskId, Long tagId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        task.getTags().removeIf(t -> t.getId().equals(tagId));

        taskRepository.save(task);
    }
}
