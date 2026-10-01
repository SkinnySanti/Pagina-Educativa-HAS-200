// English copy.

import guias from './guias.en.js'

export default {
  guias,
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
    text: 'Your starting point before the lab: follow your learning path, step by step.',
    cta: 'View my learning path',
  },
  welcome: {
    badge: 'Official lab induction',
    title: 'Welcome to HAS 200 Learning!',
    text: "This space is your official induction before entering the lab: here you learn, at your own pace, how the HAS-200 works. Explore calmly, come back as often as you like and, when you feel ready, test what you've learned.",
  },
  overview: {
    title: 'What is this page and what is it for?',
    text: "HAS 200 Learning is your prep platform: you get to know the HAS-200 system, practice with guides and check what you've learned before your visit to the lab, as one integrated system rather than loose parts.",
    goalsTitle: 'By the end you will be able to:',
    goals: [
      'Identify the main components of the system.',
      'Explain the mechanism of each independent part.',
      'Describe how the subsystems work and interact.',
    ],
  },
  path: {
    title: 'Your learning path',
    text: 'Your navigation map: each card takes you to a module. Follow the order to get the most out of it.',
    progress: (n, total) => `${n} of ${total} steps`,
    continue: 'Continue',
    review: 'Review',
    diagnostic: {
      badge: 'Step 1 · Start here',
      title: 'Diagnostic assessment',
      text: 'Before the guides, take a short assessment to find out your starting point.',
      cta: 'Start assessment',
    },
    modules: [
      {
        title: 'Informational guides',
        bullets: ['Learn the HAS-200\'s components and mechanisms.', 'Everyday examples and fun facts.'],
        cta: 'Enter module',
      },
      {
        title: 'Practice guides',
        bullets: ['Practice what you learned with guided activities.', 'At your own pace, step by step.'],
        cta: 'Enter module',
      },
      {
        title: 'Two final exams',
        bullets: ['Test your command of the HAS-200.', 'Get your score once you finish each one.'],
        cta: 'Enter module',
      },
    ],
  },
  pyramid: {
    title: 'Where does the HAS-200 fit?',
    text: 'Industrial automation is organized into levels, from the plant floor to business management. These modules cover the first two: Field and Control, right where the HAS-200 operates.',
    ariaLabel: 'Five-level automation pyramid. From bottom to top: Field, Control, SCADA, MES and ERP. This course covers Field and Control.',
    inScope: 'Covered here',
    outScope: 'Outside this course',
    hint: '**Hover over or select each level to learn about it.**',
    caption: 'Levels III to V (SCADA, MES, ERP) are outside the scope of this course.',
    levels: {
      field: { label: 'I · Field', inScope: true, desc: 'Where everything starts: sensors measure and actuators move or trigger something.' },
      control: { label: 'II · Control', inScope: true, desc: 'The "brain" that decides what to do with those signals: a PLC, industrial PC or PID controllers.' },
      scada: { label: 'III · SCADA', inScope: false, desc: 'Supervision screens: they show in real time what is happening on the plant floor.' },
      mes: { label: 'IV · MES', inScope: false, desc: 'Manages production day by day: what was made, how much and with what quality.' },
      erp: { label: 'V · ERP', inScope: false, desc: 'The company-wide system: inventory, purchasing, finance and more.' },
    },
  },
  bilingual: {
    title: 'Why does English matter here?',
    text: 'Many of the HAS-200\'s technical terms come from English: for example, the machine\'s "brain" is called a PLC. You\'ll get to know them in depth, in both languages, in the guides.',
  },
  aiTutor: {
    title: 'An AI tutor at your service',
    text: "In the AI Tutor module you'll be able to solve doubts about the HAS-200 and the guides whenever you need to, at your own pace, like having a study companion available at all times.",
    badge: 'Coming soon to your menu',
  },
}
