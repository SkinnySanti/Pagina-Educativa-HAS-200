package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.Pregunta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IpreguntaRepository extends Repository<Pregunta, Long> {
    @Query("""
        select p
        from Pregunta p
        join fetch p.opciones o
        where p.examen.id = :examenId
        order by p.posicion, o.posicion
        """)
    List<Pregunta> findConOpcionesByExamenId(@Param("examenId") Long examenId);
}
