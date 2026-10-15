package com.hass200.learning.backend_has200.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record EnviarIntentoRequest(
        @NotNull @Size(max = 50) List<@NotNull @Valid RespuestaRequest> respuestas
        ) {}
