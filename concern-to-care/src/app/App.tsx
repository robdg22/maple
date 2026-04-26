import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PhoneFrame } from '../components/PhoneFrame'
import { Screen } from '../components/Screen'
import { scenarioScreens, useScenarioState } from '../hooks/useScenarioState'
import { scenario } from '../data/scenario'

export function App() {
  const state = useScenarioState()

  return (
    <div className="min-h-svh text-ink">
      <PhoneFrame>
        <Screen screenKey={state.screen}>
          <Header
            canGoBack={state.canGoBack}
            onBack={state.goBack}
            onPreview={() => state.goTo('preview')}
          />
          <div className="flex min-h-0 flex-1 flex-col">
            {state.screen === 'preview' ? (
              <ComponentPreview
                selectedAnswer={state.selectedClarifyingAnswer}
                onSelectAnswer={state.setSelectedClarifyingAnswer}
              />
            ) : (
              <ScreenHost state={state} />
            )}
          </div>
        </Screen>
      </PhoneFrame>
    </div>
  )
}

type ScenarioState = ReturnType<typeof useScenarioState>

function Header({
  canGoBack,
  onBack,
  onPreview,
}: {
  canGoBack: boolean
  onBack: () => void
  onPreview: () => void
}) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <button
        type="button"
        onClick={canGoBack ? onBack : undefined}
        disabled={!canGoBack}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-sage-deep disabled:text-ink-muted"
        aria-label="Go back"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <p className="text-center text-xs font-semibold uppercase text-sage-deep">
        {scenario.title}
      </p>
      <button
        type="button"
        onClick={onPreview}
        className="h-10 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-soft"
      >
        Preview
      </button>
    </header>
  )
}

function ScreenHost({ state }: { state: ScenarioState }) {
  if (state.screen === 'concern') {
    return (
      <section className="flex flex-1 flex-col justify-between gap-6">
        <div className="pt-12">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
            className="mb-4 text-sm font-medium text-ink-soft"
          >
            Start in your own words.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 26,
              mass: 0.9,
              delay: 0.06,
            }}
            className="text-[28px] font-bold leading-[1.2]"
          >
            What's been happening?
          </motion.h1>
          <textarea
            value={state.concernText}
            onChange={(event) => state.setConcernText(event.target.value)}
            className="mt-8 min-h-56 w-full resize-none border-0 border-b border-line bg-transparent pb-4 text-[16px] leading-6 text-ink outline-none transition-colors focus:border-sage"
          />
          <p className="mt-4 text-sm leading-5 text-ink-soft">
            Use your own words. You can always change anything later.
          </p>
        </div>
        <Button
          type="button"
          disabled={!state.concernText.trim()}
          className="w-full"
          onClick={() => state.goTo('structuring')}
        >
          Continue
        </Button>
      </section>
    )
  }

  if (state.screen === 'structuring') {
    return (
      <StubScreen
        eyebrow="Understanding"
        title="Understanding what you've shared..."
        body="The concern is compressed into context at the top while the system prepares the structured view."
        cta="Show structure"
        onNext={() => state.goTo('structure')}
      />
    )
  }

  if (state.screen === 'structure') {
    return (
      <section className="flex flex-1 flex-col gap-5">
        <Card variant="soft" className="text-sm leading-5 text-ink-soft">
          "{state.concernText}"
        </Card>
        <h1 className="text-[28px] font-bold leading-[1.2]">Here's what we understood</h1>
        <Card variant="elevated" className="space-y-4">
          {scenario.structuredSummary.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <div>
        <p className="text-xs font-semibold uppercase text-sage-deep">
          {row.label}
        </p>
                <p className="mt-1 text-[16px] font-semibold leading-6">{row.value}</p>
              </div>
              <span className="text-ink-muted" aria-hidden="true">
                Edit
              </span>
            </div>
          ))}
        </Card>
        <Card variant="soft" className="text-sm leading-5 text-sage-deep">
          This is what we understood from what you shared. Tap any row to correct it.
        </Card>
        <ClarifyingQuestion
          selectedAnswer={state.selectedClarifyingAnswer}
          onSelectAnswer={(answer) => {
            state.setSelectedClarifyingAnswer(answer)
            state.goTo('recommend')
          }}
        />
      </section>
    )
  }

  if (state.screen === 'recommend') {
    return (
      <StubScreen
        eyebrow="Recommendation"
        title={scenario.recommendation.heading}
        body={scenario.recommendation.reason}
        cta="Inspect handoff"
        onNext={() => state.goTo('handoff')}
      />
    )
  }

  const labels = {
    handoff: {
      eyebrow: 'Handoff',
      title: 'Clinician brief preview',
      body: 'A later PR will add the editable handoff detail screen.',
      cta: 'Choose slot',
    },
    booking: {
      eyebrow: 'Booking',
      title: 'Appointment slots',
      body: 'A later PR will add slot selection and confirmation behavior.',
      cta: 'Confirm',
    },
    confirmation: {
      eyebrow: 'Complete',
      title: 'Appointment booked',
      body: 'The end state is stubbed here so PR1 can step through the whole planned flow.',
      cta: 'Restart',
    },
  } as const

  const copy = labels[state.screen as keyof typeof labels]

  return (
    <StubScreen
      eyebrow={copy.eyebrow}
      title={copy.title}
      body={copy.body}
      cta={copy.cta}
      onNext={state.screen === 'confirmation' ? state.reset : state.goNext}
    />
  )
}

