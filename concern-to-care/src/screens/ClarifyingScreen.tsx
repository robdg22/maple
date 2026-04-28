import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  HelpCircleIcon,
} from '@hugeicons/core-free-icons'
import { CareHeader, SummaryBar } from '../components/CareScreen'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type SelectedAnswer = NonNullable<ClarifyingAnswer>

type ClarifyingScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onBack: () => void
  onSelectAnswer: (answer: SelectedAnswer) => void
  onComplete: () => void
}

const questionTransition = {
  duration: 0.34,
  ease: [0.215, 0.61, 0.355, 1],
} as const

const answerTransition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

const answerOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Not sure', value: 'Some of these' },
] satisfies { label: string; value: SelectedAnswer }[]

const QUESTION_TYPE_INTERVAL = 16

export function ClarifyingScreen({
  selectedAnswer,
  onBack,
  onSelectAnswer,
  onComplete,
}: ClarifyingScreenProps) {
  const reduceMotion = useReducedMotion()
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [typedQuestion, setTypedQuestion] = useState(
    reduceMotion ? scenario.clarifyingQuestion : '',
  )
  const questionComplete = typedQuestion.length === scenario.clarifyingQuestion.length

  useEffect(() => {
    if (reduceMotion) {
      setTypedQuestion(scenario.clarifyingQuestion)
      return undefined
    }

    setTypedQuestion('')
    let characterIndex = 0

    const typeTimer = window.setInterval(() => {
      characterIndex += 1
      setTypedQuestion(scenario.clarifyingQuestion.slice(0, characterIndex))

      if (characterIndex >= scenario.clarifyingQuestion.length) {
        window.clearInterval(typeTimer)
      }
    }, QUESTION_TYPE_INTERVAL)

    return () => window.clearInterval(typeTimer)
  }, [reduceMotion])

  useEffect(() => {
    if (!isAdvancing) {
      return undefined
    }

    const timer = window.setTimeout(onComplete, reduceMotion ? 120 : 420)

    return () => window.clearTimeout(timer)
  }, [isAdvancing, onComplete, reduceMotion])

  function selectAnswer(answer: SelectedAnswer) {
    if (isAdvancing) {
      return
    }

    onSelectAnswer(answer)
    setIsAdvancing(true)
  }

  return (
    <section className="relative h-full overflow-hidden bg-[#fcfaf6] text-[#1a1a1a]">
      <CareHeader title="Questions" onBack={onBack} />

      <main className="scrollbar-none absolute inset-x-0 bottom-0 top-[66px] touch-pan-y overflow-y-scroll overscroll-contain px-4 pb-5 pt-4 [-webkit-overflow-scrolling:touch]">
        <motion.div
          className="flex min-h-full flex-col justify-center gap-10"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={questionTransition}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...questionTransition,
              delay: reduceMotion ? 0 : 0.05,
            }}
          >
            <SummaryBar />
          </motion.div>

          <section className="flex flex-col gap-5">
            <motion.div
              className="flex items-center gap-2.5 text-[#7a9e94]"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...questionTransition,
                delay: reduceMotion ? 0 : 0.08,
              }}
            >
              <HugeiconsIcon icon={HelpCircleIcon} size={22} strokeWidth={1.7} />
              <p className="text-[16px] font-semibold uppercase leading-5 tracking-normal">
                One quick check
              </p>
            </motion.div>

            <TypingQuestion
              typedQuestion={typedQuestion}
              reduceMotion={Boolean(reduceMotion)}
            />
          </section>

          <AnimatePresence>
            {questionComplete ? (
              <motion.div
                key="answer-options"
                className="flex w-full gap-2.5"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.14, ease: 'easeOut' }}
              >
                {answerOptions.map((option, index) => {
                  const isSelected = selectedAnswer === option.value
                  const isQuiet = Boolean(selectedAnswer) && !isSelected

                  return (
                    <motion.button
                      key={option.label}
                      type="button"
                      disabled={isAdvancing}
                      onClick={() => selectAnswer(option.value)}
                      className={[
                        'flex h-9 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded border border-[#7a9e94] px-3 pb-1 pt-0.5 text-[16px] font-semibold leading-5 shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)] outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a9e94] disabled:cursor-not-allowed',
                        isSelected
                          ? 'bg-[#7a9e94] text-white'
                          : 'bg-[#fcfaf6] text-[#7a9e94] hover:bg-[#eef5f2]',
                      ].join(' ')}
                      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                      animate={{
                        opacity: isQuiet ? 0.5 : 1,
                        y: 0,
                        scale: isSelected && !reduceMotion ? 1.02 : 1,
                      }}
                      transition={{
                        ...answerTransition,
                        delay: reduceMotion ? 0 : index * 0.055,
                      }}
                    >
                      {option.label}
                    </motion.button>
                  )
                })}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </main>
    </section>
  )
}

function TypingQuestion({
  typedQuestion,
  reduceMotion,
}: {
  typedQuestion: string
  reduceMotion: boolean
}) {
  return (
    <motion.h1
      className="relative text-[32px] font-semibold leading-[1.08] tracking-normal text-[#1a1a1a]"
      aria-label={scenario.clarifyingQuestion}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...questionTransition,
        delay: reduceMotion ? 0 : 0.14,
      }}
    >
      <span className="invisible" aria-hidden="true">
        {scenario.clarifyingQuestion}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {typedQuestion}
      </span>
    </motion.h1>
  )
}
