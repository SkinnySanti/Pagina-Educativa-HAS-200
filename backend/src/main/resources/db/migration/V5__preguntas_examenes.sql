-- V5: seed de preguntas y opciones de los examenes DIAGNOSTICOS
--  * DIAG-M1: Fundamentos de sistemas productivos y automatizacion
--  * DIAG-M2: PLC, senales y redes de datos
--  * Los examenes POST-M1 / POST-M2 siguen sin preguntas (migracion posterior)
--
-- Convenciones:
--  * Los ids se resuelven por examen.codigo / pregunta.posicion (nada hardcodeado).
--  * opcion.posicion 1..4 = A..D del examen en papel.
--  * pregunta.referencia_modulo = 'mX:paso' con paso BASE 0 (igual que progreso_guia, V4).
--  * Preguntas 1-8 en ES, 9-10 en EN (8 ES + 2 EN, como pide la especificacion).
--  * Preguntas con el mismo 'concepto' en ES y EN (p. ej. funcion-actuador) permiten
--    que Retroalimentacion compare si el estudiante entiende el tema en ambos idiomas.

SET @diag_m1 = (SELECT id FROM examen WHERE codigo = 'DIAG-M1');
SET @diag_m2 = (SELECT id FROM examen WHERE codigo = 'DIAG-M2');
SET @post_m1 = (SELECT id FROM examen WHERE codigo = 'POST-M1');
SET @post_m2 = (SELECT id FROM examen WHERE codigo = 'POST-M2');

-- ===============================================================
-- DIAG-M1: Fundamentos de sistemas productivos y automatizacion
-- ===============================================================

INSERT INTO pregunta (examen_id, posicion, enunciado, idioma, habilidad, concepto, explicacion, referencia_modulo) VALUES
(@diag_m1, 1, '¿Cuál es el orden correcto de un sistema productivo?', 'ES',
 'PENSAMIENTO_SECUENCIAL', 'entrada-proceso-salida',
 'Todo sistema productivo sigue el mismo camino: primero entra la materia prima (entrada), luego se transforma (proceso) y al final sale el producto terminado (salida).',
 'm1:0'),
(@diag_m1, 2, 'En un sistema productivo, ¿qué nombre recibe el material que aún no ha sido transformado?', 'ES',
 'TERMINOS_TECNICOS', 'materia-prima',
 'La materia prima es el material que entra al sistema y todavía no ha sido transformado. Después del proceso se convierte en producto terminado.',
 'm1:0'),
(@diag_m1, 3, 'En un sistema de producción automatizado, ¿qué es una "estación de trabajo"?', 'ES',
 'TERMINOS_TECNICOS', 'estacion-de-trabajo',
 'Una estación de trabajo es un puesto dentro del sistema donde se realiza una tarea específica. Varias estaciones, una tras otra, forman la línea de producción.',
 'm1:1'),
(@diag_m1, 4, '¿Cuál de las siguientes opciones describe la función de un SENSOR?', 'ES',
 'FUNCIONAMIENTO', 'funcion-sensor',
 'El sensor detecta: luz, presencia, posición. No mueve nada; solo entrega información al sistema. Son los "ojos" de la máquina.',
 'm1:2'),
(@diag_m1, 5, '¿Cuál de las siguientes opciones describe la función de un ACTUADOR?', 'ES',
 'FUNCIONAMIENTO', 'funcion-actuador',
 'El actuador ejecuta una acción física: empujar, mover o sujetar algo. Es quien "hace" lo que el sistema decide, a diferencia del sensor, que solo detecta.',
 'm1:2'),
(@diag_m1, 6, 'En un grifo automático de baño que abre el agua solo cuando acercas la mano, ¿qué elemento "detecta" tu mano?', 'ES',
 'FUNCIONAMIENTO', 'sensor-vs-actuador',
 'Quien detecta tu mano es el sensor. La válvula que abre el agua es el actuador. Regla rápida: detectar = sensor, ejecutar = actuador.',
 'm1:2'),
