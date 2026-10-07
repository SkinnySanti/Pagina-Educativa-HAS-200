// Textos de la página de Guías (español). Misma estructura que guias.en.js.
// **doble asterisco** = negrita (lo interpreta components/common/RichText.vue).
// Módulo 1 = contenido de "Guia_Informativa_HAS200.docx".

import m2 from './guias.m2.es.js'

export default {
  crumbs: { label: 'Ruta de navegación', home: 'Inicio', guides: 'Guías', module1: 'Módulo 1 · Guía informativa', module2: 'Módulo 2 · Cómo piensa y se comunica' },

  picker: {
    label: 'Módulos de guías',
    here: 'Estás aquí',
    soon: 'Pronto',
    open: 'Abrir',
    soonTitle: 'Disponible pronto',
    modules: [
      { title: 'Módulo 1 · Guía informativa', text: 'Conoce el HAS-200 antes de tu visita.' },
      { title: 'Módulo 2 · Cómo piensa y se comunica', text: 'Del sensor a la pantalla: PLC, señales, red y SCADA.' },
    ],
  },

  hero: {
    badge: 'Módulo 1 · Guía informativa',
    title: '¿Qué es el HAS-200?',
    text: 'Descubre la mini fábrica que piensa por sí sola.',
    chips: ['6 pasos', 'Con retos interactivos', 'Antes de tu visita al laboratorio'],
  },

  intro: {
    hook: '¿Alguna vez te has preguntado cómo es posible que existan miles de gaseosas, zapatillas o celulares exactamente iguales?',
    p1: 'Detrás de eso hay fábricas que producen en serie, sin cansarse y casi sin equivocarse. Y lo más interesante: muchas funcionan casi solas.',
    p2: '**El HAS-200** te permite ver, en pequeño y de forma segura, cómo funciona una fábrica automática de verdad. Aquí entenderás las ideas básicas antes de tu visita al laboratorio.',
  },

  stepOf: (n, total) => `Paso ${n} de ${total}`,
  pager: {
    label: 'Cambiar de paso',
    prev: 'Anterior',
    next: (n, title) => `Siguiente: ${n} · ${title}`,
    finish: 'Finalizar módulo',
  },

  toc: {
    title: 'En esta guía',
    complete: '¡Módulo completado!',
    steps: [
      'Entra, procesa, sale',
      'Una fábrica en miniatura',
      'Los “sentidos” y las “manos”',
      'El semáforo de la máquina',
      '¿Por qué te debería importar?',
      'Glosario rápido',
    ],
    readSuffix: 'leído',
  },

  s1: {
    title: 'Una fábrica siempre hace lo mismo: entra, procesa, sale',
    kicker: 'Explora los ejemplos',
    body: 'Imagina una fábrica de arepas. Alguien pone la masa **(eso entra)**, la máquina la amasa, le da forma y la cocina **(eso es el proceso)**, y al final sale una arepa lista para comer **(eso sale)**. Todo sistema productivo funciona con esta misma lógica de 3 pasos:',
    exLabel: 'Elige un ejemplo',
    hint: 'Toca cada bloque para ver qué significa.',
    examplesNames: { arepas: 'Arepas', ropa: 'Camisetas', has: 'HAS-200' },
    examples: {
      arepas: ['Masa de maíz', 'Se amasa, se moldea y se cocina', 'Arepa lista para comer'],
      ropa: ['Tela e hilo', 'Se corta y se cose', 'Camiseta terminada'],
      has: ['Piezas sueltas', 'Se transportan, seleccionan y ensamblan', 'Pieza entregada al final'],
    },
    defs: {
      in: { name: 'Entrada', text: 'La materia prima: lo que aún no está transformado (harina, tela, plástico, piezas sueltas…).' },
      pr: { name: 'Proceso', text: 'Lo que la máquina o las personas le hacen al material para cambiarlo.' },
      out: { name: 'Salida', text: 'El producto final, ya listo para usarse o venderse.' },
    },
    note: '**Y en el HAS-200…** funciona exactamente así, solo que en vez de arepas, mueve y transforma pequeñas piezas de un lugar a otro dentro del sistema, simulando una fábrica real.',
  },

  s2: {
    title: 'El HAS-200: una fábrica en miniatura',
    kicker: 'Sigue la pieza',
    body1: 'El HAS-200 no es una sola máquina, sino un conjunto de “estaciones” conectadas entre sí, cada una con una tarea específica. El material pasa de una a la siguiente, como en una carrera de relevos.',
    body2: 'Cada estación cumple un rol: una recibe el material, otra lo transporta, otra lo clasifica o ensambla, y otra lo entrega terminado.',
    stationWord: 'Estación',
    stations: [
      { name: 'Entrada de material', text: 'Recibe las piezas que van a ser procesadas.' },
      { name: 'Transporte (banda)', text: 'Mueve el material de una estación a la siguiente.' },
      { name: 'Selección / Ensamble', text: 'Clasifica o une las piezas según su tarea.' },
      { name: 'Salida de producto', text: 'Entrega el producto ya terminado.' },
    ],
    beltLabel: 'Banda transportadora: el material se mueve de estación en estación',
    play: 'Ver el recorrido de una pieza',
    playing: 'Recorriendo…',
    note: 'Durante tu visita, tu equipo recorrerá el HAS-200 e identificará estas estaciones con sus propios ojos.',
  },

  s3: {
    title: 'Los “sentidos” y las “manos” del sistema',
    kicker: 'Mini reto: ¿sensor o actuador?',
    body: 'Para que una máquina funcione “sola” necesita darse cuenta de lo que pasa y actuar en consecuencia. De eso se encargan los sensores y los actuadores.',
    sensor: { title: 'Sensor (los “ojos”)', text: 'Detecta luz, presencia o posición. Es información que **entra** al sistema.' },
    actuator: { title: 'Actuador (las “manos”)', text: 'Empuja, mueve o sujeta piezas. Es una acción que **sale** del sistema.' },
    note: '**Piénsalo así:** cuando el grifo de un baño público abre solo, un sensor detecta tu mano (los “ojos”) y un actuador abre la válvula (las “manos”). El HAS-200 usa esta idea para funcionar sin mover cada pieza a mano.',
    quiz: {
      progress: (n, total) => `Pregunta ${n} de ${total}`,
      sensor: 'Sensor',
      actuator: 'Actuador',
      right: '¡Correcto!',
      wrong: (answer) => `Casi. Era ${answer}.`,
      next: 'Siguiente pregunta',
      seeResult: 'Ver resultado',
      result: (score, total) => `¡Terminaste! Acertaste ${score} de ${total}.`,
      retry: 'Intentar de nuevo',
      questions: [
        { q: 'Detecta que llegó una pieza', a: 's', why: 'Detectar es avisarle algo al sistema: tarea de un sensor.' },
        { q: 'Empuja la pieza hacia la banda', a: 'a', why: 'Empujar es una acción física: la hace un actuador.' },
        { q: 'Mide la posición de un cilindro', a: 's', why: 'Medir una posición es información que entra al sistema.' },
        { q: 'Sujeta una pieza', a: 'a', why: 'Sujetar es actuar sobre la pieza: lo hace un actuador.' },
        { q: 'Detecta la presencia de luz', a: 's', why: 'Percibir luz es información: lo hace un sensor.' },
        { q: 'Gira un motor', a: 'a', why: 'Girar es una acción que sale del sistema: actuador.' },
      ],
    },
  },

  s4: {
    title: 'El semáforo de la máquina: la baliza y la botonera',
    kicker: 'Controla la baliza',
    body1: 'Toda máquina automática necesita comunicarle a las personas qué está pasando, sobre todo cuando algo puede ser peligroso. Para eso existe la **baliza**: una especie de semáforo que usa colores para avisar el estado del sistema.',
    body2: 'Además, el HAS-200 tiene una **botonera** para iniciar, detener o resetear el sistema, incluido un botón de **paro de emergencia** que detiene todo de inmediato ante cualquier riesgo.',
    note: 'Simulación educativa. En la práctica aprenderás a identificar estos botones siempre bajo la supervisión del gestor de conocimiento.',
    beaconLabel: 'Baliza',
    panelLabel: 'Botonera',
    lamps: { r: 'Luz roja', y: 'Luz amarilla', g: 'Luz verde' },
    buttons: { start: 'Iniciar', stop: 'Detener', reset: 'Reset', emg: 'PARO DE EMERGENCIA' },
    latched: 'Paro de emergencia activo: pulsa Reset para volver a empezar.',
    messages: {
      idle: 'Prueba los botones o toca una luz.',
      lampG: 'Verde: todo funciona con normalidad.',
      lampY: 'Amarillo: hay que poner atención, algo requiere revisión.',
      lampR: 'Rojo: el sistema se detuvo o hay una emergencia.',
      start: 'Iniciar: el sistema arranca y la baliza queda en verde.',
      stop: 'Detener: el sistema se detiene y la baliza pasa a rojo.',
      reset: 'Reset: el sistema vuelve a su estado inicial (baliza apagada).',
      emg: '¡PARO DE EMERGENCIA! Detiene todo de inmediato ante cualquier riesgo.',
    },
  },

  s5: {
    title: '¿Por qué te debería importar esto?',
    kicker: 'Descubre tu industria',
    body: 'Entender cómo funciona el HAS-200 es entender, a pequeña escala, cómo funciona buena parte de la industria actual: fábricas de alimentos, de ropa, de carros, de medicamentos… casi todo lo que usas a diario pasó por un sistema parecido a este.',
    note: 'Esto es apenas la puerta de entrada a carreras como ingeniería industrial, mecatrónica, automatización y tecnología: profesiones que diseñan, mejoran y cuidan estos sistemas.',
    industryLabel: 'Elige una industria',
    industries: {
      food: { label: 'Alimentos', in: 'Harina, agua', out: 'Pan empacado' },
      clothes: { label: 'Ropa', in: 'Tela, botones', out: 'Pantalón' },
      cars: { label: 'Carros', in: 'Piezas metálicas', out: 'Carro ensamblado' },
      meds: { label: 'Medicamentos', in: 'Ingredientes', out: 'Pastilla empacada' },
    },
    stage: { in: 'Entrada', pr: 'Proceso', out: 'Salida', transforms: 'Se transforma' },
    fact: {
      show: '¿Sabías qué…?',
      hide: 'Ocultar',
      text: 'La producción en serie se popularizó a inicios del siglo XX con la fabricación de automóviles y redujo tanto los tiempos que un proceso de casi un día pasó a tomar un par de horas. ¡Así de poderosa es la automatización!',
      before: 'Antes: casi un día',
      after: 'Con línea en serie: un par de horas',
      chart: 'Comparación ilustrativa de tiempos, no a escala exacta',
    },
  },

  s6: {
    title: 'Glosario rápido',
    kicker: 'Voltea las tarjetas',
    body: 'Estos son los seis términos clave de la guía.',
    note: '**Antes de tu visita al laboratorio:** ya conoces las ideas clave. Allí las verás en acción y las registrarás en tu Instrumento de Trabajo. ¡Lleva tu curiosidad!',
    flipAll: 'Voltear todas',
    hideAll: 'Volver a ocultar',
    cardAria: (term, flipped) => (flipped ? `${term}: toca para ocultar el significado` : `${term}: toca para ver el significado`),
    terms: [
      { term: 'Sistema productivo', def: 'Conjunto organizado de personas, máquinas y pasos que transforman materiales en un producto.' },
      { term: 'Estación', def: 'Cada “puesto de trabajo” dentro del sistema, con una tarea específica.' },
      { term: 'Sensor', def: 'Elemento que detecta algo (luz, presencia, posición) y le avisa al sistema.' },
      { term: 'Actuador', def: 'Elemento que ejecuta una acción física: mover, empujar, sujetar, girar.' },
      { term: 'Automatización', def: 'Hacer que una máquina realice tareas por sí sola, sin control paso a paso.' },
      { term: 'Baliza', def: 'Luz tipo semáforo que indica el estado del sistema (verde, amarillo, rojo).' },
    ],
  },

  finish: {
    title: '¡Terminaste el Módulo 1!',
    text: 'Ya conoces las ideas clave: sistema productivo, estaciones, sensores, actuadores y la baliza de seguridad. ¡Nos vemos en el laboratorio!',
    listTitle: 'Ideas clave que ya conoces',
    items: ['Sistema productivo', 'Estaciones', 'Sensores', 'Actuadores', 'Baliza de seguridad'],
    review: 'Repasar el módulo',
    home: 'Volver al Inicio',
    next: 'Módulo 2',
  },

  m2,
}
