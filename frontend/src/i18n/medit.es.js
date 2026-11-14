// Textos de la página MEDIT en español. Misma estructura que medit.en.js.
// Las claves de `ejes`, `integracion.items`, `campo.steps` y `recursos.docs` son los `id` de src/config/medit.js.
//
// BORRADOR: la sección «Cómo se integró» describe lo que hoy hace la plataforma. El equipo debe validarla
// y ajustarla antes de la entrega.
export default {
  crumbs: { label: 'Ruta de navegación', home: 'Inicio', current: 'MEDIT' },
  hero: {
    badge: 'Modelo educativo de la UdeC',
    title: 'El MEDIT en HAS 200 Learning',
    text: 'Aquí encuentras qué es el Modelo Educativo Digital Transmoderno de la Universidad de Cundinamarca y qué partes de esta plataforma responden a él.',
    chips: ['4 ejes', 'Campo de aprendizaje', 'Documentos oficiales'],
  },
  about: {
    title: '¿Qué es el MEDIT?',
    text: 'El Modelo Educativo Digital Transmoderno orienta la vida académica de la Universidad de Cundinamarca. El Consejo Académico lo adoptó con el Acuerdo 017 del 3 de diciembre de 2019 y busca educar para la vida, los valores democráticos, la civilidad y la libertad.',
    ejesTitle: 'Sus cuatro ejes estructurales',
    officialText: 'Para conocer más sobre la Universidad:',
    official: 'Visita la página oficial de la universidad',
  },
  ejes: {
    etica: { title: 'Ética', text: 'Principios y valores que orientan la conducta de toda la comunidad universitaria.' },
    aprendizaje: { title: 'Aprendizaje', text: 'Una persona que se autorregula y busca mejorar de manera constante.' },
    tecnologia: { title: 'Tecnología', text: 'Parte del proceso educativo, y no solo una forma de automatizar tareas.' },
    conocimiento: { title: 'Conocimiento', text: 'Se construye en comunidad y sirve para resolver problemas reales del territorio.' },
  },
  integracion: {
    title: '¿Cómo se integró en el proyecto?',
    text: 'Cada eje del modelo tiene su lugar en la plataforma. Esto es lo que hacemos en cada uno.',
    go: 'Ver módulo',
    items: {
      etica: {
        title: 'Ética: datos mínimos y créditos claros',
        module: 'Juegos',
        bullets: [
          'Solo se guardan el correo, el alias, la contraseña cifrada y los resultados.',
          'El alias evita que uses tu nombre real.',
          'La política de datos que se acepta es la de la Universidad.',
          'Los juegos reconocen a Educaplay como plataforma de origen.',
        ],
      },
      aprendizaje: {
        title: 'Aprendizaje: una ruta propia y progresiva',
        module: 'Guías',
        bullets: [
          'Las guías se dividen en módulos y las haces a tu ritmo.',
          'Puedes reiniciar una guía cuando quieras.',
          'La ruta arranca con una evaluación diagnóstica.',
          'Los exámenes se repiten sin límite, salvo el diagnóstico, que se presenta una sola vez.',
        ],
      },
      tecnologia: {
        title: 'Tecnología: un apoyo para aprender',
        module: 'Tutor virtual',
        bullets: [
          'Un tutor con IA resuelve dudas sobre el HAS-200.',
          'Los juegos permiten repasar sin presión.',
          'Toda la plataforma está en español e inglés.',
        ],
      },
      conocimiento: {
        title: 'Conocimiento: partir de un sistema real',
        module: 'Exámenes',
        bullets: [
          'El contenido se basa en el HAS-200, una mini fábrica automatizada.',
          'Los conceptos se explican con ejemplos de la vida diaria.',
          'Cada respuesta incorrecta indica el módulo donde repasarla.',
        ],
      },
    },
  },
  campo: {
    badge: 'Metodología Campo de Aprendizaje',
    title: 'El campo de aprendizaje en la plataforma',
    text: 'Aquí se explica cómo se aplicó en la plataforma la Metodología Campo de Aprendizaje de la Universidad de Cundinamarca. Cada una de sus 9 fases se apoya en un módulo o una función de HAS 200 Learning.',
    phase: 'Fase',
    steps: {
      planeacion: { title: 'Planeación', module: 'Guías y ruta de aprendizaje', text: 'La ruta de aprendizaje define qué guías y exámenes siguen y en qué orden.' },
      socializacion: { title: 'Socialización previa de contenido', module: 'Evaluación diagnóstica', text: 'Antes de las guías, la página presenta la ruta y la evaluación diagnóstica mide tu punto de partida.' },
      interaccion: { title: 'Interacción tecnológica', module: 'Juegos', text: 'Los juegos interactivos permiten practicar los conceptos del HAS-200 con la tecnología como mediadora.' },
      participacion: { title: 'La participación', module: 'Guías', text: 'Haces las guías a tu ritmo, resuelves retos interactivos y puedes reiniciarlas cuando quieras.' },
      colaborativo: { title: 'Trabajo colaborativo y cocreativo', module: 'Tutor virtual', text: 'El tutor con IA te acompaña a construir conocimiento: te ayuda a adquirir y a resolver lo que vas aprendiendo.' },
      datos: { title: 'Recolección de datos', module: 'Exámenes', text: 'Cada intento guarda tu puntaje y tus respuestas.' },
      analisis: { title: 'Análisis de datos', module: 'Retroalimentación', text: 'Se comparan los resultados del diagnóstico con los del examen final.' },
      retro: { title: 'Retroalimentación, mejora y transformación', module: 'Retroalimentación', text: 'Al terminar un examen ves la respuesta correcta y el módulo donde repasarla, y puedes sacar un reporte en PDF.' },
      logro: { title: 'Logro del aprendizaje', module: 'Exámenes', text: 'Los exámenes finales de cada módulo muestran si alcanzaste lo esperado.' },
    },
  },
  recursos: {
    title: 'Documentos oficiales del MEDIT',
    text: 'Para leer el modelo completo, estos son los documentos que publica la Universidad.',
    open: 'Abrir PDF',
    note: 'Se abren en una pestaña nueva, en el sitio de la Universidad de Cundinamarca.',
    source: 'Universidad de Cundinamarca',
    docs: {
      libro: { title: 'Libro del MEDIT', text: 'El modelo completo: componentes, ejes, principios y valores.' },
      metodologia: { title: 'Metodología Campo de Aprendizaje', text: 'Las 9 fases con las que el MEDIT se aplica en el proceso de formación.' },
      cap3: { title: 'Capítulo 3: ciencia, tecnología, investigación e innovación', text: 'Cómo entiende el modelo la tecnología y el campo de aprendizaje.' },
      cap4: { title: 'Capítulo 4: principios y valores', text: 'Los principios que orientan el trabajo y los valores que el modelo busca.' },
    },
  },
}