(@diag_m1, 7, 'En una máquina industrial, si la luz de la baliza (semáforo de la máquina) está en color ROJO, esto generalmente significa que:', 'ES',
 'FUNCIONAMIENTO', 'colores-baliza',
 'En la baliza, el rojo indica que el sistema se detuvo o hay una emergencia. El verde indica funcionamiento normal y el amarillo, que algo requiere atención o revisión.',
 'm1:3'),
(@diag_m1, 8, '¿Qué es la "automatización"?', 'ES',
 'TERMINOS_TECNICOS', 'automatizacion',
 'Automatizar es lograr que una máquina realice tareas por sí sola, sin que una persona la controle paso a paso.',
 'm1:4'),
(@diag_m1, 9, 'What is the main function of an actuator in an automated system?', 'EN',
 'INGLES', 'funcion-actuador',
 'Actuator = actuador: ejecuta una acción física, como empujar o mover algo ("to perform a physical action"). Detectar luz o presencia (to detect) es trabajo del sensor.',
 'm1:2'),
(@diag_m1, 10, 'What does the color GREEN usually mean on an industrial light tower (beacon)?', 'EN',
 'INGLES', 'colores-baliza',
 'Green = verde: el sistema funciona con normalidad ("working normally"). Rojo indica paro o emergencia y amarillo, atención o revisión.',
 'm1:3');

INSERT INTO opcion (pregunta_id, posicion, texto, es_correcta)
SELECT p.id, v.posicion, v.texto, v.es_correcta
FROM (
    -- P1
    SELECT 1 AS q, 1 AS posicion, 'Proceso → Entrada → Salida' AS texto, 0 AS es_correcta
    UNION ALL SELECT 1, 2, 'Entrada → Proceso → Salida', 1
    UNION ALL SELECT 1, 3, 'Salida → Proceso → Entrada', 0
    UNION ALL SELECT 1, 4, 'Entrada → Salida → Proceso', 0
    -- P2 (OJO: la clave del .docx dice C, pero la correcta es B: materia prima)
    UNION ALL SELECT 2, 1, 'Producto terminado', 0
    UNION ALL SELECT 2, 2, 'Materia prima (entrada)', 1
    UNION ALL SELECT 2, 3, 'Actuador', 0
    UNION ALL SELECT 2, 4, 'Proceso', 0
    -- P3
    UNION ALL SELECT 3, 1, 'El lugar donde se guardan las herramientas', 0
    UNION ALL SELECT 3, 2, 'Un puesto dentro del sistema con una tarea específica', 1
    UNION ALL SELECT 3, 3, 'Un tipo de sensor', 0
    UNION ALL SELECT 3, 4, 'El nombre del operario encargado', 0
    -- P4
    UNION ALL SELECT 4, 1, 'Empujar una pieza de un lugar a otro', 0
    UNION ALL SELECT 4, 2, 'Detectar algo, como luz, presencia o posición', 1
    UNION ALL SELECT 4, 3, 'Encender una alarma sin motivo', 0
    UNION ALL SELECT 4, 4, 'Transformar la materia prima en producto', 0
    -- P5
    UNION ALL SELECT 5, 1, 'Detectar la posición de una pieza', 0
    UNION ALL SELECT 5, 2, 'Ejecutar una acción física, como mover o sujetar algo', 1
    UNION ALL SELECT 5, 3, 'Mostrar en pantalla el estado del sistema', 0
    UNION ALL SELECT 5, 4, 'Guardar los datos del proceso', 0
    -- P6
    UNION ALL SELECT 6, 1, 'El actuador', 0
    UNION ALL SELECT 6, 2, 'La válvula de agua', 0
    UNION ALL SELECT 6, 3, 'El sensor', 1
    UNION ALL SELECT 6, 4, 'La tubería', 0
    -- P7
    UNION ALL SELECT 7, 1, 'Todo funciona con normalidad', 0
    UNION ALL SELECT 7, 2, 'Hay que poner atención, algo requiere revisión', 0
    UNION ALL SELECT 7, 3, 'El sistema se detuvo o hay una emergencia', 1
    UNION ALL SELECT 7, 4, 'El sistema está en modo de ahorro de energía', 0
    -- P8
    UNION ALL SELECT 8, 1, 'Que una persona controle cada paso de la máquina a mano', 0
    UNION ALL SELECT 8, 2, 'Que una máquina realice tareas por sí sola, sin que alguien la controle paso a paso', 1
    UNION ALL SELECT 8, 3, 'Que una fábrica deje de producir por mantenimiento', 0
    UNION ALL SELECT 8, 4, 'Que todas las máquinas tengan el mismo color', 0
    -- P9 (EN)
    UNION ALL SELECT 9, 1, 'To detect light or presence', 0
    UNION ALL SELECT 9, 2, 'To perform a physical action, like pushing or moving something', 1
    UNION ALL SELECT 9, 3, 'To store information about the process', 0
    UNION ALL SELECT 9, 4, 'To turn off the whole factory', 0
    -- P10 (EN)
    UNION ALL SELECT 10, 1, 'The system stopped due to an emergency', 0
    UNION ALL SELECT 10, 2, 'The system needs attention or review', 0
    UNION ALL SELECT 10, 3, 'The system is working normally', 1
    UNION ALL SELECT 10, 4, 'The system is turned off', 0
) v
JOIN pregunta p ON p.examen_id = @diag_m1 AND p.posicion = v.q;

