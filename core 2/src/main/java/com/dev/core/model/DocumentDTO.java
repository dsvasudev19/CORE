package com.dev.core.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class DocumentDTO extends BaseDTO {

    private String entityType;
    private Long entityId;
    private String fileId;
    private String title;
    private String category;
    private Long uploadedBy;
    private String description;
    private String visibility;
}
