
package com.dev.core.service.validation;

import org.springframework.stereotype.Component;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.AuthRequest;

@Component
public class AuthValidator {

    public void validateLogin(AuthRequest req) {
        if (req == null)
            throw new ValidationFailedException("auth.request.null",null);

        if (req.getEmail() == null || req.getEmail().isBlank())
            throw new ValidationFailedException("auth.email.required",null);

        if (req.getPassword() == null || req.getPassword().isBlank())
            throw new ValidationFailedException("auth.password.required",null);
    }

    public void validateToken(String token) {
        if (token == null || token.isBlank())
            throw new ValidationFailedException("auth.token.required",null);
    }
}
