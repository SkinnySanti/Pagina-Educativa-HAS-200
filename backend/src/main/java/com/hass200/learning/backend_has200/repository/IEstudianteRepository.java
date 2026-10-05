package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface IEstudianteRepository extends JpaRepository<Estudiante, Long> {
    boolean existsByCorreo(String correo);
    boolean existsByAlias(String alias);
    Optional<Estudiante> findByCorreo(String correo);
}
