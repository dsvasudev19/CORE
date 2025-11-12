package com.dev.core.service.impl.task;

import com.dev.core.domain.Task;
import com.dev.core.domain.TaskAttachment;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.task.TaskAttachmentMapper;
import com.dev.core.model.task.TaskAttachmentDTO;
import com.dev.core.repository.task.TaskAttachmentRepository;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.task.TaskAttachmentService;
import com.dev.core.service.task.TaskAutomationService;
import com.dev.core.service.validation.task.TaskAttachmentValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskAttachmentServiceImpl implements TaskAttachmentService {

    private final TaskAttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final TaskAttachmentValidator attachmentValidator;
    private final AuthorizationService authorizationService;
    private final TaskAutomationService taskAutomationService;

    @Value("${app.upload.dir:uploads/tasks}")
    private String uploadDir;

    // --- AUTHORIZATION WRAPPER ---
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    // --------------------------------------------------------------
    // UPLOAD ATTACHMENT
    // --------------------------------------------------------------
    @Override
    public TaskAttachmentDTO uploadAttachment(Long taskId, MultipartFile file, String description, String visibility) {
        authorize("CREATE");
        attachmentValidator.validateBeforeUpload(taskId, file, visibility);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new BaseException("error.task.not.found", new Object[]{taskId}));

        // --- Prepare upload path ---
        Path uploadPath = Paths.get(uploadDir, String.valueOf(taskId));
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new BaseException("Failed to create upload directory: " + uploadPath);
        }

        // --- Generate unique filename ---
        String originalFileName = file.getOriginalFilename();
        String fileExt = (originalFileName != null && originalFileName.contains(".")) ?
                originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String storedFileName = UUID.randomUUID() + fileExt;

        Path targetPath = uploadPath.resolve(storedFileName);

        // --- Save file to disk ---
        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BaseException("Failed to store file: " + originalFileName);
        }

        // --- Save metadata to DB ---
        TaskAttachment entity = new TaskAttachment();
        entity.setTask(task);
        entity.setOrganizationId(task.getOrganizationId());
        entity.setFileName(originalFileName);
        entity.setStoredPath(targetPath.toString());
        entity.setContentType(file.getContentType());
        entity.setFileSize(file.getSize());
        entity.setDescription(description);
        entity.setVisibility(Enum.valueOf(com.dev.core.constants.FileVisibility.class, visibility.toUpperCase()));
        entity.setActive(true);

        TaskAttachment saved = attachmentRepository.save(entity);

        // --- Trigger automation hook ---
        taskAutomationService.onTaskAttachmentAdded(taskId, saved.getId());

        return TaskAttachmentMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // GET ATTACHMENTS BY TASK
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public List<TaskAttachmentDTO> getAttachmentsByTask(Long taskId) {
        authorize("READ");
        return attachmentRepository.findByTaskId(taskId)
                .stream()
                .map(TaskAttachmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // GET ATTACHMENT BY ID
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public TaskAttachmentDTO getAttachmentById(Long id) {
        authorize("READ");
        return attachmentRepository.findById(id)
                .map(TaskAttachmentMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.attachment.not.found", new Object[]{id}));
    }

    // --------------------------------------------------------------
    // DELETE ATTACHMENT
    // --------------------------------------------------------------
    @Override
    public void deleteAttachment(Long id) {
        authorize("DELETE");
        attachmentValidator.validateBeforeDelete(id);

        TaskAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.attachment.not.found", new Object[]{id}));

        try {
            Path filePath = Paths.get(attachment.getStoredPath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete attachment file: {}", attachment.getStoredPath());
        }

        attachmentRepository.delete(attachment);
    }

    // --------------------------------------------------------------
    // GENERATE DOWNLOAD URL
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public String getDownloadUrl(Long id) {
        authorize("READ");
        TaskAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.attachment.not.found", new Object[]{id}));

        String relativePath = attachment.getStoredPath().replace("\\", "/");
        return "/static/" + relativePath;
    }
}
