package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.dto.response.FeedbackDto;
import com.hass200.learning.backend_has200.dto.response.IntentoHistorialDto;
import com.hass200.learning.backend_has200.service.FeedbackService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Retroalimentación del estudiante autenticado. Exige JWT (SecurityConfig: anyRequest().authenticated()). */
@RestController
@RequestMapping("/api/me")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping("/attempts")
    public List<IntentoHistorialDto> intentos(@AuthenticationPrincipal Jwt jwt) {
        return feedbackService.historial(Long.valueOf(jwt.getSubject()));
    }

    @GetMapping("/feedback")
    public FeedbackDto feedback(@AuthenticationPrincipal Jwt jwt) {
        return feedbackService.feedback(Long.valueOf(jwt.getSubject()));
    }
}
