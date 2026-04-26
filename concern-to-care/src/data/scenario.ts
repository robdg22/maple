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
  },
} as const
