package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.dto.response.IntentoIniciadoDto;
import com.hass200.learning.backend_has200.service.IntentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class IntentoController {

    private final IntentoService intentoService;

    public IntentoController(IntentoService intentoService) {
        this.intentoService = intentoService;
    }

    @PostMapping("/exams/{id}/attempts")
    public ResponseEntity<IntentoIniciadoDto> iniciar (@PathVariable Long id,
                                                       @AuthenticationPrincipal Jwt jwt){
        IntentoIniciadoDto dto = intentoService.iniciarOReanudar(
                Long.valueOf(jwt.getSubject()), id);

        return ResponseEntity.status(dto.reanudado() ? HttpStatus.OK : HttpStatus.CREATED)
                .body(dto);
    }
}
