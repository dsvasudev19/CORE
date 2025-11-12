package com.dev.core.model;

import com.dev.core.constants.FileVisibility;
import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProjectFileDTO extends BaseDTO {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Original filename is required")
    private String originalFilename;

    @NotBlank(message = "Stored path is required")
    private String storedPath;

    private String contentType;

    private Long fileSize;

    @NotNull
    private FileVisibility visibility;

    private Long uploadedBy;

    @Size(max = 1000)
    private String description;
}