-- ===============================================================
-- DIAG-M2: PLC, senales y redes de datos
-- ===============================================================

INSERT INTO pregunta (examen_id, posicion, enunciado, idioma, habilidad, concepto, explicacion, referencia_modulo) VALUES
(@diag_m2, 1, 'En un sistema de automatización industrial, ¿cómo se llama el dispositivo que actúa como el "cerebro", recibiendo información de los sensores y decidiendo qué hacer?', 'ES',
 'TERMINOS_TECNICOS', 'funcion-plc',
 'El PLC es el "cerebro" del sistema: recibe la información de los sensores y decide qué hacer. El SCADA solo supervisa y el switch solo reparte mensajes en la red.',
 'm2:0'),
(@diag_m2, 2, 'Las reglas que sigue un PLC para tomar decisiones normalmente tienen la forma:', 'ES',
 'FUNCIONAMIENTO', 'logica-si-entonces',
 'El PLC sigue reglas programadas del tipo "SI pasa esto, ENTONCES haz aquello". Siempre responde igual ante la misma situación; no improvisa ni espera al operador.',
 'm2:0'),
(@diag_m2, 3, 'Una señal DIGITAL se caracteriza porque:', 'ES',
 'TERMINOS_TECNICOS', 'senal-digital',
 'Una señal digital solo tiene dos valores posibles: sí o no (1 o 0). Por ejemplo, un botón presionado o no presionado.',
 'm2:1'),
(@diag_m2, 4, '¿Cuál de estos ejemplos corresponde a una señal ANALÓGICA?', 'ES',
 'TERMINOS_TECNICOS', 'senal-analogica',
 'La presión de aire puede tomar muchos valores distintos, por eso es analógica. Las otras opciones solo tienen dos estados (sí/no, encendido/apagado), es decir, son digitales.',
 'm2:1'),
(@diag_m2, 5, 'En un sistema de automatización, ¿cuál es el orden correcto del recorrido de una señal, desde que es detectada hasta que se muestra en pantalla?', 'ES',
 'PENSAMIENTO_SECUENCIAL', 'recorrido-senal',
 'La señal nace en el sensor, pasa por el PLC, viaja por la red a través del switch, llega al computador y finalmente se ve en la pantalla: Sensor → PLC → Switch → Computador → Pantalla.',
 'm2:2'),
