import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PhoneFrame } from '../components/PhoneFrame'
import { Screen } from '../components/Screen'
import { scenarioScreens, useScenarioState } from '../hooks/useScenarioState'
import { scenario } from '../data/scenario'
import { BookingScreen } from '../screens/BookingScreen'
import { ClarifyingScreen } from '../screens/ClarifyingScreen'
import { ConfirmationScreen } from '../screens/ConfirmationScreen'
import { ConcernScreen } from '../screens/ConcernScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { HandoffScreen } from '../screens/HandoffScreen'
import { RecommendationScreen } from '../screens/RecommendationScreen'
import { StructureScreen } from '../screens/StructureScreen'
import { StructuringScreen } from '../screens/StructuringScreen'
import type { TextBoxTransitionRect } from '../types/transitions'

export function App() {
  const state = useScenarioState()
  const [summaryTransitionRect, setSummaryTransitionRect] =
    useState<TextBoxTransitionRect | null>(null)

  return (
    <div className="min-h-svh text-ink">
      <PhoneFrame>
        {state.screen === 'dashboard' ? (
          <DashboardScreen
            concernText={state.concernText}
            onConcernChange={state.setConcernText}
            onBookAppointment={() => state.goTo('booking')}
            onUpcomingAppointments={() => state.goTo('booking')}
            onCareBriefs={() => state.goTo('handoff')}
            onSubmitSymptoms={(textBoxRect) => {
              setSummaryTransitionRect(textBoxRect ?? null)
              state.goTo('structure')
            }}
          />
        ) : state.screen === 'structure' ? (
          <StructureScreen
            concernText={state.concernText}
            transitionTextBoxRect={summaryTransitionRect}
            onBack={state.goBack}
            onContinue={() => state.goTo('clarify')}
          />
        ) : state.screen === 'clarify' ? (
          <ClarifyingScreen
            selectedAnswer={state.selectedClarifyingAnswer}
            onBack={state.goBack}
            onSelectAnswer={state.setSelectedClarifyingAnswer}
            onComplete={() => state.goTo('recommend')}
          />
        ) : state.screen === 'recommend' ? (
          <RecommendationScreen
            selectedAnswer={state.selectedClarifyingAnswer}
            onBack={state.goBack}
            onBook={() => state.goTo('booking')}
            onInspectHandoff={() => state.goTo('handoff')}
          />
        ) : state.screen === 'handoff' ? (
          <HandoffScreen
            selectedAnswer={state.selectedClarifyingAnswer}
            onBack={state.goBack}
            onContinue={() => state.goTo('booking')}
          />
        ) : state.screen === 'booking' ? (
          <BookingScreen
            onBack={state.goBack}
            onSelectSlot={(slotId) => {
              state.setSelectedBookingSlotId(slotId)
              state.goTo('confirmation')
            }}
          />
        ) : state.screen === 'confirmation' ? (
          <ConfirmationScreen
            selectedSlotId={state.selectedBookingSlotId}
            onBack={state.goBack}
            onRestart={state.reset}
          />
        ) : (
          <Screen screenKey={state.screen}>
            <Header
              canGoBack={state.canGoBack}
              onBack={state.goBack}
              onPreview={() => state.goTo('preview')}
            />
            <div className="scrollbar-none -mx-5 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-12">
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
        )}
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
        className="flex h-10 w-10 items-center justify-center rounded bg-[#fefaf4] text-sage-deep shadow-[0_0_0_1px_rgb(0_0_0_/_10%)] transition-colors hover:bg-white disabled:text-ink-muted"
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
        className="h-10 rounded bg-[#fefaf4] px-3 text-xs font-semibold text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_10%)] transition-colors hover:bg-white"
      >
        Preview
      </button>
    </header>
  )
}

function ScreenHost({ state }: { state: ScenarioState }) {
  if (state.screen === 'concern') {
    return (
      <ConcernScreen
        concernText={state.concernText}
        onConcernChange={state.setConcernText}
        onContinue={() => state.goTo('structuring')}
      />
    )
  }

  if (state.screen === 'structuring') {
    return (
      <StructuringScreen
        concernText={state.concernText}
        onComplete={() => state.goTo('structure')}
      />
    )
  }

  return null
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
