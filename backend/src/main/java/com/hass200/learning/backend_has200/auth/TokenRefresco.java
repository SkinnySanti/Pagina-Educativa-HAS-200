package com.hass200.learning.backend_has200.auth;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TokenRefresco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long estudianteId;

    @Column(nullable = false, length = 64, unique = true)
    private String tokenHash;

    @Column(nullable = false)
    private Instant creadoEn;

    @Column(nullable = false)
    private Instant venceEn;

    @Column(nullable = true)
    private Instant revocadoEn;

    public boolean estaRevocado(){return revocadoEn != null;}

    public boolean estaVencido(Instant ahora){return !ahora.isBefore(venceEn);}
}
