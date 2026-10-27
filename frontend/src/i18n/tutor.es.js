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

  audios: {
    title: 'Escucha las guías',
    lead: 'Dos audios cortos para repasar el contenido de las guías mientras te desplazas o descansas la vista.',
    langNote: '',
    fallback: 'Este audio solo está disponible en español.',
    transcriptLang: 'es',
    play: 'Reproducir',
    pause: 'Pausar',
    seek: 'Posición del audio',
    transcript: 'Ver transcripción',
    duration: (m) => `≈ ${m} min`,
    unavailable: 'No pudimos cargar este audio. Revisa tu conexión e inténtalo de nuevo.',
    items: [
      {
        title: 'Guía 1 · ¿Qué es el HAS-200?',
        text: 'Entra, procesa, sale; estaciones, sensores y baliza',
        transcript: [
          'Bienvenido a la Guía 1 del HAS-200. ¿Alguna vez te has preguntado cómo es posible que existan miles de gaseosas o zapatillas exactamente iguales? Detrás hay fábricas que producen en serie, y muchas funcionan casi solas.',
          'Toda fábrica hace lo mismo: entra, procesa, sale. Piensa en una fábrica de arepas: alguien pone la masa, eso es la entrada; la máquina la amasa, la moldea y la cocina, eso es el proceso; y al final sale una arepa lista para comer, eso es la salida. El HAS-200 funciona igual, pero con pequeñas piezas.',
          'No es una sola máquina, sino un conjunto de estaciones conectadas entre sí. Una recibe las piezas, una banda las transporta, otra las selecciona o ensambla, y la última entrega el producto terminado, como en una carrera de relevos.',
          'Para funcionar casi solo, el sistema usa sensores y actuadores. El sensor son los ojos: detecta luz, presencia o posición. El actuador son las manos: empuja, mueve o sujeta piezas. Y para avisarle a las personas qué está pasando existe la baliza, una especie de semáforo: verde, todo funciona con normalidad; amarillo, hay que poner atención; rojo, el sistema se detuvo o hay una emergencia. Además, hay una botonera con un paro de emergencia que detiene todo de inmediato.',
          'Entender esto es entender, a pequeña escala, buena parte de la industria actual. Ahora practica con los retos de la guía y prepárate para tu visita al laboratorio.',
        ],
      },
      {
        title: 'Guía 2 · ¿Cómo piensa y se comunica el HAS-200?',
        text: 'Del sensor a la pantalla: señales, PLC, red y SCADA',
        transcript: [
          'Bienvenido a la Guía 2. Cuando una pieza pasa frente a un sensor, ¿quién decide qué hacer y cómo se entera la persona que mira la pantalla? Hoy seguirás el camino de una señal.',
          'Todo empieza en el sensor, que detecta la pieza y genera una señal. Esa señal puede ser digital, con solo dos estados, cero o uno, como un pulsador presionado o suelto; o analógica, que puede tomar muchos valores intermedios, como una temperatura o el nivel de un tanque. Una regla rápida: si solo hay sí o no, es digital; si importa cuánto, es analógica.',
          'La señal llega al PLC, el cerebro del HAS-200. Es un computador industrial, resistente y confiable, que repite sin parar tres pasos: lee las entradas, ejecuta su programa y actualiza las salidas, como los motores y las luces. Es como un chef que lee la comanda, sigue la receta y le avisa a la cocina.',
          'Después, los datos viajan por una red de datos: un cable los lleva hasta un switch, que los reparte entre los equipos conectados, hasta llegar al computador.',
          'Allí, el programa de supervisión, llamado SCADA, muestra en pantalla el estado de la fábrica. Así, del sensor a la pantalla, la información completa su viaje. Ahora arma el recorrido en la guía y pon a prueba lo que aprendiste.',
        ],
      },
    ],
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
