package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.Examen;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface IExamenRepository extends Repository<Examen, Long> {
    Optional<Examen> findById(Long id);
    @Query("""
        select e.id as id,
               e.codigo as codigo,
               e.tipo as tipo,
               e.modulo as modulo,
               e.tiempoLimiteMinutos as tiempoLimiteMinutos,
               count(p) as totalPreguntas,
               coalesce(sum(case when p.idioma = 'EN' then 1 else 0 end), 0) as preguntasEnIngles
        from Examen e
        left join e.preguntas p
        group by e.id, e.codigo, e.tipo, e.modulo, e.tiempoLimiteMinutos
        order by e.tipo, e.modulo
        """)
    List<ResumenExamen> listarResumenes();
}
