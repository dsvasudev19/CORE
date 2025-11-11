package com.dev.core.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ClientDTO extends BaseDTO {
    private String name;
    private String code;
    private String domain;
    private String address;
    private String country;
    private String industry;
    private String status;
    private String description;
}
