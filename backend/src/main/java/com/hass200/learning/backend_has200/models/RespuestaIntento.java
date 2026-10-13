package com.hass200.learning.backend_has200.models;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RespuestaIntento {
    @EmbeddedId
    private RespuestaIntentoId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("intentoId")
    @JoinColumn(name =  "intento_id", nullable = false)
    @ToString.Exclude
    private Intento intento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("preguntaId")
    @JoinColumn(name = "pregunta_id", nullable = false)
    @ToString.Exclude
    private Pregunta pregunta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opcion_id", nullable = false)
    @ToString.Exclude
    private Opcion opcion;

    public static RespuestaIntento de(Intento intento, Pregunta pregunta, Opcion opcionONull){
        RespuestaIntento respuestaIntento = new RespuestaIntento();
        respuestaIntento.id = new RespuestaIntentoId(intento.getId(), pregunta.getId());
        respuestaIntento.intento = intento;
        respuestaIntento.pregunta = pregunta;
        respuestaIntento.opcion = opcionONull;
        return respuestaIntento;
    }
}
