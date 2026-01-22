package com.dev.core.config;


import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServerConfig {

    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.addConnectorCustomizers(connector -> {
            connector.setProperty("maxPostSize", "10485760");
            connector.setProperty("connectionTimeout", "120000");
            connector.setProperty("maxKeepAliveRequests", "1");
            connector.setProperty("keepAliveTimeout", "120000");
        });
        return factory;
    }
}
