package com.dev.core.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    private static final String UPLOAD_DIR =  "app/uploads";
    private static final String SERVE_PATH = "app/uploads/**";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = "file:" + Paths.get(UPLOAD_DIR).toAbsolutePath().toString() + "/";
        registry.addResourceHandler(SERVE_PATH)
                .addResourceLocations(absolutePath)
                .setCachePeriod(3600);
    }

    public static String getUploadDir() {
        return UPLOAD_DIR;
    }

    public static String getServePath() {
        return SERVE_PATH;
    }
}