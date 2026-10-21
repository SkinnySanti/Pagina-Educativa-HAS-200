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
