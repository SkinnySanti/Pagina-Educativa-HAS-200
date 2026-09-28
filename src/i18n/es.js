// Textos en español. Reemplaza los placeholders por el contenido real del HAS-200.
// La estructura de cada sección debe ser idéntica en es.js y en.js.

const section = (letter) => ({
  short: `Sección ${letter}`,
  title: `Sección ${letter}: título pendiente`,
  summary: 'Resumen de una o dos líneas de esta parte del sistema.',
  components: [1, 2, 3, 4].map((n) => ({
    name: `Componente ${n}`,
    desc: 'Qué es y qué hace, en una frase.',
  })),
  mechanism: [
    { term: 'Qué hace', text: 'Su función dentro del sistema.' },
    { term: 'Cómo lo hace', text: 'El principio de funcionamiento, paso a paso y sin jerga.' },
    { term: 'Con qué se conecta', text: 'Qué recibe de otras partes y qué les entrega.' },
  ],
  steps: [
    { title: 'Entrada', text: 'Qué recibe esta parte.' },
    { title: 'Proceso', text: 'Qué ocurre adentro.' },
    { title: 'Salida', text: 'Qué entrega al resto del sistema.' },
  ],
})

export default {
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
    text: 'Recorre el sistema completo, parte por parte: qué lo compone, cómo funciona cada mecanismo y cómo se integra todo.',
    cta: 'Empezar el recorrido',
    modelLabel: 'Modelo 3D del sistema completo',
  },
  subnav: {
    label: 'Secciones de la página',
    integration: 'Cómo se integran',
    glossary: 'Glosario y preguntas',
  },
  tabs: {
    detail: 'Detalle de la sección',
    components: 'Componentes',
    mechanism: 'Mecanismo',
    operation: 'Funcionamiento',
    carousel: 'Carrusel de componentes',
    prev: 'Anterior',
    next: 'Siguiente',
  },
  placeholders: {
    image: 'Imagen pendiente',
    model: 'Modelo 3D pendiente',
    componentImage: 'Foto o render del componente',
    mechanismImage: 'Esquema del mecanismo',
    sectionModel: 'Vista 3D de esta parte',
  },
  sections: { a: section('A'), b: section('B'), c: section('C') },
  integration: {
    title: 'Cómo se integran las tres partes',
    text: 'Una vista de todo el sistema: qué recibe y qué entrega cada parte.',
    signal: 'señal',
    caption: 'Reemplaza este esquema por el diagrama real: flujo de datos, energía o señales entre las partes.',
    alt: 'Diagrama de integración: la sección A envía una señal a la sección B, y la B a la C.',
  },
  faq: {
    title: 'Glosario y preguntas frecuentes',
    items: [
      { q: 'Término 1', a: 'Definición corta y clara, en lenguaje del estudiante.' },
      { q: 'Término 2', a: 'Definición corta y clara, en lenguaje del estudiante.' },
      { q: '¿Por dónde empiezo?', a: 'Recorre las secciones A, B y C en orden. Pronto podrás practicar con guías y exámenes.' },
    ],
  },
}
