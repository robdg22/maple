import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type RecommendationScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onBook: () => void
  onInspectHandoff: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const settleSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.1 } as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
}

const softScale: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...settleSpring, delay },
  }),
}

export function RecommendationScreen({
  selectedAnswer,
  onBook,
  onInspectHandoff,
}: RecommendationScreenProps) {
  const reduceMotion = useReducedMotion()
  const answerCopy = getAnswerCopy(selectedAnswer)

  return (
    <section className="flex min-h-full flex-col gap-4">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <Card
          variant="soft"
          className="line-clamp-1 p-3 text-sm leading-5 text-ink-soft"
        >
          {scenario.recommendation.summary}
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.12}
        className="w-fit rounded-full bg-sage-soft px-3 py-1.5 text-[11px] font-semibold uppercase text-sage-deep"
      >
        Based on what you've shared
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.18}
      >
        <h1 className="text-[31px] font-bold leading-[1.08] tracking-normal">
          {scenario.recommendation.heading}
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-ink-soft">{answerCopy}</p>
      </motion.div>

      <motion.div
        variants={softScale}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.28}
      >
        <Card variant="elevated" className="p-4">
          <p className="text-xs font-semibold uppercase text-sage-deep">Why</p>
          <p className="mt-2 text-[16px] font-semibold leading-6">
            {scenario.recommendation.reason}
          </p>
          <ul className="mt-4 space-y-3">
            {scenario.recommendation.evidence.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-5 text-ink-soft">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.38}
      >
        <p className="mb-2 text-xs font-semibold uppercase text-ink-muted">
          Other options
        </p>
        <div className="grid gap-2">
          {scenario.recommendation.otherOptions.map((option) => (
            <Card key={option.title} variant="base" className="p-3 shadow-none">
              <p className="text-sm font-semibold text-ink">{option.title}</p>
              <p className="mt-1 text-sm leading-5 text-ink-soft">{option.body}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.5}
      >
        <Card
          variant="base"
          className="border-amber/35 bg-amber-soft/70 p-4 shadow-none"
        >
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-amber"
              aria-hidden="true"
            >
              <InfoIcon />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">When to act faster</p>
              <ul className="mt-2 space-y-2">
                {scenario.recommendation.urgency.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-5 text-ink-soft">
                    <span className="text-amber" aria-hidden="true">
                      -
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        variants={softScale}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.58}
        className="mt-auto grid gap-3 pt-2"
      >
        <Button type="button" onClick={onBook} className="w-full">
          Find a GP appointment
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onInspectHandoff}
          className="w-full"
        >
          See and edit what will be shared
        </Button>
      </motion.div>
    </section>
  )
}

function getAnswerCopy(selectedAnswer: ClarifyingAnswer) {
  if (selectedAnswer === 'Yes') {
    return 'Your extra symptoms make it more important to get clinical advice soon.'
  }

  if (selectedAnswer === 'Some of these') {
    return 'Because some extra symptoms may be present, a prompt GP conversation is the clearest next step.'
  }

  if (selectedAnswer === 'No') {
    return 'Even without those extra symptoms, the changing pattern and vision changes are worth checking.'
  }

  return 'The pattern you described is enough to suggest speaking with a GP soon.'
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
