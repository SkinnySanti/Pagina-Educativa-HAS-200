// Textos de la página de Exámenes en español. Misma estructura que examenes.en.js.
export default {
  crumbs: { label: 'Ruta de navegación', home: 'Inicio', current: 'Exámenes' },
  badge: 'Evaluación del aprendizaje',
  hero: {
    badge: 'Módulo de exámenes',
    title: 'Pon a prueba lo aprendido',
    text: 'Dos tipos de examen, uno por cada módulo. Cada examen tiene 10 preguntas, 2 de ellas en inglés.',
    chips: ['2 tipos de examen', '10 preguntas por examen', '2 preguntas en inglés', 'Hasta 60 minutos'],
  },
  notice: {
    title: 'Inicia sesión para presentar los exámenes',
    text: 'Puedes ver cómo funcionan, pero necesitas una cuenta para presentarlos y guardar tu puntaje.',
    cta: 'Iniciar sesión',
  },
  picker: {
    label: 'Tipo de examen',
    options: [
      { title: 'Evaluación diagnóstica', text: 'Conoce tu punto de partida antes de las guías.' },
      { title: 'Examen post recorrido', text: 'Comprueba lo aprendido al terminar tu recorrido.' },
    ],
  },
  state: { available: 'Disponible', locked: 'Bloqueado', login: 'Requiere sesión', used: 'Presentado', loading: 'Cargando…' },
  panels: [
    { title: 'Evaluación diagnóstica', text: 'Antes de las guías, responde un examen por módulo. Sirve para conocer tu punto de partida.' },
    {
      title: 'Examen post recorrido de aprendizaje',
      text: 'Son los mismos dos exámenes del diagnóstico, uno por módulo. Preséntalos al terminar las guías para ver cuánto avanzaste.',
    },
  ],
  before: {
    title: 'Antes de empezar',
    items: [
      'Cada examen dura hasta 60 minutos.',
      'Busca un entorno tranquilo y sin distracciones.',
      'Te encontrarás con 10 preguntas y 2 están en inglés.',
      'Si tu sesión se interrumpe, vuelve a entrar y retoma tu intento; tus respuestas marcadas se conservan en este navegador.',
    ],
  },
  modules: [
    { tag: 'Módulo 1', guide: 'Guía informativa', text: 'Componentes y funcionamiento del HAS-200.' },
    { tag: 'Módulo 2', guide: 'Guía informativa', text: 'Comunicación, señales y procesamiento de datos.' },
  ],
  card: {
    title: (n) => `Examen del Módulo ${n}`,
    // Datos que vienen del servidor (totalPreguntas, preguntasEnIngles, tiempoLimiteMinutos): no se hardcodean.
    meta: {
      questions: (n, en) => `${n} preguntas · ${en} en inglés`,
      time: (min) => (min ? `${min} min` : 'Hasta 60 min'),
      score: 'Puntaje al terminar',
    },
    start: 'Comenzar examen',
    resume: 'Reanudar examen',
    starting: 'Iniciando…',
    loading: 'Cargando…',
    review: 'Ver revisión',
    lastReview: 'Ver última revisión',
    used: 'Ya presentaste esta evaluación diagnóstica: solo tiene un intento. Puedes ver tu revisión.',
    usedNoReview: 'Ya presentaste esta evaluación diagnóstica: solo tiene un intento. La revisión de ese intento no está disponible en este navegador.',
    inProgress: 'Tienes un intento en curso. Reanúdalo antes de que se acabe el tiempo.',
    locked: 'Bloqueado',
    steps: (n, total) => `${n} de ${total} pasos`,
    lock: {
      login: 'Inicia sesión para presentar este examen.',
      loginGuide: [
        'Inicia sesión y termina los 6 pasos de la guía del Módulo 1 para desbloquearlo.',
        'Inicia sesión y termina los 6 pasos de la guía del Módulo 2 para desbloquearlo.',
      ],
      guide: [
        'Termina los 6 pasos de la guía del Módulo 1 para desbloquearlo.',
        'Termina los 6 pasos de la guía del Módulo 2 para desbloquearlo.',
      ],
      // Temporal: se quita cuando el avance de las guías se guarde en el servidor (PUT /api/me/progress).
      pendingSync: 'Ya terminaste esta guía, pero el servidor aún no registra tu avance. Se desbloqueará cuando tu progreso se guarde en tu cuenta.',
    },
  },
  side: {
    progress: { title: 'Tu ruta de exámenes', done: 'completados', groups: ['Diagnóstico', 'Post recorrido'] },
    why: {
      title: '¿Por qué iniciar sesión?',
      items: ['Guarda tu avance en las guías.', 'Presenta las evaluaciones del laboratorio.', 'Habla con el Tutor Virtual si tienes dudas.' ,
              'Accede a tus resultados y retroalimentaciones.'],
    },
  },
  dialog: {
    title: 'Antes de comenzar',
    text: (name, min) =>
      `${name}. Tiene 10 preguntas (2 en inglés) y dura ${min ? `${min} minutos` : 'hasta 60 minutos'}; el tiempo corre en el servidor. Si tu sesión se interrumpe, inicia sesión de nuevo y reanuda tu intento.`,
    single: 'Es una evaluación diagnóstica: solo puedes enviarla una vez. Si sales sin enviarla, el tiempo sigue corriendo.',
    cancel: 'Cancelar',
    confirm: 'Comenzar',
  },
  // Recuadro del examen en curso
  take: {
    clockLabel: 'Tiempo restante',
    navLabel: 'Preguntas del examen',
    counter: (n, total) => `Pregunta ${n} de ${total}`,
    answered: (n, total) => `${n} de ${total} respondidas`,
    questionN: (n) => `Pregunta ${n}`,
    pipLabel: (n, done) => `Pregunta ${n}, ${done ? 'respondida' : 'sin responder'}`,
    englishTitle: 'Pregunta en inglés',
    prev: 'Anterior',
    next: 'Siguiente',
    finish: 'Enviar examen',
    sending: 'Enviando…',
    clear: 'Borrar respuesta',
    confirmAll: (n) => `Vas a enviar tus ${n} respuestas. Después no podrás cambiarlas.`,
    confirmMissing: (n) =>
      `${n === 1 ? 'Te falta 1 pregunta' : `Te faltan ${n} preguntas`} sin responder; contarán como incorrectas. Después de enviar no podrás cambiar tus respuestas.`,
    confirmYes: 'Sí, enviar',
    confirmNo: 'Seguir respondiendo',
    minutesLeft: (m) => (m === 1 ? 'Queda 1 minuto.' : `Quedan ${m} minutos.`),
  },
  // Resultado y revisión
  result: {
    hits: (a, total) => `${a} de ${total} respuestas correctas`,
    close: 'Volver a los exámenes',
    loading: 'Cargando tu revisión…',
    reviewTitle: 'Revisión de tus errores',
    perfect: '¡Sin errores! Respondiste todas las preguntas correctamente.',
    yours: 'Tu respuesta',
    correct: 'Respuesta correcta',
    unanswered: 'No respondida',
    retry: 'Reintentar',
    study: (g, s) => `Repasar en Guía ${g} · Paso ${s}`,
    skills: {
      INGLES: 'Inglés',
      FUNCIONAMIENTO: 'Funcionamiento',
      TERMINOS_TECNICOS: 'Términos técnicos',
      PENSAMIENTO_SECUENCIAL: 'Pensamiento secuencial',
    },
    // `concepto` llega como clave estable (16 en total, 8 por módulo). Falta completar las que no aparecen en el
    // contexto del backend: mientras tanto se muestra la clave legible (ej. "Funcion actuador").
    concepts: {
      'funcion-actuador': 'Función del actuador',
    },
  },
  // Errores del backend: se decide por `codigo` (ProblemDetail), nunca por `detail`.
  errors: {
    generic: 'No pudimos completar la acción. Inténtalo de nuevo en un momento.',
    network: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    session: 'Tu sesión venció. Inicia sesión de nuevo; si tenías un examen en curso, podrás reanudarlo.',
    rate: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
    codes: {
      EXAMEN_NO_ENCONTRADO: 'Ese examen ya no está disponible. Actualizamos la lista.',
      GUIA_INCOMPLETA: 'Aún no completas la guía de este módulo. Termina sus 6 pasos para presentar este examen.',
      DIAGNOSTICO_USADO: 'Ya presentaste esta evaluación diagnóstica: solo tiene un intento.',
      INTENTO_NO_ENCONTRADO: 'No encontramos ese intento. Vuelve a la lista de exámenes.',
      INTENTO_VENCIDO: 'El tiempo terminó; este intento no cuenta.',
      INTENTO_NO_ENVIADO: 'La revisión solo está disponible cuando el intento ya fue enviado.',
      PREGUNTA_INVALIDA: 'Hubo un problema con tus respuestas y el envío no se guardó. Inténtalo de nuevo; si persiste, recarga la página.',
      OPCION_INVALIDA: 'Hubo un problema con tus respuestas y el envío no se guardó. Inténtalo de nuevo; si persiste, recarga la página.',
      RESPUESTA_DUPLICADA: 'Hubo un problema con tus respuestas y el envío no se guardó. Inténtalo de nuevo; si persiste, recarga la página.',
    },
    guideLink: 'Ir a la guía',
    retryList: 'Reintentar',
  },
}
