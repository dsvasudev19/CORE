package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
public class ClientRepresentativeDTO extends BaseDTO {
    private Long clientId;
    private Long contactId;
    private ContactDTO contact;
    private String role;
    private boolean primaryContact;
    private Long userId;

}