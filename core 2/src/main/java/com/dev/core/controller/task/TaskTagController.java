package com.dev.core.controller.task;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.task.TaskTagDTO;
import com.dev.core.service.task.TaskService;
import com.dev.core.service.task.TaskTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/tags")
@RequiredArgsConstructor
public class TaskTagController {

    private final TaskTagService tagService;
    private final TaskService taskService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TaskTagDTO dto) {
        return helper.success("Tag created successfully", tagService.createTag(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TaskTagDTO dto) {
        return helper.success("Tag updated successfully", tagService.updateTag(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        tagService.deleteTag(id);
        return helper.success("Tag deleted successfully");
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam Long organizationId) {
        List<TaskTagDTO> list = tagService.getAllTags(organizationId);
        return helper.success("Tags fetched successfully", list);
    }

   
}
