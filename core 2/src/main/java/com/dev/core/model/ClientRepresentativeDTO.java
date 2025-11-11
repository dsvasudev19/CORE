package com.dev.core.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ClientRepresentativeDTO extends BaseDTO {
    private Long clientId;
    private Long contactId;
    private String role;
    private Boolean primaryContact;
}
