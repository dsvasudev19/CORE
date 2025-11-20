package com.dev.core.exception;

public class ResourceNotFoundException extends BaseException {
	private final String errorCode;
    private final Object[] params;

    public ResourceNotFoundException(String message) {
        super(message);
        this.errorCode = null;
        this.params = null;
    }



    public ResourceNotFoundException(String errorCode, Object[] params) {
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
