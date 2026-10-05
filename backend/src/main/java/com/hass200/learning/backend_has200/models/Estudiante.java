package com.hass200.learning.backend_has200.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "estudiante")
public class Estudiante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String correo;

    @Column(nullable = false, length = 20)
    private String alias;

    @ToString.Exclude
    @Column(nullable = false)
    private String contrasenaHash;

    @Column(nullable = false)
    private Instant politicaAceptadaEn;

    @Column(nullable = false)
    private Instant creadoEn;
}
