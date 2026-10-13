package com.hass200.learning.backend_has200.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class RespuestaIntentoId implements Serializable {

    @Column(name = "intento_id")
    private Long intentoId;

    @Column(name = "pregunta_id")
    private Long preguntaId;

    public RespuestaIntentoId(Long intentoId, Long preguntaId) {
        this.intentoId = intentoId;
        this.preguntaId = preguntaId;
    }
}
