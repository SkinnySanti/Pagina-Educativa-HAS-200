package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.auth.AuthService;
import com.hass200.learning.backend_has200.auth.dto.LoginRequest;
import com.hass200.learning.backend_has200.auth.dto.RefreshRequest;
import com.hass200.learning.backend_has200.auth.dto.TokenResponse;
import com.hass200.learning.backend_has200.dto.request.RegistroRequest;
import com.hass200.learning.backend_has200.dto.response.EstudianteResponse;
import com.hass200.learning.backend_has200.service.EstudianteService;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final EstudianteService service;
    private final AuthService authService;

    @Autowired
    public AuthController(EstudianteService service, AuthService authService){
        this.service = service;
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public EstudianteResponse registar(@Valid @RequestBody RegistroRequest request){
        log.info("Petición recibida para registrar");
        return service.registrar(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request){
        log.info("Petición recibida para logear");
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@Valid @RequestBody RefreshRequest request){
        log.info("Petición recibida para refrescar tokens");
        return authService.refrescar(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public  void delete(@Valid @RequestBody RefreshRequest request){
        log.info("Petición recibida para logout");
        authService.cerrarSesion(request);
    }
}
