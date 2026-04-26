export const scenario = {
  title: 'From concern to care',
  concern:
    "I've had headaches on and off for a couple of weeks. They're getting more frequent and sometimes my vision feels off. I'm not sure if this is a GP thing, an optician thing, or something I should stop ignoring.",
  structuredSummary: [
    { label: 'Symptom', value: 'Headaches' },
    { label: 'Pattern', value: 'On and off, becoming more frequent' },
    { label: 'Duration', value: 'Around two weeks' },
    { label: 'Other', value: 'Vision feels off at times' },
  ],
  clarifyingQuestion:
    'Do the headaches come with anything else, like nausea, sensitivity to light, or numbness?',
  clarifyingAnswers: ['Yes', 'Some of these', 'No'],
  recommendation: {
    heading: 'Same-day or next-day GP appointment',
    reason:
      'Because the headaches are becoming more frequent and sometimes affect vision, it is worth checking in with a GP promptly.',
    summary: 'Headaches, two weeks, vision changes',
    evidence: [
      'The headaches have been happening for around two weeks.',
      'They are becoming more frequent rather than settling.',
      'Vision changes are worth discussing with a clinician promptly.',
    ],
    otherOptions: [
      {
        title: 'Optician check',
        body: 'Helpful if vision symptoms continue, but it should not replace speaking to a GP about the headache pattern.',
      },
      {
        title: 'Self-care only',
        body: 'Reasonable for mild one-off headaches, but this pattern has enough change to get checked.',
      },
    ],
    urgency: [
      'A sudden severe headache',
      'Weakness, numbness, confusion, or fainting',
      'Vision loss or symptoms that are rapidly worsening',
    ],
  },
  handoff: {
    date: '26 Apr 2026',
    sections: [
      {
        title: 'Reason for appointment',
        body: 'Headaches that have become more frequent over the last two weeks, with vision feeling off at times.',
      },
      {
        title: 'Symptom summary',
        body: 'Intermittent headaches, increasing frequency, sometimes alongside visual changes. Clarifying answer recorded in the app.',
      },
      {
        title: 'What the patient is concerned about',
        body: 'Unsure whether this should be handled by a GP, optician, or more urgent care.',
      },
      {
        title: 'What we recommended',
        body: 'Same-day or next-day GP appointment, with faster action if symptoms suddenly worsen.',
      },
      {
        title: 'What we did not assess',
        body: 'No diagnosis was made. Medication, medical history, blood pressure, and neurological examination were not assessed.',
      },
    ],
  },
  booking: {
    slots: [
      {
        id: 'today-1620',
        day: 'Today',
        time: '4:20pm',
        clinician: 'Dr. Sarah Chen',
        clinic: 'Parkside Medical Centre',
        distance: '0.8 miles away',
      },
      {
        id: 'tomorrow-0930',
        day: 'Tomorrow',
        time: '9:30am',
        clinician: 'Dr. Amit Patel',
        clinic: 'Riverside GP Practice',
        distance: '1.1 miles away',
      },
      {
        id: 'tomorrow-1140',
        day: 'Tomorrow',
        time: '11:40am',
        clinician: 'Dr. Leah Morgan',
        clinic: 'Parkside Medical Centre',
        distance: '0.8 miles away',
      },
    ],
  },
} as const
