package com.hass200.learning.backend_has200.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.io.IOException;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/auth/register", "/api/auth/login",
                                         "/api/auth/refresh", "/api/auth/logout" ,"/api/me/listar").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint((req, res, ex) ->
                                escribirProblema(res, HttpStatus.UNAUTHORIZED, "No autorizado",
                                        "Token ausente, invalido o vencido")));
        return http.build();
    }

    private void escribirProblema(HttpServletResponse res, HttpStatus status, String titulo,
                                  String detalle) throws IOException{
        res.setStatus(status.value());
        res.setContentType("application/problem+json");
        res.setCharacterEncoding("UTF-8");
        res.getWriter().write("{\"type\":\"about:blank\",\"title\":\"" + titulo + "\",\"status\":"
                + status.value() + ",\"detail\":\"" + detalle + "\"}");
    }
}
