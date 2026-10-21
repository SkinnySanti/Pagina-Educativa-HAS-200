# CONOCIMIENTO DEL HAS-200 Y DE LA PLATAFORMA HAS 200 LEARNING

(Este archivo es la memoria del tutor. Para que sepa más, agrega aquí el contenido y reinicia el backend.)

## 1. Qué es la plataforma
HAS 200 Learning es la inducción oficial antes de entrar al laboratorio HAS-200: el estudiante conoce el sistema, practica con guías y comprueba lo aprendido, viéndolo como un sistema integrado y no como piezas sueltas. Al terminar podrá: identificar los componentes principales del sistema, explicar el mecanismo de cada parte independiente y describir cómo funcionan e interactúan los subsistemas.
Módulos del menú:
- Inicio: la ruta de aprendizaje. Orden sugerido: Evaluación diagnóstica -> Guías -> Juegos -> Exámenes.
- Guías: Módulo 1 (Guía informativa) y Módulo 2 (Cómo piensa y se comunica). Cada una tiene 6 pasos con retos interactivos. El avance se guarda en la cuenta; se puede leer sin cuenta, pero entonces no se guarda y no se desbloquea el examen post recorrido.
- Juegos: repaso con sopas de letras, crucigramas, ordenar y tarjetas. No guardan puntaje ni afectan los exámenes; se juega las veces que se quiera.
- Exámenes: diagnóstico (punto de partida, antes de las guías) y post recorrido (al completar la guía del módulo). Hay uno de cada tipo por módulo (4 en total). Exigen sesión iniciada y se responden dentro de un tiempo límite. El diagnóstico del Módulo 1 trata fundamentos de sistemas productivos y automatización; el del Módulo 2, PLC, señales y redes de datos. Incluyen algunas preguntas en inglés.
- Retroalimentación: próximamente. Mostrará en qué preguntas se falló, cuál era la respuesta correcta y en qué módulo repasar.
- Tutor virtual: este chat.

## 2. La visita al laboratorio
El equipo recorre el HAS-200 e identifica las estaciones con sus propios ojos y registra lo que ve en su Instrumento de Trabajo. Todo se hace bajo la supervisión del gestor de conocimiento. Los botones, el paro de emergencia y los equipos se manejan solo con esa supervisión.

## 3. Módulo 1: qué es el HAS-200
- El HAS-200 es una mini fábrica automática: permite ver, en pequeño y de forma segura, cómo funciona una fábrica de verdad que casi funciona sola.
- Sistema productivo: conjunto organizado de personas, máquinas y pasos que transforman materiales en un producto. Todos funcionan igual: ENTRADA (materia prima, lo que aún no está transformado) -> PROCESO (lo que se le hace al material para cambiarlo) -> SALIDA (producto final listo para usarse o venderse).
  Ejemplos: arepas (masa de maíz -> se amasa, moldea y cocina -> arepa lista); camisetas (tela e hilo -> se corta y se cose -> camiseta terminada); HAS-200 (piezas sueltas -> se transportan, seleccionan y ensamblan -> pieza entregada al final).
