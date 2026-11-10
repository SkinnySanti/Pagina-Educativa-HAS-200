// Estructura de la página MEDIT (/medit). Los textos viven en src/i18n/medit.es.js y medit.en.js,
// con la misma clave `id`. Aquí solo van los datos que no se traducen: íconos, rutas y enlaces.

// Los 4 ejes estructurales del MEDIT (se muestran en «¿Qué es el MEDIT?»).
export const EJES = ['etica', 'aprendizaje', 'tecnologia', 'conocimiento']

// Cómo se integró el MEDIT: un eje del modelo → una parte concreta de la plataforma.
//   to: ruta interna a la que lleva el botón de la tarjeta.
export const INTEGRACION = [
  { id: 'etica', icon: 'lock', to: '/juegos' },
  { id: 'aprendizaje', icon: 'book', to: '/guias' },
  { id: 'tecnologia', icon: 'robot', to: '/tutor' },
  { id: 'conocimiento', icon: 'cpu', to: '/examenes' },
]

// ► Campo de aprendizaje en la plataforma (planeación → interacción → datos → retroalimentación).
export const CAMPO = [
  { id: 'planeacion', icon: 'flag', to: '/guias' },
  { id: 'interaccion', icon: 'robot', to: '/tutor' },
  { id: 'datos', icon: 'clipboard', to: '/examenes' },
  { id: 'retro', icon: 'chat', to: '/retroalimentacion' },
]

// ► Documentos oficiales de la Universidad (se abren en pestaña nueva).
//   Para agregar uno: una fila aquí y su texto en `recursos.docs` de los archivos i18n, con la misma clave `id`.
export const RECURSOS = [
  { id: 'libro', url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2023/LIBRO-MEDIT%20.pdf' },
  {
    id: 'cap3',
    url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2024/CAP-3-LA-CIENCIA-TECNOLOGIA-INVESTIGACION-E-INNOVACION-EN-EL-MODELO-EDUCATIVO-DIGITAL-TRANSMODERN-MEDIT.pdf',
  },
  { id: 'cap4', url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2024/CAP-4-LOS-PRINCIPIOS-Y-VALORES-DEL-MEDIT.pdf' },
]
