package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
public class ClientDocumentDTO extends BaseDTO {
    private Long clientId;           // denormalized for easy frontend use
    private String fileId;
    private String title;
    private String category;
    private Long uploadedBy;
    private String description;
}