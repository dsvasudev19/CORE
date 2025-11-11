package com.dev.core.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ClientDocumentDTO extends BaseDTO {
    private Long clientId;
    private String fileId;
    private String title;
    private String category;
    private Long uploadedBy;
    private String description;
}
