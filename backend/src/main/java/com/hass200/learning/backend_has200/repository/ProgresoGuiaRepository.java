package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.ProgresoGuia;
import com.hass200.learning.backend_has200.models.ProgresoGuiaId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface    ProgresoGuiaRepository extends Repository<ProgresoGuia, ProgresoGuiaId> {

    List<ProgresoGuia> findByIdEstudianteId(Long estudianteId);

    long countByIdEstudianteIdAndIdModulo(Long estudianteId, String modulo);

    @Modifying
    @Query(value = """
        INSERT INTO progreso_guia (estudiante_id, modulo, paso, creado_en)
        VALUES (:estudianteId, :modulo, :paso, :creadoEn)
        ON DUPLICATE KEY UPDATE creado_en = creado_en
        """, nativeQuery = true)
    int marcarPaso(@Param("estudianteId") Long estudianteId,
                   @Param("modulo") String modulo,
                   @Param("paso") int paso,
                   @Param("creadoEn") Instant creadoEn);
}
