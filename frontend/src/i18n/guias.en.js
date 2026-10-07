// Guides page copy (English). Same structure as guias.es.js.
// **double asterisks** = bold (handled by components/common/RichText.vue).

import m2 from './guias.m2.en.js'

export default {
  crumbs: { label: 'Breadcrumb', home: 'Home', guides: 'Guides', module1: 'Module 1 · Informative guide', module2: 'Module 2 · How it thinks and communicates' },

  picker: {
    label: 'Guide modules',
    here: 'You are here',
    soon: 'Soon',
    open: 'Open',
    soonTitle: 'Available soon',
    modules: [
      { title: 'Module 1 · Informative guide', text: 'Get to know the HAS-200 before your visit.' },
      { title: 'Module 2 · How it thinks and communicates', text: 'From the sensor to the screen: PLC, signals, network and SCADA.' },
    ],
  },

  hero: {
    badge: 'Module 1 · Informative guide',
    title: 'What is the HAS-200?',
    text: 'Discover the mini factory that thinks for itself.',
    chips: ['6 steps', 'With interactive challenges', 'Before your lab visit'],
  },

  intro: {
    hook: 'Have you ever wondered how thousands of sodas, sneakers or phones can all be exactly the same?',
    p1: 'Behind that there are factories that produce in series, without getting tired and almost without mistakes. And here is the interesting part: many of them run almost on their own.',
    p2: '**The HAS-200** lets you see, in small scale and in a safe way, how a real automatic factory works. Here you will understand the basic ideas before your visit to the lab.',
  },

  stepOf: (n, total) => `Step ${n} of ${total}`,
  pager: {
    label: 'Change step',
    prev: 'Previous',
    next: (n, title) => `Next: ${n} · ${title}`,
    finish: 'Finish module',
  },

  toc: {
    title: 'In this guide',
    complete: 'Module completed!',
    steps: [
      'In, process, out',
      'A factory in miniature',
      'The “senses” and the “hands”',
      'The machine’s traffic light',
      'Why should you care?',
      'Quick glossary',
    ],
    readSuffix: 'read',
  },

  s1: {
    title: 'A factory always does the same thing: in, process, out',
    kicker: 'Explore the examples',
    body: 'Imagine an arepa factory. Someone puts in the dough **(that goes in)**, the machine kneads it, shapes it and cooks it **(that is the process)**, and at the end a ready-to-eat arepa comes out **(that comes out)**. Every production system works with this same 3-step logic:',
    exLabel: 'Choose an example',
    hint: 'Tap each block to see what it means.',
    examplesNames: { arepas: 'Arepas', ropa: 'T-shirts', has: 'HAS-200' },
    examples: {
      arepas: ['Corn dough', 'It is kneaded, shaped and cooked', 'Ready-to-eat arepa'],
      ropa: ['Fabric and thread', 'It is cut and sewn', 'Finished T-shirt'],
      has: ['Loose parts', 'They are transported, sorted and assembled', 'Part delivered at the end'],
    },
    defs: {
      in: { name: 'Input', text: 'The raw material: what has not been transformed yet (flour, fabric, plastic, loose parts…).' },
      pr: { name: 'Process', text: 'What the machine or the people do to the material to change it.' },
      out: { name: 'Output', text: 'The final product, ready to be used or sold.' },
    },
    note: '**And in the HAS-200…** it works exactly like this, except that instead of arepas it moves and transforms small parts from one place to another inside the system, simulating a real factory.',
  },

  s2: {
    title: 'The HAS-200: a factory in miniature',
    kicker: 'Follow the part',
    body1: 'The HAS-200 is not a single machine but a set of “stations” connected to each other, each with a specific task. The material passes from one to the next, like in a relay race.',
    body2: 'Each station has a role: one receives the material, another transports it, another sorts or assembles it, and another delivers it finished.',
    stationWord: 'Station',
    stations: [
      { name: 'Material input', text: 'Receives the parts that are going to be processed.' },
      { name: 'Transport (belt)', text: 'Moves the material from one station to the next.' },
      { name: 'Sorting / Assembly', text: 'Sorts or joins the parts according to their task.' },
      { name: 'Product output', text: 'Delivers the finished product.' },
    ],
    beltLabel: 'Conveyor belt: the material moves from station to station',
    play: 'Watch a part’s journey',
    playing: 'Moving…',
    note: 'During your visit, your team will walk around the HAS-200 and identify these stations with their own eyes.',
  },

  s3: {
    title: 'The “senses” and “hands” of the system',
    kicker: 'Mini challenge: sensor or actuator?',
    body: 'For a machine to work “on its own” it needs to notice what is happening and act on it. That is what sensors and actuators are for.',
    sensor: { title: 'Sensor (the “eyes”)', text: 'Detects light, presence or position. It is information that **enters** the system.' },
    actuator: { title: 'Actuator (the “hands”)', text: 'Pushes, moves or grips parts. It is an action that **leaves** the system.' },
    note: '**Think of it like this:** when the tap in a public restroom opens by itself, a sensor detects your hand (the “eyes”) and an actuator opens the valve (the “hands”). The HAS-200 uses this idea to work without moving each part by hand.',
    quiz: {
      progress: (n, total) => `Question ${n} of ${total}`,
      sensor: 'Sensor',
      actuator: 'Actuator',
      right: 'Correct!',
      wrong: (answer) => `Almost. It was ${answer}.`,
      next: 'Next question',
      seeResult: 'See result',
      result: (score, total) => `Done! You got ${score} out of ${total}.`,
      retry: 'Try again',
      questions: [
        { q: 'Detects that a part has arrived', a: 's', why: 'Detecting means telling the system something: a sensor’s job.' },
        { q: 'Pushes the part onto the belt', a: 'a', why: 'Pushing is a physical action: an actuator does it.' },
        { q: 'Measures the position of a cylinder', a: 's', why: 'Measuring a position is information entering the system.' },
        { q: 'Grips a part', a: 'a', why: 'Gripping means acting on the part: an actuator does it.' },
        { q: 'Detects the presence of light', a: 's', why: 'Sensing light is information: a sensor does it.' },
        { q: 'Turns a motor', a: 'a', why: 'Turning is an action that leaves the system: actuator.' },
      ],
    },
  },

  s4: {
    title: 'The machine’s traffic light: the beacon and the control panel',
    kicker: 'Control the beacon',
    body1: 'Every automatic machine needs to tell people what is going on, especially when something could be dangerous. That is what the **beacon** is for: a kind of traffic light that uses colors to report the state of the system.',
    body2: 'The HAS-200 also has a **control panel** to start, stop or reset the system, including an **emergency stop** button that halts everything immediately in case of any risk.',
    note: 'Educational simulation. In practice you will learn to identify these buttons, always under the supervision of the knowledge manager.',
    beaconLabel: 'Beacon',
    panelLabel: 'Control panel',
    lamps: { r: 'Red light', y: 'Yellow light', g: 'Green light' },
    buttons: { start: 'Start', stop: 'Stop', reset: 'Reset', emg: 'EMERGENCY STOP' },
    latched: 'Emergency stop active: press Reset to start over.',
    messages: {
      idle: 'Try the buttons or tap a light.',
      lampG: 'Green: everything works normally.',
      lampY: 'Yellow: pay attention, something needs to be checked.',
      lampR: 'Red: the system stopped or there is an emergency.',
      start: 'Start: the system starts and the beacon turns green.',
      stop: 'Stop: the system stops and the beacon turns red.',
      reset: 'Reset: the system goes back to its initial state (beacon off).',
      emg: 'EMERGENCY STOP! It halts everything immediately in case of any risk.',
    },
  },

  s5: {
    title: 'Why should you care?',
    kicker: 'Discover your industry',
    body: 'Understanding how the HAS-200 works means understanding, on a small scale, how a large part of today’s industry works: food, clothing, car and medicine factories… almost everything you use every day went through a system like this one.',
    note: 'This is just the door to careers such as industrial engineering, mechatronics, automation and technology: professions that design, improve and look after these systems.',
    industryLabel: 'Choose an industry',
    industries: {
      food: { label: 'Food', in: 'Flour, water', out: 'Packaged bread' },
      clothes: { label: 'Clothing', in: 'Fabric, buttons', out: 'Trousers' },
      cars: { label: 'Cars', in: 'Metal parts', out: 'Assembled car' },
      meds: { label: 'Medicines', in: 'Ingredients', out: 'Packaged pill' },
    },
    stage: { in: 'Input', pr: 'Process', out: 'Output', transforms: 'It is transformed' },
    fact: {
      show: 'Did you know…?',
      hide: 'Hide',
      text: 'Mass production became popular in the early 20th century with car manufacturing and cut times so much that a process of almost a whole day dropped to a couple of hours. That is how powerful automation is!',
      before: 'Before: almost a whole day',
      after: 'With a production line: a couple of hours',
      chart: 'Illustrative time comparison, not to exact scale',
    },
  },

  s6: {
    title: 'Quick glossary',
    kicker: 'Flip the cards',
    body: 'These are the six key terms of the guide.',
    note: '**Before your visit to the lab:** you already know the key ideas. There you will see them in action and record them in your Work Instrument. Bring your curiosity!',
    flipAll: 'Flip all',
    hideAll: 'Hide again',
    cardAria: (term, flipped) => (flipped ? `${term}: tap to hide the meaning` : `${term}: tap to see the meaning`),
    terms: [
      { term: 'Production system', def: 'An organized set of people, machines and steps that turn materials into a product.' },
      { term: 'Station', def: 'Each “workplace” inside the system, with a specific task.' },
      { term: 'Sensor', def: 'An element that detects something (light, presence, position) and informs the system.' },
      { term: 'Actuator', def: 'An element that performs a physical action: move, push, grip, turn.' },
      { term: 'Automation', def: 'Making a machine perform tasks on its own, without step-by-step control.' },
      { term: 'Beacon', def: 'A traffic-light-style lamp that shows the state of the system (green, yellow, red).' },
    ],
  },

  finish: {
    title: 'You finished Module 1!',
    text: 'You already know the key ideas: production system, stations, sensors, actuators and the safety beacon. See you in the lab!',
    listTitle: 'Key ideas you already know',
    items: ['Production system', 'Stations', 'Sensors', 'Actuators', 'Safety beacon'],
    review: 'Review the module',
    home: 'Back to Home',
    next: 'Module 2',
  },

  m2,
}