- Estaciones: el HAS-200 no es una sola máquina sino varias estaciones conectadas, cada una con una tarea, como una carrera de relevos. Cuatro roles: Entrada de material (recibe las piezas), Transporte con banda (mueve el material de una estación a otra), Selección/Ensamble (clasifica o une piezas) y Salida de producto (entrega lo terminado).
- Sensor ("los ojos"): detecta luz, presencia o posición. Es información que ENTRA al sistema; no mueve nada. Actuador ("las manos"): empuja, mueve, sujeta o gira; es una acción que SALE del sistema. Ejemplo: en el grifo automático de un baño público, un sensor detecta la mano y un actuador abre la válvula. Detectar/medir = sensor; empujar/sujetar/girar un motor = actuador.
- Baliza: luz tipo semáforo que indica el estado de la máquina. Verde = funciona con normalidad. Amarillo = hay que poner atención, algo requiere revisión. Rojo = el sistema se detuvo o hay una emergencia.
- Botonera: Iniciar, Detener, Reset y PARO DE EMERGENCIA (detiene todo de inmediato ante cualquier riesgo; después hay que pulsar Reset para volver a empezar). En la guía es una simulación educativa.
- Automatización: lograr que una máquina haga tareas por sí sola, sin que una persona la controle paso a paso.
- Por qué importa: buena parte de la industria (alimentos, ropa, carros, medicamentos) usa sistemas parecidos. La producción en serie se popularizó a inicios del siglo XX con los automóviles y redujo un proceso de casi un día a un par de horas. Es la puerta de entrada a ingeniería industrial, mecatrónica, automatización y tecnología.
- Glosario del M1: sistema productivo, estación, sensor, actuador, automatización, baliza.

## 4. Módulo 2: cómo piensa y se comunica
Camino de una señal: nace en un SENSOR -> la interpreta el PLC -> viaja por la RED (switch) -> llega a un COMPUTADOR -> se ve en la PANTALLA. Ocurre en una fracción de segundo, casi en tiempo real.
- PLC (controlador lógico programable): computador industrial, resistente y confiable, que decide qué hace la máquina. Repite un ciclo de 3 pasos: lee las entradas (sensores, botones), ejecuta su programa y actualiza las salidas (motores, luces). Ejemplo de regla: SI hay pieza Y NO hay paro de emergencia -> se mueve la banda. Con el paro de emergencia activo, el PLC detiene todo y pone la baliza en rojo. Analogía: un chef que lee la comanda (entradas), sigue la receta (programa) y avisa a la cocina (salidas).
- Señal digital: solo dos estados, 0 o 1 (apagado/encendido; hay pieza o no hay). Ejemplos: presencia de pieza, pulsador, paro de emergencia. Señal analógica: toma muchos valores intermedios (temperatura, nivel de un tanque, presión, velocidad). Regla rápida: si solo hay "sí o no" es digital; si importa "cuánto" es analógica.
- Red de datos: los equipos (PLC, computador) se conectan con cable de red terminado en conector RJ45. El switch actúa como un tablero que reparte los datos entre los equipos conectados. Cada puerto tiene luces LED: la de enlace (generalmente verde) indica que hay un equipo conectado y la de actividad (a menudo ámbar) indica que pasan datos; los colores pueden variar según el fabricante. Si algo no se comunica, lo primero es revisar el cable y las luces del switch.
- SCADA (supervisión, control y adquisición de datos): programa que recoge datos del PLC y los muestra en pantalla: qué está encendido, cuántas piezas van, si hay alarma. En el HAS-200 la supervisión se hace con 3dSupra. Permite que una persona cuide muchas máquinas a la vez y reaccione rápido ante una falla.
- Glosario del M2: PLC, señal digital, señal analógica, RJ45, switch, SCADA.

## 5. Pirámide de automatización (dónde encaja el HAS-200)
Cinco niveles, del piso de planta a la gestión del negocio: I Campo (sensores que miden y actuadores que mueven o accionan), II Control (el "cerebro": un PLC, un PC industrial o controladores PID), III SCADA (pantallas de supervisión en tiempo real), IV MES (gestiona la producción día a día: qué se fabricó, cuánto y con qué calidad), V ERP (sistema de toda la empresa: inventario, compras, finanzas). Los módulos de la plataforma cubren Campo y Control, que es donde vive el HAS-200; los niveles III a V quedan fuera del alcance de esta versión (el Módulo 2 solo introduce SCADA).

## 6. Lo que NO está en este material
Marca y modelo exactos de los equipos del laboratorio, números de referencia, procedimientos de operación, esquemas eléctricos, programación del PLC y valores técnicos. Para eso, remitir al gestor de conocimiento en el laboratorio.
