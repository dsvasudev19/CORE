package com.dev.core.model.task;

import com.dev.core.constants.FileVisibility;
import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TaskAttachmentDTO extends BaseDTO {

    private Long taskId;
    private String fileName;
    private String storedPath;
    private String contentType;
    private Long fileSize;
    private FileVisibility visibility;
    private String description;
}
