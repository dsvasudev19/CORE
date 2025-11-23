package com.dev.core.controller.task;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.task.TaskTagDTO;
import com.dev.core.service.task.TaskService;
import com.dev.core.service.task.TaskTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskTagController {

    private final TaskTagService taskTagService;

    @PostMapping("/{taskId}/tags")
    public void addTags(@PathVariable Long taskId,
                        @RequestBody Set<TaskTagDTO> tags) {
        taskTagService.addTags(taskId, tags);
    }

    @PutMapping("/{taskId}/tags")
    public void replaceTags(@PathVariable Long taskId,
                            @RequestBody Set<TaskTagDTO> tags) {
        taskTagService.replaceTags(taskId, tags);
    }

    @DeleteMapping("/{taskId}/tags/{tagId}")
    public void removeTag(@PathVariable Long taskId,
                          @PathVariable Long tagId) {
        taskTagService.removeTag(taskId, tagId);
    }

}

