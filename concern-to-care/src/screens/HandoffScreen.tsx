import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type HandoffScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onContinue: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const settleSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.1 } as const

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
    <section className="flex min-h-full flex-col gap-4">
      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <p className="mb-3 text-xs font-semibold uppercase text-sage-deep">
          Handoff
        </p>
        <h1 className="text-[27px] font-bold leading-[1.12]">
          What we'll share with your GP
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-ink-soft">
          Your GP will see this before your appointment so you don't have to
          explain it again.
        </p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={settleSpring}
      >
        <Card variant="elevated" className="overflow-hidden p-0">
          <div className="flex items-center justify-between bg-sage-deep px-4 py-3 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase opacity-80">
                Care brief
              </p>
              <p className="text-sm font-bold">Prepared for GP review</p>
            </div>
            <time className="font-mono text-xs opacity-85">
              {scenario.handoff.date}
            </time>
          </div>
          <div className="divide-y divide-line bg-surface">
            {scenario.handoff.sections.map((section, index) => (
              <motion.section
                key={section.title}
                variants={sectionVariants}
                custom={reduceMotion ? 0 : index}
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                className="px-4 py-3"
              >
                <h2 className="border-b border-line pb-1 text-[11px] font-bold uppercase text-sage-deep">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-5 text-ink">{section.body}</p>
                {section.title === 'Symptom summary' ? (
                  <p className="mt-2 text-xs font-semibold text-ink-soft">
                    Clarifying answer: {selectedAnswer ?? 'Not recorded'}
                  </p>
                ) : null}
              </motion.section>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.46}
        className="grid gap-2"
      >
        {['Edit any section', 'Add something we missed', 'Remove the brief and start fresh'].map(
          (label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSheetTitle(label)}
              className="flex min-h-10 items-center justify-between rounded-button border border-line bg-surface px-3 text-left text-sm font-semibold text-ink-soft transition-colors hover:border-sage hover:text-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
            >
              <span>{label}</span>
              <ChevronIcon />
            </button>
          ),
        )}
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
        <Button type="button" onClick={onContinue} className="w-full">
          Continue to booking
        </Button>
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
            className="relative w-full rounded-t-[28px] border border-line bg-surface p-5 shadow-card"
            initial={reduceMotion ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.95 }}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-line" />
            <p className="text-xs font-semibold uppercase text-sage-deep">
              Prototype control
            </p>
            <h2 id="prototype-sheet-title" className="mt-2 text-xl font-bold leading-7">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-5 text-ink-soft">
              Editing is not enabled in this prototype, but this is where the
              section review would happen.
            </p>
            <Button type="button" onClick={onClose} className="mt-5 w-full">
              Got it
            </Button>
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
      className="h-4 w-4"
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
