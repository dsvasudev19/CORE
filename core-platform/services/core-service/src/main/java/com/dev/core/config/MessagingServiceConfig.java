package com.dev.core.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Configuration for Messaging Service HTTP Client
 * Configures WebClient with connection pooling, timeouts, and error handling
 */
@Configuration
@Slf4j
public class MessagingServiceConfig {

    @Value("${messaging.service.url:http://localhost:3001}")
    private String messagingServiceUrl;

    @Value("${messaging.service.connect-timeout:5000}")
    private int connectTimeout;

    @Value("${messaging.service.read-timeout:30000}")
    private int readTimeout;

    @Value("${messaging.service.max-connections:50}")
    private int maxConnections;

    @Value("${messaging.service.max-connections-per-route:20}")
    private int maxConnectionsPerRoute;

    @Bean(name = "messagingServiceWebClient")
    public WebClient messagingServiceWebClient() {
        log.info("Configuring Messaging Service WebClient with URL: {}", messagingServiceUrl);
        
        // Configure connection pooling
        ConnectionProvider connectionProvider = ConnectionProvider.builder("messaging-service-pool")
                .maxConnections(maxConnections)
                .maxIdleTime(Duration.ofSeconds(20))
                .maxLifeTime(Duration.ofSeconds(60))
                .pendingAcquireTimeout(Duration.ofSeconds(60))
                .evictInBackground(Duration.ofSeconds(120))
                .build();

        // Configure HTTP client with timeouts and connection pooling
        HttpClient httpClient = HttpClient.create(connectionProvider)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeout)
                .responseTimeout(Duration.ofMillis(readTimeout))
                .doOnConnected(conn -> 
                    conn.addHandlerLast(new ReadTimeoutHandler(readTimeout, TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(readTimeout, TimeUnit.MILLISECONDS))
                );

        // Build WebClient with configured HTTP client
        WebClient webClient = WebClient.builder()
                .baseUrl(messagingServiceUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
        
        log.info("Messaging Service WebClient configured successfully");
        log.info("  - URL: {}", messagingServiceUrl);
        log.info("  - Connect Timeout: {}ms", connectTimeout);
        log.info("  - Read Timeout: {}ms", readTimeout);
        log.info("  - Max Connections: {}", maxConnections);
        log.info("  - Max Connections Per Route: {}", maxConnectionsPerRoute);
        
        return webClient;
    }

    @Bean
    public String messagingServiceUrl() {
        return messagingServiceUrl;
    }
}
