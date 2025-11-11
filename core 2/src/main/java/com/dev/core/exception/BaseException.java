package com.dev.core.exception;

import org.springframework.context.MessageSource;

import com.dev.core.config.CoreBeanUtil;

public class BaseException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    protected static String loadMessage(String placeHolder, Object[] args) {
        MessageSource messageSource = CoreBeanUtil.getBean(MessageSource.class);
        String message = messageSource.getMessage(placeHolder, args, placeHolder, null);
        return message != null ? message : placeHolder;
    }

    public BaseException() {
        super();
    }

    public BaseException(String input) {
        super(input);
    }

    public BaseException(String messageKey, Object[] args, Throwable cause) {
        super(loadMessage(messageKey, args), cause);
    }

    public BaseException(String messageKey, Throwable cause) {
        this(messageKey, null, cause);
    }

    public BaseException(String messageKey, Object[] args) {
        this(messageKey, args, null);
    }
}