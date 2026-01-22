package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
public class ContactDTO extends BaseDTO {
    private String name;
    private String email;
    private String phone;
    private String designation;
    private String department;
    private String type;
    private String notes;
}