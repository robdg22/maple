import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert01Icon,
  ArrowRight01Icon,
  FileVerifiedIcon,
  Stethoscope02Icon,
} from '@hugeicons/core-free-icons'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type RecommendationScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onBook: () => void
  onInspectHandoff: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const settleSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.1 } as const
const paperShadow =
  'shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
}

const softScale: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
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
    <section className="flex min-h-full flex-col gap-4 bg-[#f7f4ee] text-ink">
      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        className={`rounded bg-white p-4 text-[14px] font-medium leading-[18px] text-[#8a8a8a] ${paperShadow} [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]`}
      >
        {scenario.recommendation.summary}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.12}
      >
        <div className="mb-3 flex items-center gap-2 text-sage-deep">
          <HugeiconsIcon icon={Stethoscope02Icon} size={20} strokeWidth={1.7} />
          <p className="text-xs font-semibold uppercase">Recommended next step</p>
        </div>
        <h1 className="text-[30px] font-semibold leading-[1.08] text-[#5a5a55]">
          {scenario.recommendation.heading}
        </h1>
        <p className="mt-3 text-[15px] font-medium leading-6 text-[#5a5a55]">
          {answerCopy}
        </p>
      </motion.div>

      <motion.article
        variants={softScale}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.24}
        className={`rounded bg-[#fefaf4] p-4 ${paperShadow}`}
      >
        <div className="flex items-center gap-2 text-[#8a8a8a]">
          <HugeiconsIcon icon={FileVerifiedIcon} size={20} strokeWidth={1.6} />
          <p className="text-[14px] font-medium uppercase leading-[17px]">
            Why this route
          </p>
        </div>
        <p className="mt-3 text-[16px] font-semibold leading-6 text-[#1a1a1a]">
          {scenario.recommendation.reason}
        </p>
        <div className="mt-4 divide-y divide-[#e5e0d6]">
          {scenario.recommendation.evidence.map((item) => (
            <div key={item} className="flex gap-3 py-3 text-sm leading-5 text-[#5a5a55]">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage"
                aria-hidden="true"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.34}
      >
        <p className="mb-2 text-xs font-semibold uppercase text-[#8a8a8a]">
          Other options considered
        </p>
        <div className="grid gap-2">
          {scenario.recommendation.otherOptions.map((option) => (
            <article
              key={option.title}
              className="rounded bg-white p-3 shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]"
            >
              <p className="text-sm font-semibold text-[#1a1a1a]">{option.title}</p>
              <p className="mt-1 text-sm font-medium leading-5 text-[#5a5a55]">
                {option.body}
              </p>
            </article>
          ))}
        </div>
      </motion.div>

      <motion.article
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.44}
        className="rounded bg-[#f0dcc9] p-4 shadow-[0_0_0_1px_rgb(184_92_92_/_18%)]"
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#fefaf4] text-amber"
            aria-hidden="true"
          >
            <HugeiconsIcon icon={Alert01Icon} size={18} strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">When to act faster</p>
            <ul className="mt-2 space-y-2">
              {scenario.recommendation.urgency.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-5 text-[#5a5a55]">
                  <span className="text-amber" aria-hidden="true">
                    -
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>

      <motion.div
        variants={softScale}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.54}
        className="mt-auto grid gap-2.5 pt-2"
      >
        <button
          type="button"
          onClick={onBook}
          className={`flex min-h-[50px] w-full items-center justify-center gap-2 rounded bg-sage px-4 text-[16px] font-semibold leading-5 text-[#fefaf4] transition-colors hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${paperShadow}`}
        >
          Find a GP appointment
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={1.7} />
        </button>
        <button
          type="button"
          onClick={onInspectHandoff}
          className="min-h-[46px] w-full rounded bg-[#fefaf4] px-4 text-[15px] font-semibold leading-5 text-sage-deep shadow-[0_0_0_1px_rgb(0_0_0_/_10%)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          See and edit what will be shared
        </button>
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
