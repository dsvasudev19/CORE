package com.dev.core.controller.task;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.task.TaskAttachmentDTO;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.task.TaskAttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/attachments")
@RequiredArgsConstructor
public class TaskAttachmentController {

    private final TaskAttachmentService attachmentService;
    private final TaskAutomationService automationService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> upload(@PathVariable Long taskId,
                                    @RequestPart("file") MultipartFile file,
                                    @RequestParam(required = false) String description,
                                    @RequestParam(defaultValue = "INTERNAL") String visibility) {
        TaskAttachmentDTO dto = attachmentService.uploadAttachment(taskId, file, description, visibility);
        automationService.onTaskAttachmentAdded(taskId, dto.getId());
        return helper.success("Attachment uploaded successfully", dto);
    }

    @GetMapping
    public ResponseEntity<?> getAll(@PathVariable Long taskId) {
        List<TaskAttachmentDTO> list = attachmentService.getAttachmentsByTask(taskId);
        return helper.success("Attachments fetched successfully", list);
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<?> delete(@PathVariable Long taskId, @PathVariable Long attachmentId) {
        attachmentService.deleteAttachment( attachmentId);
        return helper.success("Attachment deleted successfully");
    }
    
    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long taskId,
            @PathVariable Long attachmentId) {

        // Fetch metadata
        TaskAttachmentDTO dto = attachmentService.getAttachmentById(attachmentId);

        // Load file bytes
        byte[] fileBytes = attachmentService.loadDocument(attachmentId);

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=\"" + dto.getFileName() + "\"")
                .header("Content-Type", dto.getContentType())  // pdf/image/doc/excel
                .body(fileBytes);
    }

}
