import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  HelpCircleIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type SelectedAnswer = NonNullable<ClarifyingAnswer>

type ClarifyingScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onSelectAnswer: (answer: SelectedAnswer) => void
  onComplete: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const snappySpring = { type: 'spring', stiffness: 400, damping: 30, mass: 0.5 } as const
const paperShadow =
  'shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]'

export function ClarifyingScreen({
  selectedAnswer,
  onSelectAnswer,
  onComplete,
}: ClarifyingScreenProps) {
  const reduceMotion = useReducedMotion()
  const [isAdvancing, setIsAdvancing] = useState(false)

  useEffect(() => {
    if (!isAdvancing) {
      return
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
    <section className="flex min-h-full flex-col gap-5 bg-[#f7f4ee] text-ink">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className={`rounded bg-white p-4 text-[14px] font-medium leading-[18px] text-[#8a8a8a] ${paperShadow} [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]`}
      >
        Headaches, around two weeks, with vision changes at times.
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduceMotion ? 0 : 0.12 }}
        className="pt-2"
      >
        <div className="mb-3 flex items-center gap-2 text-sage-deep">
          <HugeiconsIcon icon={HelpCircleIcon} size={20} strokeWidth={1.7} />
          <p className="text-xs font-semibold uppercase">One quick check</p>
        </div>
        <h1 className="text-[27px] font-semibold leading-[1.12] text-[#5a5a55]">
          {scenario.clarifyingQuestion}
        </h1>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduceMotion ? 0 : 0.26 }}
        className={`rounded bg-[#fefaf4] p-4 ${paperShadow}`}
      >
        <div className="flex items-center gap-2 text-[#8a8a8a]">
          <HugeiconsIcon icon={ViewIcon} size={20} strokeWidth={1.6} />
          <p className="text-[14px] font-medium uppercase leading-[17px]">
            It changes the care route
          </p>
        </div>
        <div className="mt-4 grid gap-2.5">
          {scenario.clarifyingAnswers.map((answer, index) => {
            const isSelected = selectedAnswer === answer
            const isQuiet = Boolean(selectedAnswer) && !isSelected

            return (
              <motion.button
                key={answer}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{
                  opacity: isQuiet ? 0.48 : 1,
                  y: 0,
                  scale: isSelected && !reduceMotion ? 1.015 : 1,
                }}
                transition={{
                  ...snappySpring,
                  delay: reduceMotion ? 0 : 0.36 + index * 0.06,
                }}
                disabled={isAdvancing}
                onClick={() => selectAnswer(answer)}
                className={[
                  'flex min-h-[52px] items-center justify-between rounded px-4 text-left text-[16px] font-semibold leading-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed',
                  isSelected
                    ? 'bg-sage text-[#fefaf4] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]'
                    : 'bg-white text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] hover:bg-[#f7f4ee]',
                ].join(' ')}
              >
                <span>{answer}</span>
                <span className="text-[13px] font-medium opacity-70">
                  {answer === 'Yes'
                    ? 'Includes extras'
                    : answer === 'Some of these'
                      ? 'Possibly'
                      : 'Not noticed'}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: reduceMotion ? 0 : 0.52 }}
        className="mt-auto text-center text-xs font-medium leading-5 text-sage-deep"
      >
        This helps tune what kind of care makes sense next.
      </motion.p>
    </section>
  )
}
