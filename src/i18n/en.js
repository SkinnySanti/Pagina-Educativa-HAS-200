// English copy. Keep the exact same structure as es.js.

const section = (letter) => ({
  short: `Section ${letter}`,
  title: `Section ${letter}: title pending`,
  summary: 'One or two lines summarising this part of the system.',
  components: [1, 2, 3, 4].map((n) => ({
    name: `Component ${n}`,
    desc: 'What it is and what it does, in one sentence.',
  })),
  mechanism: [
    { term: 'What it does', text: 'Its role in the system.' },
    { term: 'How it works', text: 'The working principle, step by step, no jargon.' },
    { term: 'What it connects to', text: 'What it receives from other parts and what it hands back.' },
  ],
  steps: [
    { title: 'Input', text: 'What this part receives.' },
    { title: 'Process', text: 'What happens inside.' },
    { title: 'Output', text: 'What it delivers to the rest of the system.' },
  ],
})

export default {
  brand: 'HAS 200 Learning',
  skip: 'Skip to content',
  nav: {
    label: 'Main navigation',
    inicio: 'Home',
    guias: 'Guides',
    examenes: 'Exams',
    feedback: 'Feedback',
    soon: 'Soon',
    soonTitle: 'Coming soon',
  },
  topbar: {
    toggleMenu: 'Show or hide the menu',
    language: 'Language',
  },
  hero: {
    title: 'Meet the HAS-200',
    text: 'Tour the whole system, part by part: what it is made of, how each mechanism works and how everything fits together.',
    cta: 'Start the tour',
    modelLabel: '3D model of the whole system',
  },
  subnav: {
    label: 'Page sections',
    integration: 'How they fit together',
    glossary: 'Glossary and FAQ',
  },
  tabs: {
    detail: 'Section details',
    components: 'Components',
    mechanism: 'Mechanism',
    operation: 'Operation',
    carousel: 'Components carousel',
    prev: 'Previous',
    next: 'Next',
  },
  placeholders: {
    image: 'Image pending',
    model: '3D model pending',
    componentImage: 'Photo or render of the component',
    mechanismImage: 'Mechanism diagram',
    sectionModel: '3D view of this part',
  },
  sections: { a: section('A'), b: section('B'), c: section('C') },
  integration: {
    title: 'How the three parts fit together',
    text: 'A view of the whole system: what each part receives and delivers.',
    signal: 'signal',
    caption: 'Replace this sketch with the real diagram: data, energy or signal flow between the parts.',
    alt: 'Integration diagram: section A sends a signal to section B, and B to C.',
  },
  faq: {
    title: 'Glossary and FAQ',
    items: [
      { q: 'Term 1', a: "Short, clear definition in the learner's language." },
      { q: 'Term 2', a: "Short, clear definition in the learner's language." },
      { q: 'Where do I start?', a: 'Go through sections A, B and C in order. Guides and exams are coming soon.' },
    ],
  },
}
