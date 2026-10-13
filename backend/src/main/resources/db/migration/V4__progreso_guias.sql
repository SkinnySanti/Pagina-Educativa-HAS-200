-- V4: progreso de las guias (reemplaza el localStorage de useGuideProgress.js)
-- Una fila = un paso completado por un estudiante en un modulo.
-- modulo se guarda como 'm1' / 'm2' (igual que la API).
-- paso es base 0 (igual que el frontend): 0..5, 6 pasos por modulo.

CREATE TABLE progreso_guia(
    estudiante_id BIGINT NOT NULL,
    modulo VARCHAR(2) COLLATE utf8mb4_bin NOT NULL, -- _bin: 'M1' no pasa el CHECK
    paso TINYINT NOT NULL,
    creado_en DATETIME NOT NULL,
    PRIMARY KEY (estudiante_id, modulo, paso),
    CONSTRAINT ck_progreso_modulo CHECK (modulo IN ('m1', 'm2')),
    CONSTRAINT ck_progreso_paso CHECK (paso BETWEEN 0 AND 5),
    CONSTRAINT fk_progreso_estudiante
        FOREIGN KEY (estudiante_id) REFERENCES estudiante(id)
        ON DELETE CASCADE
);