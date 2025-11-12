package com.dev.core.service.task;

import com.dev.core.model.task.TaskAttachmentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TaskAttachmentService {

    TaskAttachmentDTO uploadAttachment(Long taskId, MultipartFile file, String description, String visibility);

    List<TaskAttachmentDTO> getAttachmentsByTask(Long taskId);

    TaskAttachmentDTO getAttachmentById(Long id);

    void deleteAttachment(Long id);

    String getDownloadUrl(Long id);
}
