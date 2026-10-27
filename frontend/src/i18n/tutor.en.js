// Virtual Tutor copy (English). Same structure as tutor.es.js.
// **double asterisk** = bold (handled by components/common/RichText.vue).

export default {
  crumbs: { label: 'Breadcrumb', home: 'Home', current: 'Virtual tutor' },

  hero: {
    badge: 'Virtual tutor',
    title: 'Ask the HAS-200 tutor',
    text: 'Solve your doubts about the HAS-200 and the guides, at your own pace and whenever you need.',
    chips: ['Short, clear answers', 'Knows guides 1 and 2', 'Before your lab visit'],
  },

  chat: {
    title: 'Chat with the tutor',
    logLabel: 'Conversation with the virtual tutor',
    welcome: "Hi! I'm the HAS-200 virtual tutor. I can explain sensors, actuators, the PLC, the data network, SCADA or any topic from the guides. What would you like to know?",
    you: 'You',
    tutor: 'Tutor',
    suggestionsTitle: 'Try asking:',
    suggestions: [
      'What is the HAS-200?',
      "What's the difference between a sensor and an actuator?",
      'What does a PLC do?',
      'What do the beacon colors mean?',
    ],
    placeholder: 'Type your question…',
    inputLabel: 'Your question for the tutor',
    send: 'Send',
    thinking: 'The tutor is typing…',
    clear: 'New conversation',
    counter: (n, max) => `${n} / ${max}`,
    remaining: (n) => (n === 1 ? 'You have 1 question left today.' : `You have ${n} questions left today.`),
    aiNotice: 'The tutor is an AI and can make mistakes: double-check with the guides or the knowledge manager.',
  },

  errors: {
    dayLimit: "You've reached today's question limit. Come back tomorrow!",
    slowDown: "You're going too fast. Wait a moment and ask again.",
    busy: 'The tutor is very busy right now. Try again in a minute.',
    unavailable: 'The tutor is not available right now. Please try again later.',
    network: "We couldn't reach the server. Check your connection and try again.",
    session: 'Your session ended. Log in again to talk to the tutor.',
    invalid: "We couldn't send your question. Make sure it isn't empty or too long.",
    generic: 'Something went wrong. Please try again in a moment.',
  },

  audios: {
    title: 'Listen to the guides',
    lead: 'Two short audios to review the guides’ content on the go or while you rest your eyes.',
    langNote: '',
    fallback: 'The English audio isn’t available yet: playing the Spanish version.',
    transcriptLang: 'en',
    play: 'Play',
    pause: 'Pause',
    seek: 'Audio position',
    transcript: 'View transcript',
    duration: (m) => `≈ ${m} min`,
    unavailable: 'We couldn’t load this audio. Check your connection and try again.',
    items: [
      {
        title: 'Guide 1 · What is the HAS-200?',
        text: 'In, process, out; stations, sensors and beacon',
        transcript: [
          'Welcome to HAS-200 Guide 1. Have you ever wondered how thousands of identical soft drinks or sneakers can exist? Behind them are factories that produce in series, and many of them run almost on their own.',
          'Every factory does the same thing: in, process, out. Think of an arepa factory: someone adds the dough, that is the input; the machine kneads, shapes and cooks it, that is the process; and in the end a ready-to-eat arepa comes out, that is the output. The HAS-200 works the same way, but with small parts.',
          'It is not a single machine, but a set of stations connected to each other. One receives the parts, a belt carries them, another sorts or assembles them, and the last one delivers the finished product, like a relay race.',
          'To work almost on its own, the system uses sensors and actuators. The sensor is the eyes: it detects light, presence or position. The actuator is the hands: it pushes, moves or holds parts. And to tell people what is going on there is the beacon, a kind of traffic light: green, everything is running normally; yellow, pay attention; red, the system stopped or there is an emergency. There is also a control panel with an emergency stop that halts everything immediately.',
          'Understanding this is understanding, on a small scale, a good part of today’s industry. Now practice with the guide’s challenges and get ready for your visit to the lab.',
        ],
      },
      {
        title: 'Guide 2 · How does the HAS-200 think and communicate?',
        text: 'From sensor to screen: signals, PLC, network and SCADA',
        transcript: [
          'Welcome to Guide 2. When a part passes in front of a sensor, who decides what to do, and how does the person looking at the screen find out? Today you will follow the path of a signal.',
          'It all starts at the sensor, which detects the part and generates a signal. That signal can be digital, with only two states, zero or one, like a pushbutton pressed or released; or analog, which can take many in-between values, like a temperature or a tank level. A quick rule: if there is only yes or no, it is digital; if how much matters, it is analog.',
          'The signal reaches the PLC, the brain of the HAS-200. It is a rugged, reliable industrial computer that endlessly repeats three steps: it reads the inputs, runs its program and updates the outputs, such as motors and lights. It is like a chef who reads the order, follows the recipe and tells the kitchen.',
          'Then the data travels over a data network: a cable carries it to a switch, which distributes it among the connected devices until it reaches the computer.',
          'There, the supervision program, called SCADA, shows the state of the factory on screen. This way, from sensor to screen, the information completes its journey. Now build the path in the guide and test what you learned.',
        ],
      },
    ],
  },

  side: {
    howTitle: 'How to get the most out of it',
    how: [
      'Ask specific questions, for example: “What does the PLC do?”.',
      "Ask for an everyday example if something isn't clear.",
      'Explain in your own words what you understood and ask the tutor to check it.',
    ],
    privacyTitle: 'Before you type',
    privacyText: "Don't write personal data (full name, phone, address). Your questions are processed by an external artificial intelligence service to generate the answer, and the platform does not store the conversation.",
    examTitle: 'About the exams',
    examText: "The tutor helps you understand the topics, but it won't solve exam questions for you.",
  },
}
