package com.dev.core.aop;

import com.dev.core.api.ControllerHelper;
import com.dev.core.exception.BaseException;
import com.dev.core.exception.ValidationFailedException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Aspect for catching and transforming validation layer exceptions.
 *
 * This AOP wraps all methods inside `com.dev.core.service.validation..*`
 * and ensures that any exception thrown from the validation layer
 * is converted into a consistent ApiResponse format.
 */
@Aspect
@Component
@Slf4j
public class ValidationExceptionAspect {

    @Autowired
    private ControllerHelper controllerHelper;

    /**
     * Intercepts all public methods inside validation layer classes.
     * 
     * Only handles exceptions thrown from the validation layer.
     */

    @Around("execution(* com.dev.core.service.validation..*(..))")
    public Object handleValidationExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            return joinPoint.proceed();
        } catch (BaseException ex) {
            log.error("BaseException in validation layer {}: {}", joinPoint.getSignature(), ex.getMessage());
            // 🚨 rethrow it to stop further execution
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected exception in validation layer {}: {}", joinPoint.getSignature(), ex.getMessage(), ex);
            throw ex; // 🚨 rethrow generic exceptions as well
        }
    }
}
