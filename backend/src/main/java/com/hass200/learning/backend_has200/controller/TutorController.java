package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.dto.request.TutorChatRequest;
import com.hass200.learning.backend_has200.dto.response.TutorChatResponse;
import com.hass200.learning.backend_has200.service.TutorService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tutor Virtual. Protegido: SecurityConfig ya exige JWT en todo lo que no sea /api/auth/*,
 * así que NO hace falta tocarlo (la API key de Groq solo la usa el servidor).
 */
@RestController
@RequestMapping("/api/tutor")
public class TutorController {

    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @PostMapping("/chat")
    public TutorChatResponse chat(@AuthenticationPrincipal Jwt jwt,
                                  @Valid @RequestBody TutorChatRequest body) {
        return tutorService.conversar(Long.valueOf(jwt.getSubject()), body);
    }
}
