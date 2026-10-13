package com.hass200.learning.backend_has200.models;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/*ENTIDAD SOLO DE LECTURA
 * SE CARGAN LOS DATOS DESDE LA BD*/

@Entity
@Immutable

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Opcion {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pregunta_id", nullable = false)
    @ToString.Exclude
    private Pregunta pregunta;

    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer posicion;

    @Column(length = 500, nullable = false)
    private String texto;

    @Column(nullable = false)
    private boolean esCorrecta;
}
