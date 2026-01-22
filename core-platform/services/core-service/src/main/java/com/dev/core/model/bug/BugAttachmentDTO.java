package com.dev.core.model.bug;

import com.dev.core.constants.FileVisibility;
import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BugAttachmentDTO extends BaseDTO {

    private Long bugId;
    private String fileName;
    private String storedPath;
    private String contentType;
    private Long fileSize;
    private FileVisibility visibility;
    private String description;
}
