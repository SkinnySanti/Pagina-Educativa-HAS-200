package com.hass200.learning.backend_has200.models;

import com.hass200.learning.backend_has200.models.enums.Habilidad;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
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
public class Pregunta {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "examen_id", nullable = false)
    @ToString.Exclude
    private Examen examen;

    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private Integer posicion;

    @Column(nullable = false, columnDefinition = "TEXT")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String enunciado;

    @Column(nullable = false, length = 2)
    @JdbcTypeCode(SqlTypes.CHAR)
    private String idioma;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(length = 25, nullable = false)
    private Habilidad habilidad;

    @Column(length = 60, nullable = false)
    private String concepto;

    @Column(nullable = false, columnDefinition = "TEXT")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String explicacion;

    @Column(length = 20, nullable = false)
    private String referenciaModulo;

    @OneToMany(mappedBy = "pregunta")
    @OrderBy("posicion ASC")
    @ToString.Exclude
    private List<Opcion> opciones = new ArrayList<>();
}
