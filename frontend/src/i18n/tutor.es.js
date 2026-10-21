// Textos del Tutor virtual (español). Misma estructura que tutor.en.js.
// **doble asterisco** = negrita (lo interpreta components/common/RichText.vue).

export default {
  crumbs: { label: 'Ruta de navegación', home: 'Inicio', current: 'Tutor virtual' },

  hero: {
    badge: 'Tutor virtual',
    title: 'Pregúntale al tutor del HAS-200',
    text: 'Resuelve tus dudas sobre el HAS-200 y las guías, a tu ritmo y cuando lo necesites.',
    chips: ['Respuestas cortas y claras', 'Conoce las guías 1 y 2', 'Antes de tu visita al laboratorio'],
  },

  chat: {
    title: 'Chat con el tutor',
    logLabel: 'Conversación con el tutor virtual',
    welcome: '¡Hola! Soy el tutor virtual del HAS-200. Puedo explicarte sensores, actuadores, el PLC, la red de datos, el SCADA o cualquier tema de las guías. ¿Qué quieres saber?',
    you: 'Tú',
    tutor: 'Tutor',
    suggestionsTitle: 'Prueba preguntando:',
    suggestions: [
      '¿Qué es el HAS-200?',
      '¿Cuál es la diferencia entre sensor y actuador?',
      '¿Qué hace un PLC?',
      '¿Qué significan los colores de la baliza?',
    ],
    placeholder: 'Escribe tu pregunta…',
    inputLabel: 'Tu pregunta para el tutor',
    send: 'Enviar',
    thinking: 'El tutor está escribiendo…',
    clear: 'Nueva conversación',
    counter: (n, max) => `${n} / ${max}`,
    remaining: (n) => (n === 1 ? 'Te queda 1 pregunta hoy.' : `Te quedan ${n} preguntas hoy.`),
    aiNotice: 'El tutor es una inteligencia artificial y puede equivocarse: confirma con las guías o con el gestor de conocimiento.',
  },

  errors: {
    dayLimit: 'Llegaste al límite de preguntas de hoy. ¡Vuelve mañana!',
    slowDown: 'Vas muy rápido. Espera un momento y vuelve a preguntar.',
    busy: 'El tutor está muy solicitado ahora mismo. Inténtalo de nuevo en un minuto.',
    unavailable: 'El tutor no está disponible por ahora. Inténtalo más tarde.',
    network: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    session: 'Tu sesión terminó. Inicia sesión de nuevo para hablar con el tutor.',
    invalid: 'No pudimos enviar tu pregunta. Revisa que no esté vacía ni sea demasiado larga.',
    generic: 'Algo salió mal. Inténtalo de nuevo en un momento.',
  },

  side: {
    howTitle: 'Cómo sacarle el mejor provecho',
    how: [
      'Haz preguntas concretas, por ejemplo: “¿Qué hace el PLC?”.',
      'Pídele un ejemplo de la vida diaria si algo no te queda claro.',
      'Cuéntale con tus palabras lo que entendiste y pídele que lo revise.',
    ],
    privacyTitle: 'Antes de escribir',
    privacyText: 'No escribas datos personales (nombre completo, teléfono, dirección). Tus preguntas se procesan con un servicio externo de inteligencia artificial para generar la respuesta, y la plataforma no guarda la conversación.',
    examTitle: 'Sobre los exámenes',
    examText: 'El tutor te ayuda a entender los temas, pero no resuelve las preguntas de los exámenes por ti.',
  },
}
