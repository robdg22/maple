import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type SelectedAnswer = NonNullable<ClarifyingAnswer>

type ClarifyingScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onSelectAnswer: (answer: SelectedAnswer) => void
  onComplete: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const

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

    const timer = window.setTimeout(onComplete, 400)

    return () => window.clearTimeout(timer)
  }, [isAdvancing, onComplete])

  function selectAnswer(answer: SelectedAnswer) {
    if (isAdvancing) {
      return
    }

    onSelectAnswer(answer)
    setIsAdvancing(true)
  }

  return (
    <section className="flex min-h-full flex-col justify-between gap-6">
      <div className="pt-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <Card variant="soft" className="p-4 text-sm leading-5 text-sage-deep">
            Headaches, around two weeks, with vision changes at times.
          </Card>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: reduceMotion ? 0 : 0.12 }}
          className="mt-6"
        >
          <p className="mb-3 text-xs font-semibold uppercase text-sage-deep">
            One quick check
          </p>
          <h1 className="text-[26px] font-bold leading-[1.14]">
            {scenario.clarifyingQuestion}
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduceMotion ? 0 : 0.32 }}
      >
        <Card variant="base" className="p-4">
          <div className="flex flex-col gap-2">
            {scenario.clarifyingAnswers.map((answer, index) => {
              const isSelected = selectedAnswer === answer
              const isQuiet = Boolean(selectedAnswer) && !isSelected

              return (
                <motion.div
                  key={answer}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{
                    opacity: isQuiet ? 0.48 : 1,
                    y: 0,
                    scale: isSelected && !reduceMotion ? 1.02 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    mass: 0.5,
                    delay: reduceMotion ? 0 : 0.42 + index * 0.06,
                  }}
                >
                  <Button
                    type="button"
                    variant="pill"
                    selected={isSelected}
                    disabled={isAdvancing}
                    onClick={() => selectAnswer(answer)}
                    className="min-h-11 w-full justify-start"
                  >
                    {answer}
                  </Button>
                </motion.div>
              )
            })}
          </div>
          <p className="mt-3 text-sm leading-5 text-ink-soft">
            This helps tune what kind of care makes sense next.
          </p>
        </Card>
      </motion.div>
    </section>
  )
}
