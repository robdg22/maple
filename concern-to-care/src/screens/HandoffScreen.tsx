import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Add01Icon,
  Edit03Icon,
  FileVerifiedIcon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import {
  CareButton,
  CareCard,
  CareEyebrow,
  CareScreen,
  SummaryBar,
  careShadow,
} from '../components/CareScreen'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type HandoffScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onBack: () => void
  onContinue: () => void
}

const editActions = [
  { label: 'Edit any section', icon: Edit03Icon },
  { label: 'Add something we missed', icon: Add01Icon },
  { label: 'Remove the brief and start fresh', icon: RefreshIcon },
] as const

export function HandoffScreen({
  selectedAnswer,
  onBack,
  onContinue,
}: HandoffScreenProps) {
  const [sheetTitle, setSheetTitle] = useState<string | null>(null)

  return (
    <CareScreen title="Care brief" onBack={onBack} className="items-center gap-10">
      <SummaryBar />

      <section className="flex w-full flex-col gap-5">
        <CareEyebrow icon={FileVerifiedIcon}>What we’ll share</CareEyebrow>
        <div>
          <h1 className="text-[32px] font-semibold leading-[1.08] tracking-normal text-[#1a1a1a]">
            Review your GP brief
          </h1>
          <p className="mt-3 text-[16px] font-medium leading-5 text-[#8a8a8a]">
            Nothing is shared until you book. You can edit anything first.
          </p>
        </div>
      </section>

      <CareCard className="p-0">
        <div className="flex items-center justify-between bg-[#7a9e94] px-4 py-3 text-white">
          <div>
            <p className="text-[14px] font-semibold uppercase leading-[18px] opacity-80">
              Prepared for GP review
            </p>
            <p className="text-[16px] font-semibold leading-5">Editable before booking</p>
          </div>
          <time className="font-mono text-xs opacity-85">{scenario.handoff.date}</time>
        </div>

        <div className="divide-y divide-[#e5e0d6]">
          {scenario.handoff.sections.map((section) => (
            <section key={section.title} className="px-4 py-3">
              <h2 className="text-[14px] font-semibold uppercase leading-[18px] text-[#8a8a8a]">
                {section.title}
              </h2>
              <p className="mt-2 text-[16px] font-medium leading-5 text-[#5a5a55]">
                {section.body}
              </p>
              {section.title === 'Symptom summary' ? (
                <p className="mt-2 w-fit rounded bg-[#f7f4ee] px-2 py-1 text-sm font-semibold text-[#7a9e94] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]">
                  Clarifying answer: {selectedAnswer ?? 'Not recorded'}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </CareCard>

      <div className="grid w-full gap-2">
        {editActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => setSheetTitle(action.label)}
            className={`flex h-11 items-center justify-between rounded bg-white px-3 text-left text-[16px] font-semibold leading-5 text-[#5a5a55] transition-colors hover:bg-[#f7f4ee] ${careShadow}`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <CareEyebrow icon={action.icon} tone="muted">
                <span className="normal-case">{action.label}</span>
              </CareEyebrow>
            </span>
          </button>
        ))}
      </div>

      <CareButton onClick={onContinue} className="w-[calc(100%-32px)]">
        Continue to booking
      </CareButton>

      <PrototypeSheet title={sheetTitle} onClose={() => setSheetTitle(null)} />
    </CareScreen>
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
          className="absolute inset-0 z-40 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#1a1a1a]/24"
            aria-label="Close prototype edit sheet"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="prototype-sheet-title"
            className={`relative w-full rounded-t-[24px] bg-[#fcfaf6] p-5 ${careShadow}`}
            initial={reduceMotion ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.95 }}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#e5e0d6]" />
            <p className="text-[14px] font-semibold uppercase leading-[18px] text-[#7a9e94]">
              Prototype control
            </p>
            <h2 id="prototype-sheet-title" className="mt-2 text-xl font-semibold leading-7">
              {title}
            </h2>
            <p className="mt-3 text-[16px] font-medium leading-5 text-[#8a8a8a]">
              Editing is not enabled in this prototype, but this is where the
              section review would happen.
            </p>
            <CareButton onClick={onClose} className="mt-5 w-full">
              Got it
            </CareButton>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
