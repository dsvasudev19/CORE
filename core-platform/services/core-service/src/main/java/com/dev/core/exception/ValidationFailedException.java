package com.dev.core.exception;

/**
 * Exception thrown when validation of input data or business rules fails.
 * Used by validation layer (e.g., EmployeeValidator, TeamValidator, etc.).
 */
public class ValidationFailedException extends BaseException {

    private final String errorCode;
    private final Object[] params;

    public ValidationFailedException(String message) {
        super(message);
        this.errorCode = null;
        this.params = null;
    }



    public ValidationFailedException(String errorCode, Object[] params) {
        super(errorCode, params); 
        this.errorCode = errorCode;
        this.params = params;
    }


    public String getErrorCode() {
        return errorCode;
    }

    public Object[] getParams() {
        return params;
    }
}
