import { useMemo, useState } from 'react'
import { scenario } from '../data/scenario'

export const scenarioScreens = [
  'concern',
  'structuring',
  'structure',
  'recommend',
  'handoff',
  'booking',
  'confirmation',
  'preview',
] as const

export type ScenarioScreen = (typeof scenarioScreens)[number]
export type ClarifyingAnswer = (typeof scenario.clarifyingAnswers)[number] | null

const flowScreens = scenarioScreens.filter(
  (screen) => screen !== 'preview',
) as Exclude<ScenarioScreen, 'preview'>[]

export function useScenarioState() {
  const [screen, setScreen] = useState<ScenarioScreen>('concern')
  const [history, setHistory] = useState<ScenarioScreen[]>([])
  const [concernText, setConcernText] = useState<string>(scenario.concern)
  const [selectedClarifyingAnswer, setSelectedClarifyingAnswer] =
    useState<ClarifyingAnswer>(null)

  const currentIndex = useMemo(() => flowScreens.indexOf(screen as never), [screen])

  function goTo(nextScreen: ScenarioScreen) {
    setHistory((currentHistory) => [...currentHistory, screen])
    setScreen(nextScreen)
  }

  function goBack() {
    setHistory((currentHistory) => {
      const previousScreen = currentHistory.at(-1)
      if (previousScreen) {
        setScreen(previousScreen)
        return currentHistory.slice(0, -1)
      }

      return currentHistory
    })
  }

  function goNext() {
    if (currentIndex < 0) {
      goTo('concern')
      return
    }

    goTo(flowScreens[Math.min(currentIndex + 1, flowScreens.length - 1)])
  }

  function reset() {
    setScreen('concern')
    setHistory([])
    setConcernText(scenario.concern)
    setSelectedClarifyingAnswer(null)
  }

  return {
    screen,
    concernText,
    selectedClarifyingAnswer,
    canGoBack: history.length > 0,
    goTo,
    goBack,
    goNext,
    reset,
    setConcernText,
    setSelectedClarifyingAnswer,
  }
}
