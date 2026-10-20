// Textos de la página de Juegos en español. Misma estructura que juegos.en.js.
// Las claves de `games` son los `id` de src/config/juegos.js.
export default {
  crumbs: { label: 'Ruta de navegación', home: 'Inicio', current: 'Juegos' },
  hero: {
    badge: 'Aprende jugando',
    title: 'Juegos educativos',
    text: 'Repasa los conceptos del HAS-200 con sopas de letras, crucigramas y más. Todo se juega aquí mismo, sin salir de la plataforma.',
    chips: ['4 juegos', 'Módulos 1 y 2', 'Sin salir de la página'],
  },
  picker: { label: 'Juegos disponibles' },
  module: (n) => `Módulo ${n}`,
  panelBadge: 'Juego seleccionado',
  tips: {
    title: 'Antes de jugar',
    list: [
      'Puedes repetir cada juego las veces que quieras.',
      'Los juegos son de repaso: no cuentan para los exámenes.',
      'Haz primero la guía del módulo para jugar con más ventaja.',
      'Usa «Pantalla completa» si estás en el celular.',
    ],
  },
  stage: {
    reset: 'Reiniciar',
    full: 'Pantalla completa',
    loading: 'Cargando el juego…',
    frameTitle: (name) => `Juego: ${name}`,
    missingTitle: 'Juego por configurar',
    missingText: 'Este juego aún no tiene su enlace de Educaplay. Pronto estará disponible.',
  },
  side: {
    how: '¿Cómo se juega?',
    tipTitle: 'Consejo',
    tipText: 'Si un término no te suena, vuelve a la guía del módulo y regresa a jugar.',
  },
  games: {
    sopa: {
      title: 'Sopa de letras',
      text: 'Encuentra los términos técnicos escondidos en la cuadrícula.',
      heading: 'Encuentra los términos del HAS-200',
      steps: ['Busca en horizontal, vertical y diagonal.', 'Selecciona la primera y la última letra de cada palabra.', 'Encuentra todas en el menor tiempo posible.'],
    },
    cruci: {
      title: 'Crucigrama',
      text: 'Completa las casillas leyendo cada pista sobre el sistema.',
      heading: 'Completa el crucigrama de señales y redes',
      steps: ['Toca una casilla para ver su pista.', 'Escribe la respuesta con el teclado.', 'Las palabras se cruzan: úsalas como ayuda.'],
    },
    ordenar: {
      title: 'Ordenar palabras',
      text: 'Pon las letras en el orden correcto para formar la palabra.',
      heading: 'Ordena las letras para formar la palabra correcta',
      steps: ['Lee las letra que aparecen desorganizadas.', 'Tócalas o arrástralas para ponerlas en orden.', 'Comprueba tu palabra al terminar.'],
    },
    memoria: {
      title: 'Memorizar',
      text: 'Voltea las tarjetas y encuentra las parejas de cada concepto.',
      heading: 'Encuentra las parejas del HAS-200',
      steps: ['Toca una tarjeta para voltearla.', 'Busca la tarjeta que forma pareja con ella.', 'Si no coinciden, se voltean de nuevo: ¡memorízalas!'],
    },
  },
}
