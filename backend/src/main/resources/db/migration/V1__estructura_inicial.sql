-- V1: esquema inicial de HAS 200 Learning
-- Todas las fechas se guardan en UTC y las asigna Spring (sin DEFAULT en la BD).

CREATE TABLE estudiante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    alias VARCHAR(20) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(100) NOT NULL,
    politica_aceptada_en DATETIME NOT NULL,
    creado_en DATETIME NOT NULL
);

CREATE TABLE examen (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    tipo VARCHAR(15) NOT NULL,
    tiempo_limite_minutos SMALLINT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    CONSTRAINT ck_examen_tipo CHECK (tipo IN ('DIAGNOSTICO', 'FINAL'))
);

CREATE TABLE pregunta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    examen_id BIGINT NOT NULL,
    posicion SMALLINT NOT NULL,
    enunciado TEXT NOT NULL,
    idioma CHAR(2) NOT NULL,
    referencia_modulo VARCHAR(20) NOT NULL, -- modulo y paso donde se estudia el tema, p. ej. 'm1:3'
    CONSTRAINT uq_pregunta_examen_posicion UNIQUE (examen_id, posicion),
    CONSTRAINT ck_pregunta_idioma CHECK (idioma IN ('ES', 'EN')),
    CONSTRAINT fk_pregunta_examen
        FOREIGN KEY (examen_id) REFERENCES examen (id)
);

CREATE TABLE opcion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pregunta_id BIGINT NOT NULL,
    posicion SMALLINT NOT NULL,
    texto VARCHAR(500) NOT NULL,
    es_correcta BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_opcion_pregunta_posicion UNIQUE (pregunta_id, posicion),
    CONSTRAINT fk_opcion_pregunta
        FOREIGN KEY (pregunta_id) REFERENCES pregunta (id)
);

CREATE TABLE intento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    examen_id BIGINT NOT NULL,
    iniciado_en DATETIME NOT NULL,
    vence_en DATETIME NOT NULL,
    enviado_en DATETIME NULL,
    estado VARCHAR(10) NOT NULL,
    aciertos SMALLINT NULL,
    total SMALLINT NULL,
    puntaje SMALLINT NULL,
    clave_intento_unico VARCHAR(40) NULL UNIQUE, -- solo se llena al pasar a ENVIADO en diagnosticos
    CONSTRAINT ck_intento_estado CHECK (estado IN ('EN_CURSO', 'ENVIADO', 'VENCIDO')),
    CONSTRAINT fk_intento_estudiante
        FOREIGN KEY (estudiante_id) REFERENCES estudiante (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_intento_examen
        FOREIGN KEY (examen_id) REFERENCES examen (id)
);

CREATE TABLE respuesta_intento (
    intento_id  BIGINT NOT NULL,
    pregunta_id BIGINT NOT NULL,
    opcion_id   BIGINT NULL,  -- NULL = sin responder
    PRIMARY KEY (intento_id, pregunta_id),
    CONSTRAINT fk_respuesta_intento_intento
        FOREIGN KEY (intento_id) REFERENCES intento (id) ON DELETE CASCADE,
    CONSTRAINT fk_respuesta_intento_pregunta
        FOREIGN KEY (pregunta_id) REFERENCES pregunta (id),
    CONSTRAINT fk_respuesta_intento_opcion
        FOREIGN KEY (opcion_id) REFERENCES opcion (id)
);

-- CREATE TABLE progreso_guia (
--     estudiante_id BIGINT   NOT NULL,
--     modulo_id     SMALLINT NOT NULL,
--     paso_indice   SMALLINT NOT NULL,
--     PRIMARY KEY (estudiante_id, modulo_id, paso_indice),
--     CONSTRAINT fk_progreso_guia_estudiante
--         FOREIGN KEY (estudiante_id) REFERENCES estudiante (id) ON DELETE CASCADE
-- );