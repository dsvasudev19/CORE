package com.dev.core.exception;


public class UnauthorizedAccessException extends BaseException {

    private final String errorCode;
    private final Object[] params;

    public UnauthorizedAccessException(String errorCode, Object... params) {
        super(errorCode, params); // DO NOT resolve message here
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

