package com.hass200.learning.backend_has200.models;

import com.hass200.learning.backend_has200.models.enums.TipoExamen;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;


/*ENTIDAD SOLO DE LECTURA
* SE CARGAN LOS DATOS DESDE LA BD*/

@Entity
@Immutable

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Examen {
    @Id
    private Long id;

    @Column(length = 30, nullable = false)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(length = 15, nullable = false)
    private TipoExamen tipo;

    @JdbcTypeCode(SqlTypes.TINYINT)
    @Column(nullable = false)
    private Integer modulo;

    @JdbcTypeCode(SqlTypes.SMALLINT)
    @Column(nullable = false)
    private Integer tiempoLimiteMinutos;

    @Column(nullable = false)
    private Integer version;

    @OneToMany(mappedBy = "examen")
    @OrderBy("posicion ASC")
    @ToString.Exclude
    private List<Pregunta> preguntas = new ArrayList<>();
}
