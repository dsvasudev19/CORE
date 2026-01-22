package com.dev.core.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TemplateRenderService {

    private final SpringTemplateEngine engine;

    public String render(String templateName, Map<String, Object> variables) {
        Context ctx = new Context();
        ctx.setVariables(variables);
        return engine.process(templateName, ctx);
    }
}
