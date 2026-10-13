package com.hass200.learning.backend_has200.models;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.Instant;

@Entity
@Immutable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProgresoGuia {
    @EmbeddedId
    private ProgresoGuiaId id;

    @Column(name = "creado_en", nullable = false)
    private Instant creadoEn;
}
