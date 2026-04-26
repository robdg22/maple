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
} as const
