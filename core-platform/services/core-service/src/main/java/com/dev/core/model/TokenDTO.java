package com.dev.core.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class TokenDTO extends BaseDTO {
    private String token;
    private LocalDateTime expiry;
    private UserDTO user;
    private boolean active;
}

