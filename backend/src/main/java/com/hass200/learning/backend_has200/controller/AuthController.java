package com.hass200.learning.backend_has200.controller;

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

    @Autowired
    public AuthController(EstudianteService service){
        this.service = service;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<EstudianteResponse> listar(){
        log.info("Validando petición GET");
        return service.listar();
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public EstudianteResponse registar(@Valid @RequestBody RegistroRequest request){
        log.info("Validando petición POST");
        return service.registrar(request);
    }
}
