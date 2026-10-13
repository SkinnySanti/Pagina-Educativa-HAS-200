package com.hass200.learning.backend_has200.models;

import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Duration;
import java.time.Instant;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Intento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estudiante_id", nullable = false, updatable = false)
    @ToString.Exclude
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "examen_id", nullable = false, updatable = false)
    @ToString.Exclude
    private Examen examen;

    @Column(nullable = false, updatable = false)
    private Instant iniciadoEn;

    @Column(nullable = false, updatable = false)
    private Instant venceEn;

    private Instant enviadoEn;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 10)
    private EstadoIntento estado;

    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer aciertos;

    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer total;

    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer puntaje;

    @Column(length = 64, unique = true)
    private String claveIntentoUnico;

    public static Intento iniciar(Estudiante estudiante, Examen examen, Instant ahora){
        Intento intento = new Intento();

        intento.estudiante = estudiante;
        intento.examen = examen;
        intento.estado = EstadoIntento.EN_CURSO;
        intento.iniciadoEn = ahora;
        intento.venceEn = ahora.plus(Duration.ofMinutes(
                examen.getTiempoLimiteMinutos()));
        return intento;
    }

    public void marcarEnviado(Instant ahora, int aciertos, int total,
                              int puntaje, String claveIntentoUnico) {
        this.estado = EstadoIntento.ENVIADO;
        this.enviadoEn = ahora;
        this.aciertos = aciertos;
        this.total = total;
        this.puntaje = puntaje;
        this.claveIntentoUnico = claveIntentoUnico;
    }

    public void marcarVencido(Instant ahora) {
        this.estado = EstadoIntento.VENCIDO;
        this.enviadoEn = ahora;
    }
}
