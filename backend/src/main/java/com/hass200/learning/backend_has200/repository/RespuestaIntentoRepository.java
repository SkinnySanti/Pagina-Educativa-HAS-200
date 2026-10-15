package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.RespuestaIntento;
import com.hass200.learning.backend_has200.models.RespuestaIntentoId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RespuestaIntentoRepository extends Repository<RespuestaIntento, RespuestaIntentoId> {
    @Query("""
        select r from RespuestaIntento r
        left join fetch r.opcion
        where r.id.intentoId = :intentoId
        """)
    List<RespuestaIntento> findByIntentoIdConOpcion(@Param("intentoId") Long intentoId);
}
