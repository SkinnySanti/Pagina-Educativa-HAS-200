// Textos de la página de Exámenes en español. Misma estructura que examenes.en.js.
export default {
  crumbs: { label: 'Ruta de navegación', home: 'Inicio', current: 'Exámenes' },
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
  state: { available: 'Disponible', locked: 'Bloqueado', login: 'Requiere sesión' },
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
      'Si tu sesión se interrumpe, vuelve a entrar y retoma tu intento; tus respuestas marcadas no se pierden.',
    ],
  },
  modules: [
    { tag: 'Módulo 1', guide: 'Guía informativa', text: 'Componentes y funcionamiento del HAS-200.' },
    { tag: 'Módulo 2', guide: 'Guía informativa', text: 'Comunicación, señales y procesamiento de datos.' },
  ],
  card: {
    title: (n) => `Examen del Módulo ${n}`,
    meta: { questions: '10 preguntas · 2 en inglés', time: 'Hasta 60 min', score: 'Puntaje al terminar' },
    start: 'Comenzar examen',
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
    },
  },
  side: {
    progress: { title: 'Tu ruta de exámenes', done: 'completados', groups: ['Diagnóstico', 'Post recorrido'] },
    why: {
      title: '¿Por qué iniciar sesión?',
      items: ['Guarda tu avance en las guías.', 'Presenta las evaluaciones del laboratorio.', 'Consulta tu retroalimentación.'],
    },
  },
  dialog: {
    title: 'Antes de comenzar',
    text: (name) =>
      `${name}. Tiene 10 preguntas (2 en inglés) y dura hasta 60 minutos; el tiempo corre en el servidor. Si tu sesión se interrumpe, inicia sesión de nuevo y reanuda tu intento.`,
    cancel: 'Cancelar',
    confirm: 'Comenzar',
  },
  startSoon: 'La presentación del examen estará disponible muy pronto.',
}
