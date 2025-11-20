package com.dev.core.model;


import com.dev.core.constants.MfaType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MfaCodeRequestDTO {
    private MfaType type;
    private String code;
}
