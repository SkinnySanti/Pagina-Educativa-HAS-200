// Texts of the MEDIT page in English. Same structure as medit.es.js.
// The keys of `ejes`, `integracion.items`, `campo.steps` and `recursos.docs` are the `id`s in src/config/medit.js.
//
// DRAFT: the "How it was integrated" section describes what the platform does today. The team should
// validate and adjust it before delivery.
export default {
  crumbs: { label: 'Breadcrumb', home: 'Home', current: 'MEDIT' },
  hero: {
    badge: 'UdeC educational model',
    title: 'MEDIT in HAS 200 Learning',
    text: 'Here you can read what the Transmodern Digital Educational Model of the Universidad de Cundinamarca is and which parts of this platform respond to it.',
    chips: ['4 axes', 'Learning field', 'Official documents'],
  },
  about: {
    title: 'What is MEDIT?',
    text: 'The Transmodern Digital Educational Model (MEDIT in Spanish) guides the academic life of the Universidad de Cundinamarca. The Academic Council adopted it with Agreement 017 of December 3, 2019, and it aims to educate for life, democratic values, civility and freedom.',
    ejesTitle: 'Its four structural axes',
    officialText: 'To learn more about the University:',
    official: 'Visit the university’s official website',
  },
  ejes: {
    etica: { title: 'Ethics', text: 'Principles and values that guide the conduct of the whole university community.' },
    aprendizaje: { title: 'Learning', text: 'A person who self-regulates and keeps looking to improve.' },
    tecnologia: { title: 'Technology', text: 'Part of the educational process, and not just a way to automate tasks.' },
    conocimiento: { title: 'Knowledge', text: 'It is built in community and used to solve real problems of the territory.' },
  },
  integracion: {
    title: 'How was it integrated into the project?',
    text: 'Each axis of the model has its place in the platform. This is what we do in each one.',
    go: 'See module',
    items: {
      etica: {
        title: 'Ethics: minimal data and clear credits',
        module: 'Games',
        bullets: [
          'Only the email, alias, hashed password and results are stored.',
          'The alias keeps you from using your real name.',
          'The data policy you accept is the University’s.',
          'The games credit Educaplay as the platform of origin.',
        ],
      },
      aprendizaje: {
        title: 'Learning: your own progressive path',
        module: 'Guides',
        bullets: [
          'Guides are split into modules and you do them at your own pace.',
          'You can restart a guide whenever you want.',
          'The path starts with a diagnostic assessment.',
          'Exams can be retaken without limit, except the diagnostic, which you take only once.',
        ],
      },
      tecnologia: {
        title: 'Technology: a support for learning',
        module: 'Virtual tutor',
        bullets: [
          'An AI tutor answers questions about the HAS-200.',
          'The games let you review without pressure.',
          'The whole platform is in Spanish and English.',
        ],
      },
      conocimiento: {
        title: 'Knowledge: starting from a real system',
        module: 'Exams',
        bullets: [
          'The content is based on the HAS-200, a mini automated factory.',
          'Concepts are explained with everyday examples.',
          'Each wrong answer points to the module where you can review it.',
        ],
      },
    },
  },
  campo: {
    title: 'The learning field in the platform',
    text: 'MEDIT proposes a learning field with planning, technological interaction, data analysis and feedback. In HAS 200 Learning it goes like this.',
    steps: {
      planeacion: { title: 'Planning', text: 'The guides and the learning path set what to study and when.' },
      interaccion: { title: 'Technological interaction', text: 'The virtual tutor and the games support your study.' },
      datos: { title: 'Data collection', text: 'The exams record the results of every attempt.' },
      retro: { title: 'Feedback', text: 'The diagnostic is compared with the final exam and a report is generated.' },
    },
  },
  recursos: {
    title: 'Official MEDIT documents',
    text: 'To read the full model, these are the documents published by the University.',
    open: 'Open PDF',
    note: 'They open in a new tab, on the Universidad de Cundinamarca website.',
    source: 'Universidad de Cundinamarca',
    docs: {
      libro: { title: 'MEDIT book', text: 'The full model: components, axes, principles and values.' },
      cap3: { title: 'Chapter 3: science, technology, research and innovation', text: 'How the model understands technology and the learning field.' },
      cap4: { title: 'Chapter 4: principles and values', text: 'The principles that guide the work and the values the model pursues.' },
    },
  },
}
