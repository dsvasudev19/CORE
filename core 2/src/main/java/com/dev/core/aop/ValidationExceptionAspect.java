//package com.dev.core.aop;
//
//import com.dev.core.exception.BaseException;
//import com.dev.core.controller.ControllerHelper;
//import org.aspectj.lang.ProceedingJoinPoint;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Component;
//
//@Aspect
//@Component
//public class ValidationExceptionAspect {
//    @Around("execution(* com.dev.core.service.validation..*(..))")
//    public Object handleValidationExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
//        try {
//            return joinPoint.proceed();
//        } catch (BaseException ex) {
//            // Use ControllerHelper to return a consistent error response
//            return ControllerHelper.error(400, ex.getMessage());
//        }
//    }
//}
