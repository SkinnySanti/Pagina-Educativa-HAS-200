package com.hass200.learning.backend_has200.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;

/** Cliente HTTP hacia Groq (solo lo usa TutorService). No toca la seguridad ni el CORS existentes. */
@Configuration
@EnableConfigurationProperties(TutorProperties.class)
public class TutorConfig {

    @Bean
    RestClient tutorRestClient(TutorProperties props) {
        HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(http);
        factory.setReadTimeout(props.timeout());
        return RestClient.builder()
                .requestFactory(factory)
                .baseUrl(props.baseUrl())
                .build();
    }
}
