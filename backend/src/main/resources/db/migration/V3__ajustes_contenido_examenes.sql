-- V3: ajustes de contenido de examenes
--  * examen.modulo y renombre de tipo FINAL -> POST_RECORRIDO
--  * pregunta.habilidad, pregunta.concepto, pregunta.explicacion
--  * seed de los 4 examenes (las preguntas van en una migracion posterior)
 
-- ---------------------------------------------------------------
-- 0. Limpieza de datos de prueba (SOLO DESARROLLO)
--    Las columnas nuevas son NOT NULL, asi que las filas de prueba de la
--    V1 no pueden convivir con ellas. Se borra de hijos a padres por las FK.
-- ---------------------------------------------------------------
DELETE FROM respuesta_intento;
DELETE FROM intento;
DELETE FROM opcion;
DELETE FROM pregunta;
DELETE FROM examen;

-- ---------------------------------------------------------------
-- 1. examen: modulo + nuevo tipo
-- ---------------------------------------------------------------

ALTER TABLE examen DROP CHECK ck_examen_tipo;

ALTER TABLE examen
    ADD COLUMN modulo TINYINT NOT NULL AFTER tipo;

ALTER TABLE examen
    ADD CONSTRAINT ck_examen_tipo CHECK (tipo IN ('DIAGNOSTICO', 'POST_RECORRIDO')),
    ADD CONSTRAINT ck_examen_modulo CHECK (modulo IN (1, 2)),
    ADD CONSTRAINT uq_examen_tipo_modulo UNIQUE (tipo, modulo);

-- ---------------------------------------------------------------
-- 2. pregunta: habilidad, concepto, explicacion
-- ---------------------------------------------------------------

ALTER TABLE pregunta
    ADD COLUMN habilidad VARCHAR(25) NOT NULL AFTER idioma,
    ADD COLUMN concepto VARCHAR(60) NOT NULL AFTER habilidad,   -- clave estable, p. ej. 'sensor-vs-actuador'
    ADD COLUMN explicacion TEXT NOT NULL AFTER concepto;    -- el "por que" de la retroalimentacion

ALTER TABLE pregunta
    ADD CONSTRAINT ck_pregunta_habilidad CHECK (habilidad IN (
        'INGLES', 'FUNCIONAMIENTO', 'TERMINOS_TECNICOS', 'PENSAMIENTO_SISTEMICO'));

-- ---------------------------------------------------------------
-- 3. Seed: los 4 examenes
-- ---------------------------------------------------------------

INSERT INTO examen (codigo, tipo, modulo, tiempo_limite_minutos, version) VALUES 
    ('DIAG-M1', 'DIAGNOSTICO', 1, 20, 1),
    ('DIAG-M2', 'DIAGNOSTICO', 2, 20, 1),
    ('POST-M1', 'POST_RECORRIDO', 1, 20, 1),
    ('POST-M2', 'POST_RECORRIDO', 2, 20, 1);

















