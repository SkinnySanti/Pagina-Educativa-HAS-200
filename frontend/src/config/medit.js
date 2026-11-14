// Estructura de la página MEDIT (/medit). Los textos viven en src/i18n/medit.es.js y medit.en.js,
// con la misma clave `id`. Aquí solo van los datos que no se traducen: íconos, rutas y enlaces.

// ► Sitio oficial de la Universidad: destino del botón «Visita la página oficial de la universidad»
//   (debajo de los 4 ejes, en «¿Qué es el MEDIT?»). Cambia la URL aquí si hace falta; abre en pestaña nueva.
export const UNIVERSIDAD_URL = 'https://www.ucundinamarca.edu.co'

// Los 4 ejes estructurales del MEDIT (se muestran en «¿Qué es el MEDIT?»).
export const EJES = ['etica', 'aprendizaje', 'tecnologia', 'conocimiento']

// ► Cómo se integró el MEDIT: un eje del modelo → una parte concreta de la plataforma.
//   to: ruta interna a la que lleva el botón de la tarjeta.
export const INTEGRACION = [
  { id: 'etica', icon: 'lock', to: '/juegos' },
  { id: 'aprendizaje', icon: 'book', to: '/guias' },
  { id: 'tecnologia', icon: 'robot', to: '/tutor' },
  { id: 'conocimiento', icon: 'cpu', to: '/examenes' },
]

// ► Metodología Campo de Aprendizaje (MCA) de la UdeC: sus 9 fases y el módulo de la plataforma que cada una usa.
//   Los textos de cada fase están en `campo.steps` de los archivos i18n, con la misma clave `id`.
//   to: ruta interna a la que lleva la tarjeta.
export const CAMPO = [
  { id: 'planeacion', icon: 'flag', to: '/guias' },
  { id: 'socializacion', icon: 'clipboard', to: '/examenes' },
  { id: 'interaccion', icon: 'puzzle', to: '/juegos' },
  { id: 'participacion', icon: 'hand', to: '/guias' },
  { id: 'colaborativo', icon: 'robot', to: '/tutor' },
  { id: 'datos', icon: 'inbox', to: '/examenes' },
  { id: 'analisis', icon: 'chart', to: '/retroalimentacion' },
  { id: 'retro', icon: 'refresh', to: '/retroalimentacion' },
  { id: 'logro', icon: 'star', to: '/examenes' },
]

// ► Documentos oficiales de la Universidad (se abren en pestaña nueva).
//   Para agregar uno: una fila aquí y su texto en `recursos.docs` de los archivos i18n, con la misma clave `id`.
export const RECURSOS = [
  { id: 'libro', url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2023/LIBRO-MEDIT%20.pdf' },
  { id: 'metodologia', url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2022/METODOLOGIA_CAMPO_DE_APRENDIZAJE.pdf' },
  {
    id: 'cap3',
    url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2024/CAP-3-LA-CIENCIA-TECNOLOGIA-INVESTIGACION-E-INNOVACION-EN-EL-MODELO-EDUCATIVO-DIGITAL-TRANSMODERN-MEDIT.pdf',
  },
  { id: 'cap4', url: 'https://www.ucundinamarca.edu.co/documents/rectoria/2024/CAP-4-LOS-PRINCIPIOS-Y-VALORES-DEL-MEDIT.pdf' },
]
