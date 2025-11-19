package com.dev.core.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@Getter
@Setter
public class EmployeeDocumentDTO extends BaseDTO {

    private Long employeeId;
    private EmployeeDTO employee;

    private String documentName;
    private String documentType;
    private String filePath;
    private boolean verified;
    private String fileId;
}
