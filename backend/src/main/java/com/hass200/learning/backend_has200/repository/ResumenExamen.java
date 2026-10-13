package com.hass200.learning.backend_has200.repository;

import com.hass200.learning.backend_has200.models.enums.TipoExamen;

public interface ResumenExamen {
    Long getId();
    String getCodigo();
    TipoExamen getTipo();
    Integer getModulo();
    Integer getTiempoLimiteMinutos();
    Long getTotalPreguntas();
    Long getPreguntasEnIngles();
}
