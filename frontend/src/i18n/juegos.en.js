// Texts of the Games page in English. Same structure as juegos.es.js.
// The keys of `games` are the `id`s in src/config/juegos.js.
export default {
  crumbs: { label: 'Breadcrumb', home: 'Home', current: 'Games' },
  hero: {
    badge: 'Learn by playing',
    title: 'Educational games',
    text: 'Review HAS-200 concepts with word searches, crosswords and more. Everything is played right here, without leaving the platform.',
    chips: ['4 games', 'Modules 1 and 2', 'Without leaving the page'],
  },
  picker: { label: 'Available games' },
  module: (n) => `Module ${n}`,
  panelBadge: 'Selected game',
  tips: {
    title: 'Before you play',
    list: [
      'You can replay each game as many times as you like.',
      'Games are for review: they do not count toward exams.',
      'Do the module guide first to play with an edge.',
      'Use “Full screen” if you are on your phone.',
    ],
  },
  stage: {
    reset: 'Restart',
    full: 'Full screen',
    loading: 'Loading the game…',
    frameTitle: (name) => `Game: ${name}`,
    missingTitle: 'Game not set up yet',
    missingText: 'This game does not have its Educaplay link yet. It will be available soon.',
  },
  side: {
    how: 'How to play',
    tipTitle: 'Tip',
    tipText: 'If a term is unfamiliar, go back to the module guide and come back to play.',
  },
  games: {
    sopa: {
      title: 'Word search',
      text: 'Find the technical terms hidden in the grid.',
      heading: 'Find the HAS-200 terms',
      steps: ['Look horizontally, vertically and diagonally.', 'Select the first and last letter of each word.', 'Find them all in the least time possible.'],
    },
    cruci: {
      title: 'Crossword',
      text: 'Fill in the squares by reading each clue about the system.',
      heading: 'Complete the signals and networks crossword',
      steps: ['Tap a square to see its clue.', 'Type your answer with the keyboard.', 'Words cross each other: use them as hints.'],
    },
    ordenar: {
      title: 'Order words',
      text: 'Put the letters in the correct order to form the word.',
      heading: 'Order the letters to form the correct word',
      steps: ['Read the letters that appear disorganized.', 'Tap or drag them into order.', 'Check your word when you finish.'],
    },
    memoria: {
      title: 'Memory',
      text: 'Flip the cards and find the pairs for each concept.',
      heading: 'Find the HAS-200 pairs',
      steps: ['Tap a card to flip it.', 'Look for the card that pairs with it.', 'If they do not match they flip back: memorize them!'],
    },
  },
}
