package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.dto.request.MarcarPasosRequest;
import com.hass200.learning.backend_has200.service.ProgresoModulosService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me/progress")
public class ProgresoGuiaController {
    private final ProgresoModulosService progresoModulosService;

    public ProgresoGuiaController(ProgresoModulosService progresoModulosService) {
        this.progresoModulosService = progresoModulosService;
    }

    @GetMapping
    public Map<String, List<Integer>> obtener(@AuthenticationPrincipal Jwt jwt){
        return progresoModulosService.obtener(Long.valueOf(jwt.getSubject()));
    }

    @PutMapping
    public Map<String, List<Integer>> marcarPaso(@AuthenticationPrincipal Jwt jwt,
                                                 @Valid @RequestBody MarcarPasosRequest body){
        return progresoModulosService.marcarPaso(Long.valueOf(jwt.getSubject()),body);
    }

    @DeleteMapping("/{modulo}")
    public Map<String, List<Integer>> reiniciar(@PathVariable String modulo,
                                                @AuthenticationPrincipal Jwt jwt) {
        return progresoModulosService.reiniciar(Long.valueOf(jwt.getSubject()), modulo);
    }
}
