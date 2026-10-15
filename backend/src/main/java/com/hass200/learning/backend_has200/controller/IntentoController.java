package com.hass200.learning.backend_has200.controller;

import com.hass200.learning.backend_has200.dto.request.EnviarIntentoRequest;
import com.hass200.learning.backend_has200.dto.response.IntentoIniciadoDto;
import com.hass200.learning.backend_has200.dto.response.ResultadoIntentoDto;
import com.hass200.learning.backend_has200.dto.response.RevisionIntentoDto;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import com.hass200.learning.backend_has200.service.IntentoService;
import com.hass200.learning.backend_has200.service.RevisionService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class IntentoController {

    private final IntentoService intentoService;
    private final RevisionService revisionService;

    public IntentoController(IntentoService intentoService, RevisionService revisionService) {
        this.revisionService = revisionService;
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

    @PostMapping("/exams/{id}/submit")
    public ResultadoIntentoDto enviar (@PathVariable Long id,
                                       @Valid @RequestBody EnviarIntentoRequest body,
                                       @AuthenticationPrincipal Jwt jwt){
        try{
            return intentoService.enviar(Long.valueOf(jwt.getSubject()),id, body);
        }catch (DataIntegrityViolationException e){
            // Red de seguridad: UNIQUE de clave_intento_unico (dos envíos simultáneos del diagnóstico)
            throw ReglaNegocioException.conflicto(
                    "La evaluación diagnóstica ya fue presentada","DIAGNOSTICO_USADO");
        }
    }

    @GetMapping("/attempts/{id}/review")
    public RevisionIntentoDto revision(@PathVariable Long id,
                                       @AuthenticationPrincipal Jwt jwt){

        return revisionService.revisar(Long.valueOf(jwt.getSubject()), id);
    }
}
