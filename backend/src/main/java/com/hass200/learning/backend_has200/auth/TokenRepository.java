package com.hass200.learning.backend_has200.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<TokenRefresco,Long> {
    Optional<TokenRefresco> findByTokenHash (String tokerHash);

    @Modifying
    @Query("update TokenRefresco t set t.revocadoEn = :ahora "
            + "where t.id = :id and t.revocadoEn is null")
    int revocarSiActivo(@Param("id") Long id, @Param("ahora") Instant ahora);

    @Modifying
    @Query("update TokenRefresco t set t.revocadoEn = :ahora "
            + "where t.estudianteId = :estudianteId and t.revocadoEn is null")
    int revocarTodosDelEstudiante(@Param("estudianteId") Long estudianteId,
                                  @Param("ahora") Instant ahora);
}
