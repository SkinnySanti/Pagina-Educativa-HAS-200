// Textos en español.

import guias from './guias.es.js'

export default {
  guias,
  brand: 'HAS 200 Learning',
  skip: 'Saltar al contenido',
  nav: {
    label: 'Navegación principal',
    inicio: 'Inicio',
    guias: 'Guías',
    examenes: 'Exámenes',
    feedback: 'Retroalimentación',
    soon: 'Pronto',
    soonTitle: 'Disponible pronto',
  },
  topbar: {
    toggleMenu: 'Mostrar u ocultar el menú',
    language: 'Idioma',
  },
  hero: {
    title: 'Conoce el HAS-200',
    text: 'Tu punto de partida antes del laboratorio: sigue tu ruta de aprendizaje, paso a paso.',
    cta: 'Ver mi ruta de aprendizaje',
  },
  welcome: {
    badge: 'Inducción oficial del laboratorio',
    title: '¡Te damos la bienvenida a HAS 200 Learning!',
    text: 'Este espacio es tu inducción oficial antes de entrar al laboratorio: aquí aprendes a tu ritmo cómo funciona el HAS-200. Explora con calma, vuelve las veces que quieras y, cuando te sientas listo, pon a prueba lo aprendido.',
  },
  overview: {
    title: '¿Qué es esta página y para qué sirve?',
    text: 'HAS 200 Learning es tu plataforma de preparación: conoces el sistema HAS-200, practicas con guías y compruebas lo aprendido antes de tu visita al laboratorio, como un sistema integrado y no solo por partes sueltas.',
    goalsTitle: 'Al terminar podrás:',
    goals: [
      'Identificar los componentes principales del sistema.',
      'Explicar el mecanismo de cada parte independiente.',
      'Describir cómo funcionan e interactúan los subsistemas.',
    ],
  },
  path: {
    title: 'Tu ruta de aprendizaje',
    text: 'Tu mapa de navegación: cada tarjeta te lleva a un módulo. Sigue el orden para aprovecharlo mejor.',
    progress: (n, total) => `${n} de ${total} pasos`,
    continue: 'Continuar',
    review: 'Repasar',
    diagnostic: {
      badge: 'Paso 1 · Empieza aquí',
      title: 'Evaluación diagnóstica',
      text: 'Antes de las guías, responde una evaluación breve para conocer tu punto de partida.',
      cta: 'Comenzar evaluación',
    },
    modules: [
      {
        title: 'Guías informativas',
        bullets: ['Conoce los componentes y mecanismos del HAS-200.', 'Ejemplos cotidianos y datos curiosos.'],
        cta: 'Entrar al módulo',
      },
      {
        title: 'Guías con ejercicios',
        bullets: ['Practica lo aprendido con actividades guiadas.', 'A tu propio ritmo, paso a paso.'],
        cta: 'Entrar al módulo',
      },
      {
        title: 'Dos exámenes finales',
        bullets: ['Evalúa tu dominio del HAS-200.', 'Obtén tu puntaje al terminar cada uno.'],
        cta: 'Entrar al módulo',
      },
    ],
  },
  pyramid: {
    title: '¿Dónde encaja el HAS-200?',
    text: 'La automatización industrial se organiza en niveles, del piso de planta a la gestión del negocio. Estos módulos cubren los dos primeros: Campo y Control, justo donde vive el HAS-200.',
    ariaLabel: 'Pirámide de automatización de 5 niveles. De abajo hacia arriba: Campo, Control, SCADA, MES y ERP. Este curso cubre Campo y Control.',
    inScope: 'Lo verás aquí',
    outScope: 'Fuera de este curso',
    hint: '**Toca o pasa el cursor sobre cada nivel para conocerlo.**',
    caption: 'Los niveles III a V (SCADA, MES, ERP) quedan fuera del alcance de este curso.',
    levels: {
      field: { label: 'I · Campo', inScope: true, desc: 'Donde todo empieza: sensores que miden y actuadores que mueven o accionan algo.' },
      control: { label: 'II · Control', inScope: true, desc: 'El "cerebro" que decide qué hacer con esas señales: un PLC, un PC industrial o controladores PID.' },
      scada: { label: 'III · SCADA', inScope: false, desc: 'Pantallas de supervisión: muestran en tiempo real qué está pasando en la planta.' },
      mes: { label: 'IV · MES', inScope: false, desc: 'Gestiona la producción día a día: qué se fabricó, cuánto y con qué calidad.' },
      erp: { label: 'V · ERP', inScope: false, desc: 'El sistema de toda la empresa: inventario, compras, finanzas y más.' },
    },
  },
  bilingual: {
    title: '¿Por qué importa el inglés aquí?',
    text: 'Buena parte de los términos técnicos del HAS-200 vienen del inglés: por ejemplo, el "cerebro" de la máquina se llama PLC. Los conocerás a fondo, en los dos idiomas, en las guías.',
  },
  aiTutor: {
    title: 'Un tutor de IA a tu disposición',
    text: 'En el módulo Tutor de IA podrás resolver dudas sobre el HAS-200 y las guías cuando lo necesites, a tu propio ritmo, como si tuvieras un compañero de estudio disponible todo el tiempo.',
    badge: 'Próximamente en tu menú',
  },
}
