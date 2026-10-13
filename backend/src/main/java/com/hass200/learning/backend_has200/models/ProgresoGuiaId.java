package com.hass200.learning.backend_has200.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class ProgresoGuiaId implements Serializable {

    @Column(name = "estudiante_id")
    private Long estudianteId;

    @Column(name = "modulo", length = 2)
    private String modulo;

    @JdbcTypeCode(SqlTypes.TINYINT)
    @Column(name = "paso")
    private Integer paso;

    public ProgresoGuiaId(Long estudianteId, String modulo, Integer paso) {
        this.estudianteId = estudianteId;
        this.modulo = modulo;
        this.paso = paso;
    }
}
