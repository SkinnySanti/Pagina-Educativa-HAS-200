package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.auth.TokenRepository;
import com.hass200.learning.backend_has200.dto.response.EstudianteResponse;
import com.hass200.learning.backend_has200.service.EstudianteService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2

@RestController
@RequestMapping("/api/me")
public class EstudianteController {

    private final EstudianteService estudianteService;


    public EstudianteController(EstudianteService estudianteService) {
        this.estudianteService = estudianteService;
    }

    @GetMapping
    public EstudianteResponse perfil(@AuthenticationPrincipal Jwt jwt){
        return estudianteService.perfil(Long.valueOf(jwt.getSubject()));
    }

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<EstudianteResponse> listar(){
        log.info("Validando petición GET");
        return estudianteService.listar();
    }

//    @DeleteMapping("/eliminar")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void eliminar(@AuthenticationPrincipal Jwt jwt){
//        log.info("Validando petición DELETE");
//        estudianteService.(Long.valueOf(jwt.getSubject()));
//    }
}
