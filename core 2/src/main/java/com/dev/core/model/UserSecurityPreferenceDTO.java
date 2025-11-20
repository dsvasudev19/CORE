package com.dev.core.model;


import com.dev.core.constants.MfaType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSecurityPreferenceDTO {
    private boolean mfaRequired;
    private MfaType preferredMfa;
    private boolean notifyOnLogin;
    private boolean notifyOnPasswordChange;
}