(@diag_m2, 6, 'Cuando un sensor envía su información a través de la red, al computador llega:', 'ES',
 'FUNCIONAMIENTO', 'mensaje-de-red',
 'Por la red no viaja la electricidad del sensor, sino un mensaje (datos) que describe lo que el sensor detectó.',
 'm2:3'),
(@diag_m2, 7, '¿Cuál es la función de un SWITCH en una red de datos?', 'ES',
 'FUNCIONAMIENTO', 'funcion-switch',
 'El switch recibe los mensajes de la red y los reparte hacia donde deben ir. No detecta piezas, no muestra alarmas y no reemplaza al PLC.',
 'm2:3'),
(@diag_m2, 8, '¿Para qué sirve una pantalla de supervisión tipo SCADA en una fábrica?', 'ES',
 'TERMINOS_TECNICOS', 'funcion-scada',
 'Una pantalla SCADA permite ver el estado, los contadores y las alarmas del proceso. Supervisa; no reemplaza sensores ni transforma material.',
 'm2:4'),
(@diag_m2, 9, 'What does a PLC do in an automated system?', 'EN',
 'INGLES', 'funcion-plc',
 'El PLC sigue reglas programadas para decidir qué acción tomar ("follows programmed rules to decide what action to take"). Mover piezas lo hacen los actuadores y mostrar alarmas, la pantalla SCADA.',
 'm2:0'),
(@diag_m2, 10, 'What is the correct order of a signal''s journey, from the sensor to the screen?', 'EN',
 'INGLES', 'recorrido-senal',
 'Sensor → PLC → Switch → Computer → Screen. La señal se detecta (sensor), se procesa (PLC), viaja por la red (switch) y se muestra al final en la pantalla.',
 'm2:2');

