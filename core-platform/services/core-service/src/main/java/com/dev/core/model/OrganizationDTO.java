package com.dev.core.model;

import com.dev.core.constants.OrganizationStatus;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class OrganizationDTO extends BaseDTO {
    private String name;
    private String code;
    private String domain;
    private OrganizationStatus status;
}
