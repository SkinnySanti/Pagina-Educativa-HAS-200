// Exams page texts in English. Same structure as examenes.es.js.
export default {
  crumbs: { label: 'Breadcrumb', home: 'Home', current: 'Exams' },
  hero: {
    badge: 'Exams module',
    title: 'Put what you learned to the test',
    text: 'Two kinds of exam, one per module. Each exam has 10 questions, 2 of them in English.',
    chips: ['2 exam types', '10 questions per exam', '2 questions in English', 'Up to 60 minutes'],
  },
  notice: {
    title: 'Log in to take the exams',
    text: 'You can see how they work, but you need an account to take them and save your score.',
    cta: 'Log in',
  },
  picker: {
    label: 'Exam type',
    options: [
      { title: 'Diagnostic assessment', text: 'Find your starting point before the guides.' },
      { title: 'Post learning-path exam', text: 'Check what you learned when you finish your path.' },
    ],
  },
  state: { available: 'Available', locked: 'Locked', login: 'Login required' },
  panels: [
    { title: 'Diagnostic assessment', text: 'Before the guides, take one exam per module. It shows you where you are starting from.' },
    {
      title: 'Post learning-path exam',
      text: 'These are the same two exams as the diagnostic, one per module. Take them after the guides to see how far you have come.',
    },
  ],
  before: {
    title: 'Before you start',
    items: [
      'Each exam lasts up to 60 minutes.',
      'Look for a quiet environment without distractions.',
      'You will encounter 10 questions and 2 are in English.',
      'If your session drops, log in again and resume your attempt; your marked answers are not lost.',
    ],
  },
  modules: [
    { tag: 'Module 1', guide: 'Informative guide', text: 'Components and operation of the HAS-200.' },
    { tag: 'Module 2', guide: 'Informative guide', text: 'Communication, signals and data processing.' },
  ],
  card: {
    title: (n) => `Module ${n} exam`,
    meta: { questions: '10 questions · 2 in English', time: 'Up to 60 min', score: 'Score when finished' },
    start: 'Start exam',
    locked: 'Locked',
    steps: (n, total) => `${n} of ${total} steps`,
    lock: {
      login: 'Log in to take this exam.',
      loginGuide: [
        'Log in and finish the 6 steps of the Module 1 guide to unlock it.',
        'Log in and finish the 6 steps of the Module 2 guide to unlock it.',
      ],
      guide: [
        'Finish the 6 steps of the Module 1 guide to unlock it.',
        'Finish the 6 steps of the Module 2 guide to unlock it.',
      ],
    },
  },
  side: {
    progress: { title: 'Your exam path', done: 'completed', groups: ['Diagnostic', 'Post path'] },
    why: {
      title: 'Why log in?',
      items: ['Save your progress in the guides.', 'Take the lab exams.', 'Check your feedback.'],
    },
  },
  dialog: {
    title: 'Before you start',
    text: (name) =>
      `${name}. It has 10 questions (2 in English) and lasts up to 60 minutes; the clock runs on the server. If your session drops, log in again and resume your attempt.`,
    cancel: 'Cancel',
    confirm: 'Start',
  },
  startSoon: 'Taking the exam will be available very soon.',
}