INSERT INTO opcion (pregunta_id, posicion, texto, es_correcta)
SELECT p.id, v.posicion, v.texto, v.es_correcta
FROM (
    -- P1
    SELECT 1 AS q, 1 AS posicion, 'SCADA' AS texto, 0 AS es_correcta
    UNION ALL SELECT 1, 2, 'Switch', 0
    UNION ALL SELECT 1, 3, 'PLC', 1
    UNION ALL SELECT 1, 4, 'Cable de red', 0
    -- P2
    UNION ALL SELECT 2, 1, '"Tal vez pase esto, tal vez no"', 0
    UNION ALL SELECT 2, 2, '"SI pasa esto, ENTONCES haz aquello"', 1
    UNION ALL SELECT 2, 3, '"Siempre haz lo mismo, sin importar nada"', 0
    UNION ALL SELECT 2, 4, '"Pregúntale al operador antes de actuar"', 0
    -- P3
    UNION ALL SELECT 3, 1, 'Puede tomar muchos valores diferentes', 0
    UNION ALL SELECT 3, 2, 'Solo tiene dos valores posibles: sí o no (1 o 0)', 1
    UNION ALL SELECT 3, 3, 'Solo existe dentro de una pantalla de supervisión', 0
    UNION ALL SELECT 3, 4, 'Mide con exactitud la temperatura ambiente', 0
    -- P4
    UNION ALL SELECT 4, 1, 'Un botón que está presionado o no presionado', 0
    UNION ALL SELECT 4, 2, 'Un sensor que detecta si hay o no una pieza', 0
    UNION ALL SELECT 4, 3, 'La presión de aire en un tanque, que puede tener muchos valores', 1
    UNION ALL SELECT 4, 4, 'Una luz que está encendida o apagada', 0
    -- P5
    UNION ALL SELECT 5, 1, 'Pantalla → Switch → PLC → Sensor → Computador', 0
    UNION ALL SELECT 5, 2, 'Sensor → PLC → Switch → Computador → Pantalla', 1
    UNION ALL SELECT 5, 3, 'PLC → Sensor → Pantalla → Switch → Computador', 0
    UNION ALL SELECT 5, 4, 'Switch → Sensor → Computador → PLC → Pantalla', 0
    -- P6
    UNION ALL SELECT 6, 1, 'La misma electricidad que generó el sensor', 0
    UNION ALL SELECT 6, 2, 'Un mensaje con la información de lo que el sensor detectó', 1
    UNION ALL SELECT 6, 3, 'Nada, el computador no recibe información del sensor', 0
    UNION ALL SELECT 6, 4, 'Solamente una fotografía del sensor', 0
    -- P7
    UNION ALL SELECT 7, 1, 'Detectar piezas en una banda transportadora', 0
    UNION ALL SELECT 7, 2, 'Recibir los mensajes y repartirlos a donde deben ir', 1
    UNION ALL SELECT 7, 3, 'Mostrar las alarmas en la pantalla', 0
    UNION ALL SELECT 7, 4, 'Reemplazar al PLC cuando este falla', 0
    -- P8
    UNION ALL SELECT 8, 1, 'Para reemplazar los sensores del sistema', 0
    UNION ALL SELECT 8, 2, 'Para ver el estado, los contadores y las alarmas del proceso', 1
    UNION ALL SELECT 8, 3, 'Para cocinar o transformar el material', 0
    UNION ALL SELECT 8, 4, 'Para conectar los cables directamente entre máquinas', 0
    -- P9 (EN)
    UNION ALL SELECT 9, 1, 'It physically pushes or moves pieces', 0
    UNION ALL SELECT 9, 2, 'It follows programmed rules to decide what action to take', 1
    UNION ALL SELECT 9, 3, 'It only displays alarms on a screen', 0
    UNION ALL SELECT 9, 4, 'It replaces the need for sensors', 0
    -- P10 (EN)
    UNION ALL SELECT 10, 1, 'Screen → Computer → Switch → PLC → Sensor', 0
    UNION ALL SELECT 10, 2, 'Sensor → PLC → Switch → Computer → Screen', 1
    UNION ALL SELECT 10, 3, 'PLC → Switch → Sensor → Screen → Computer', 0
    UNION ALL SELECT 10, 4, 'Switch → PLC → Screen → Sensor → Computer', 0
) v
JOIN pregunta p ON p.examen_id = @diag_m2 AND p.posicion = v.q;

-- ---------------------------------------------------------------
-- 1. POST-M1  <-  DIAG-M1
-- ---------------------------------------------------------------
INSERT INTO pregunta (examen_id, posicion, enunciado, idioma, habilidad, concepto, explicacion, referencia_modulo)
SELECT @post_m1, posicion, enunciado, idioma, habilidad, concepto, explicacion, referencia_modulo
FROM pregunta
WHERE examen_id = @diag_m1;
 
INSERT INTO opcion (pregunta_id, posicion, texto, es_correcta)
SELECT pp.id, o.posicion, o.texto, o.es_correcta
FROM opcion o
JOIN pregunta pd ON pd.id = o.pregunta_id AND pd.examen_id = @diag_m1
JOIN pregunta pp ON pp.examen_id = @post_m1 AND pp.posicion = pd.posicion;
 
-- ---------------------------------------------------------------
-- 2. POST-M2  <-  DIAG-M2
-- ---------------------------------------------------------------
INSERT INTO pregunta (examen_id, posicion, enunciado, idioma, habilidad, concepto, explicacion, referencia_modulo)
SELECT @post_m2, posicion, enunciado, idioma, habilidad, concepto, explicacion, referencia_modulo
FROM pregunta
WHERE examen_id = @diag_m2;
 
INSERT INTO opcion (pregunta_id, posicion, texto, es_correcta)
SELECT pp.id, o.posicion, o.texto, o.es_correcta
FROM opcion o
JOIN pregunta pd ON pd.id = o.pregunta_id AND pd.examen_id = @diag_m2
JOIN pregunta pp ON pp.examen_id = @post_m2 AND pp.posicion = pd.posicion;
