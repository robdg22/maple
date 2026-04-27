import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowRight01Icon,
  Edit03Icon,
  FileVerifiedIcon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type HandoffScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onContinue: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const settleSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.1 } as const
const paperShadow =
  'shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]'

const editActions = [
  { label: 'Edit any section', icon: Edit03Icon },
  { label: 'Add something we missed', icon: Add01Icon },
  { label: 'Remove the brief and start fresh', icon: RefreshIcon },
] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay: 0.2 + index * 0.06 },
  }),
}

export function HandoffScreen({
  selectedAnswer,
  onContinue,
}: HandoffScreenProps) {
  const reduceMotion = useReducedMotion()
  const [sheetTitle, setSheetTitle] = useState<string | null>(null)

  return (
    <section className="flex min-h-full flex-col gap-4 bg-[#f7f4ee] text-ink">
      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="mb-3 flex items-center gap-2 text-sage-deep">
          <HugeiconsIcon icon={FileVerifiedIcon} size={20} strokeWidth={1.7} />
          <p className="text-xs font-semibold uppercase">Care brief</p>
        </div>
        <h1 className="text-[28px] font-semibold leading-[1.1] text-[#5a5a55]">
          What we'll share with your GP
        </h1>
        <p className="mt-3 text-[15px] font-medium leading-6 text-[#5a5a55]">
          Your GP will see this before your appointment so you don't have to
          explain it again.
        </p>
      </motion.div>

      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={settleSpring}
        className={`overflow-hidden rounded bg-[#fefaf4] ${paperShadow}`}
      >
        <div className="flex items-center justify-between bg-sage-deep px-4 py-3 text-[#fefaf4]">
          <div>
            <p className="text-[11px] font-semibold uppercase opacity-80">
              Prepared for GP review
            </p>
            <p className="text-sm font-semibold">Editable before booking</p>
          </div>
          <time className="font-mono text-xs opacity-85">
            {scenario.handoff.date}
          </time>
        </div>
        <div className="divide-y divide-[#e5e0d6]">
          {scenario.handoff.sections.map((section, index) => (
            <motion.section
              key={section.title}
              variants={sectionVariants}
              custom={reduceMotion ? 0 : index}
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
              className="px-4 py-3"
            >
              <h2 className="text-[12px] font-semibold uppercase leading-4 text-[#8a8a8a]">
                {section.title}
              </h2>
              <p className="mt-2 text-sm font-medium leading-5 text-[#1a1a1a]">
                {section.body}
              </p>
              {section.title === 'Symptom summary' ? (
                <p className="mt-2 w-fit rounded bg-white px-2 py-1 text-xs font-semibold text-sage-deep shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]">
                  Clarifying answer: {selectedAnswer ?? 'Not recorded'}
                </p>
              ) : null}
            </motion.section>
          ))}
        </div>
      </motion.article>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.46}
        className="grid gap-2"
      >
        {editActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => setSheetTitle(action.label)}
            className="flex min-h-11 items-center justify-between rounded bg-white px-3 text-left text-sm font-semibold text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] transition-colors hover:bg-[#fefaf4] hover:text-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <HugeiconsIcon icon={action.icon} size={18} strokeWidth={1.7} />
              <span>{action.label}</span>
            </span>
            <ChevronIcon />
          </button>
        ))}
      </motion.div>

      <motion.p
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.58}
        className="text-center text-xs font-medium leading-5 text-sage-deep"
      >
        You're in control. Nothing is shared until you book the appointment.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.66}
        className="mt-auto"
      >
        <button
          type="button"
          onClick={onContinue}
          className={`flex min-h-[50px] w-full items-center justify-center gap-2 rounded bg-sage px-4 text-[16px] font-semibold leading-5 text-[#fefaf4] transition-colors hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${paperShadow}`}
        >
          Continue to booking
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={1.7} />
        </button>
      </motion.div>

      <PrototypeSheet title={sheetTitle} onClose={() => setSheetTitle(null)} />
    </section>
  )
}

function PrototypeSheet({
  title,
  onClose,
}: {
  title: string | null
  onClose: () => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {title ? (
        <motion.div
          className="absolute inset-0 z-20 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/24"
            aria-label="Close prototype edit sheet"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="prototype-sheet-title"
            className={`relative w-full rounded-t-[24px] bg-[#fefaf4] p-5 ${paperShadow}`}
            initial={reduceMotion ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.95 }}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#e5e0d6]" />
            <p className="text-xs font-semibold uppercase text-sage-deep">
              Prototype control
            </p>
            <h2 id="prototype-sheet-title" className="mt-2 text-xl font-semibold leading-7">
              {title}
            </h2>
            <p className="mt-3 text-sm font-medium leading-5 text-[#5a5a55]">
              Editing is not enabled in this prototype, but this is where the
              section review would happen.
            </p>
            <button
              type="button"
              onClick={onClose}
              className={`mt-5 min-h-[48px] w-full rounded bg-sage px-4 text-[15px] font-semibold leading-5 text-[#fefaf4] ${paperShadow}`}
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
