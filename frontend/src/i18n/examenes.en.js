// Exams page texts in English. Same structure as examenes.es.js.
export default {
  crumbs: { label: 'Breadcrumb', home: 'Home', current: 'Exams' },
  badge: 'Learning assessment',
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
  state: { available: 'Available', locked: 'Locked', login: 'Login required', used: 'Taken', loading: 'Loading…' },
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
      'If your session drops, log in again and resume your attempt; your marked answers are kept in this browser.',
    ],
  },
  modules: [
    { tag: 'Module 1', guide: 'Informative guide', text: 'Components and operation of the HAS-200.' },
    { tag: 'Module 2', guide: 'Informative guide', text: 'Communication, signals and data processing.' },
  ],
  card: {
    title: (n) => `Module ${n} exam`,
    // Values that come from the server (totalPreguntas, preguntasEnIngles, tiempoLimiteMinutos): not hardcoded.
    meta: {
      questions: (n, en) => `${n} questions · ${en} in English`,
      time: (min) => (min ? `${min} min` : 'Up to 60 min'),
      score: 'Score when finished',
    },
    start: 'Start exam',
    resume: 'Resume exam',
    starting: 'Starting…',
    loading: 'Loading…',
    review: 'View review',
    lastReview: 'View last review',
    used: 'You already took this diagnostic: it only has one attempt. You can view your review.',
    usedNoReview: 'You already took this diagnostic: it only has one attempt. The review of that attempt is not available in this browser.',
    inProgress: 'You have an attempt in progress. Resume it before time runs out.',
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
      // Temporary: remove once guide progress is saved on the server (PUT /api/me/progress).
      pendingSync: 'You already finished this guide, but the server has not recorded your progress yet. It will unlock once your progress is saved to your account.',
    },
  },
  side: {
    progress: { title: 'Your exam path', done: 'completed', groups: ['Diagnostic', 'Post path'] },
    why: {
      title: 'Why log in?',
      items: ['Save your progress in the guides.', 'Take the lab exams.', 'Talk to the Virtual Tutor if you have questions.', 
              'Access your results and feedback.'],
    },
  },
  dialog: {
    title: 'Before you start',
    text: (name, min) =>
      `${name}. It has 10 questions (2 in English) and lasts ${min ? `${min} minutes` : 'up to 60 minutes'}; the clock runs on the server. If your session drops, log in again and resume your attempt.`,
    single: 'This is a diagnostic assessment: you can only submit it once. If you leave without submitting, the clock keeps running.',
    cancel: 'Cancel',
    confirm: 'Start',
  },
  // Exam in progress box
  take: {
    clockLabel: 'Time left',
    navLabel: 'Exam questions',
    counter: (n, total) => `Question ${n} of ${total}`,
    answered: (n, total) => `${n} of ${total} answered`,
    questionN: (n) => `Question ${n}`,
    pipLabel: (n, done) => `Question ${n}, ${done ? 'answered' : 'unanswered'}`,
    englishTitle: 'Question in English',
    prev: 'Previous',
    next: 'Next',
    finish: 'Submit exam',
    sending: 'Submitting…',
    clear: 'Clear answer',
    confirmAll: (n) => `You are about to submit your ${n} answers. You will not be able to change them afterwards.`,
    confirmMissing: (n) =>
      `${n === 1 ? '1 question is' : `${n} questions are`} unanswered and will count as incorrect. After submitting you will not be able to change your answers.`,
    confirmYes: 'Yes, submit',
    confirmNo: 'Keep answering',
    minutesLeft: (m) => (m === 1 ? '1 minute left.' : `${m} minutes left.`),
  },
  // Result and review
  result: {
    hits: (a, total) => `${a} of ${total} correct answers`,
    close: 'Back to exams',
    loading: 'Loading your review…',
    reviewTitle: 'Review of your mistakes',
    perfect: 'No mistakes! You answered every question correctly.',
    yours: 'Your answer',
    correct: 'Correct answer',
    unanswered: 'Not answered',
    retry: 'Retry',
    study: (g, s) => `Review in Guide ${g} · Step ${s}`,
    skills: {
      INGLES: 'English',
      FUNCIONAMIENTO: 'Operation',
      TERMINOS_TECNICOS: 'Technical terms',
      PENSAMIENTO_SECUENCIAL: 'Sequential thinking',
    },
    // `concepto` arrives as a stable key (16 in total, 8 per module). The ones missing from the backend context
    // still need to be filled in: meanwhile a readable version of the key is shown (e.g. "Funcion actuador").
    concepts: {
      'funcion-actuador': 'Actuator function',
    },
  },
  // Backend errors: decided by `codigo` (ProblemDetail), never by `detail`.
  errors: {
    generic: 'We could not complete the action. Please try again in a moment.',
    network: 'We could not reach the server. Check your connection and try again.',
    session: 'Your session expired. Log in again; if you had an exam in progress, you can resume it.',
    rate: 'Too many attempts. Wait a moment and try again.',
    codes: {
      EXAMEN_NO_ENCONTRADO: 'That exam is no longer available. We refreshed the list.',
      GUIA_INCOMPLETA: 'You have not finished this module’s guide yet. Complete its 6 steps to take this exam.',
      DIAGNOSTICO_USADO: 'You already took this diagnostic assessment: it only has one attempt.',
      INTENTO_NO_ENCONTRADO: 'We could not find that attempt. Go back to the exam list.',
      INTENTO_VENCIDO: 'Time is up; this attempt does not count.',
      INTENTO_NO_ENVIADO: 'The review is only available once the attempt has been submitted.',
      PREGUNTA_INVALIDA: 'There was a problem with your answers and the submission was not saved. Try again; if it persists, reload the page.',
      OPCION_INVALIDA: 'There was a problem with your answers and the submission was not saved. Try again; if it persists, reload the page.',
      RESPUESTA_DUPLICADA: 'There was a problem with your answers and the submission was not saved. Try again; if it persists, reload the page.',
    },
    guideLink: 'Go to the guide',
    retryList: 'Retry',
  },
}
