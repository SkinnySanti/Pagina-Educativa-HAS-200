package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.Intento;
import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface IntentoRepository extends Repository<Intento, Long> {
    Intento save(Intento intento);
    Optional<Intento> findByIdAndEstudianteId(Long id, Long estudianteId);
    Optional<Intento>
    findFirstByEstudianteIdAndExamenIdAndEstadoAndVenceEnAfterOrderByIniciadoEnDesc(
            Long estudianteId, Long examenId, EstadoIntento estado, Instant ahora);

    @Query("""
        select i.examen.id as examenId, i.id as intentoId
        from Intento i
        where i.estudiante.id = :estudianteId
          and i.estado = com.hass200.learning.backend_has200.models.enums.EstadoIntento.EN_CURSO
          and i.venceEn > :ahora
        """)
    List<IntentoEnCursoResumen> listarEnCursoVigentes(
            @Param("estudianteId") Long estudianteId,
            @Param("ahora") Instant ahora);

    @Query("""
        select distinct i.examen.id
        from Intento i
        where i.estudiante.id = :estudianteId
          and i.estado = com.hass200.learning.backend_has200.models.enums.EstadoIntento.ENVIADO
        """)
    List<Long> listarExamenIdsEnviados(@Param("estudianteId") Long estudianteId);
}
