package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.dto.response.ExamenResumenDto;
import com.hass200.learning.backend_has200.service.ExamenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamenController {
    private final ExamenService service;

    @GetMapping
    public List<ExamenResumenDto> listar(@AuthenticationPrincipal Jwt jwt){
        return  service.listar(Long.valueOf(jwt.getSubject()));
    }
}