function StubScreen({
  eyebrow,
  title,
  body,
  cta,
  onNext,
}: {
  eyebrow: string
  title: string
  body: string
  cta: string
  onNext: () => void
}) {
  return (
    <section className="flex flex-1 flex-col justify-between gap-8">
      <div className="pt-12">
        <p className="mb-3 text-xs font-semibold uppercase text-sage-deep">
          {eyebrow}
        </p>
        <h1 className="text-[28px] font-bold leading-[1.2]">{title}</h1>
        <Card variant="elevated" className="mt-8 text-[16px] leading-6 text-ink-soft">
          {body}
        </Card>
      </div>
      <Button type="button" onClick={onNext} className="w-full">
        {cta}
      </Button>
    </section>
  )
}

function ClarifyingQuestion({
  selectedAnswer,
  onSelectAnswer,
}: {
  selectedAnswer: ScenarioState['selectedClarifyingAnswer']
  onSelectAnswer: (answer: NonNullable<ScenarioState['selectedClarifyingAnswer']>) => void
}) {
  return (
    <Card variant="base" className="mt-auto">
      <p className="text-[16px] font-semibold leading-6">{scenario.clarifyingQuestion}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {scenario.clarifyingAnswers.map((answer) => (
          <Button
            key={answer}
            type="button"
            variant="pill"
            selected={selectedAnswer === answer}
            onClick={() => onSelectAnswer(answer)}
          >
            {answer}
          </Button>
        ))}
      </div>
      <p className="mt-4 text-sm leading-5 text-ink-soft">
        We're asking because it changes what kind of help you might need.
      </p>
    </Card>
  )
}

function ComponentPreview({
  selectedAnswer,
  onSelectAnswer,
}: {
  selectedAnswer: ScenarioState['selectedClarifyingAnswer']
  onSelectAnswer: ScenarioState['setSelectedClarifyingAnswer']
}) {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto pb-3">
      <p className="mb-3 text-xs font-semibold uppercase text-sage-deep">
        Component preview
      </p>
      <div className="space-y-4">
        <Card>
          <p className="text-sm font-semibold text-ink">Base card</p>
          <p className="mt-2 text-sm leading-5 text-ink-soft">
            Shared surface for screen content and reviewable information.
          </p>
        </Card>
        <Card variant="soft">
          <p className="text-sm font-semibold text-sage-deep">Soft card</p>
          <p className="mt-2 text-sm leading-5 text-ink-soft">
            Used for context strips, gentle guidance, and secondary surfaces.
          </p>
        </Card>
        <Card variant="elevated">
          <p className="text-sm font-semibold text-ink">Elevated card</p>
          <p className="mt-2 text-sm leading-5 text-ink-soft">
            Used for primary structured content in the mobile frame.
          </p>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button">Primary</Button>
          <Button type="button" variant="secondary">
            Secondary
          </Button>
        </div>
        <ClarifyingQuestion
          selectedAnswer={selectedAnswer}
          onSelectAnswer={(answer) => onSelectAnswer(answer)}
        />
        <Card variant="soft">
          <p className="mb-3 text-sm font-semibold text-ink">Screen host</p>
          <div className="grid grid-cols-2 gap-2">
            {scenarioScreens.map((screen) => (
              <span
                key={screen}
                className="rounded-full border border-line bg-surface px-3 py-2 text-center text-xs font-semibold text-ink-soft"
              >
                {screen}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
