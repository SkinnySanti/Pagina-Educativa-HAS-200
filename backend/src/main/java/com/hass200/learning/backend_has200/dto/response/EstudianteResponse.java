package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.Estudiante;

import java.time.Instant;
import java.time.LocalDateTime;

public record EstudianteResponse(Long id, String correo, String alias, Instant creadoEn){
    public static EstudianteResponse from(Estudiante e){
        return new EstudianteResponse(e.getId(), e.getCorreo(), e.getAlias(), e.getCreadoEn());
    }
}
