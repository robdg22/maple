import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { scenario } from '../data/scenario'

type StructuredRow = (typeof scenario.structuredSummary)[number]

type StructureScreenProps = {
  concernText: string
  onComplete: () => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
}

const summaryVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
}

const rowVariants: Variants = {
  hidden: {},
  visible: (index = 0) => ({
    transition: {
      delayChildren: 0.18 + index * 0.08,
      staggerChildren: 0.04,
    },
  }),
}

const rowPartVariants: Variants = {
  hidden: { opacity: 0, x: -4 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 },
  },
}

export function StructureScreen({
  concernText,
  onComplete,
}: StructureScreenProps) {
  const reduceMotion = useReducedMotion()
  const [editingRow, setEditingRow] = useState<StructuredRow | null>(null)
  const [draftValue, setDraftValue] = useState('')

  function openEditor(row: StructuredRow) {
    setEditingRow(row)
    setDraftValue(row.value)
  }

  function closeEditor() {
    setEditingRow(null)
    setDraftValue('')
  }

  return (
    <section className="flex min-h-full flex-col gap-3">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
      >
        <Card
          variant="soft"
          className="line-clamp-1 p-3 text-sm leading-5 text-ink-soft"
        >
          <span className="mr-1 text-sage-deep" aria-hidden="true">
            &ldquo;
          </span>
          {concernText}
        </Card>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        className="text-[25px] font-bold leading-[1.14]"
      >
        Here's what we understood
      </motion.h1>

      <motion.div
        variants={summaryVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <Card variant="elevated" className="overflow-hidden p-0">
          <div className="divide-y divide-line">
            {scenario.structuredSummary.map((row, index) => (
              <SummaryRow
                key={row.label}
                row={row}
                index={index}
                reduceMotion={Boolean(reduceMotion)}
                onEdit={() => openEditor(row)}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduceMotion ? 0 : 0.62 }}
      >
        <Card variant="soft" className="p-3 text-xs font-medium leading-5 text-sage-deep">
          Tap any row to correct what we understood.
        </Card>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduceMotion ? 0 : 0.9 }}
        className="pt-1"
      >
        <Button type="button" className="w-full" onClick={onComplete}>
          Continue
        </Button>
      </motion.div>

      <EditSheet
        row={editingRow}
        draftValue={draftValue}
        onDraftChange={setDraftValue}
        onClose={closeEditor}
      />
    </section>
  )
}

function SummaryRow({
  row,
  index,
  reduceMotion,
  onEdit,
}: {
  row: StructuredRow
  index: number
  reduceMotion: boolean
  onEdit: () => void
}) {
  return (
    <motion.button
      type="button"
      variants={rowVariants}
      custom={index}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      onClick={onEdit}
      className="flex min-h-[56px] w-full items-center justify-between gap-4 bg-surface px-4 py-2.5 text-left transition-colors hover:bg-surface-soft/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sage"
      aria-label={`Edit ${row.label}: ${row.value}`}
    >
      <span className="min-w-0">
        <motion.span
          variants={rowPartVariants}
          className="block text-[11px] font-semibold uppercase leading-4 text-sage-deep"
        >
          {row.label}
        </motion.span>
        <motion.span
          variants={rowPartVariants}
          className="block text-[15px] font-semibold leading-5 text-ink"
        >
          {row.value}
        </motion.span>
      </span>
      <motion.span
        variants={rowPartVariants}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted"
        aria-hidden="true"
      >
        <PencilIcon />
      </motion.span>
    </motion.button>
  )
}

function EditSheet({
  row,
  draftValue,
  onDraftChange,
  onClose,
}: {
  row: StructuredRow | null
  draftValue: string
  onDraftChange: (value: string) => void
  onClose: () => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {row ? (
        <motion.div
          className="absolute inset-0 z-20 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/24"
            aria-label="Close edit sheet"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-sheet-title"
            className="relative w-full rounded-t-[28px] border border-line bg-surface p-5 shadow-card"
            initial={reduceMotion ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.95 }}
            drag={reduceMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.28 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 520) {
                onClose()
              }
            }}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-line" />
            <p className="text-xs font-semibold uppercase text-sage-deep">
              Edit understanding
            </p>
            <h2 id="edit-sheet-title" className="mt-2 text-xl font-bold leading-7">
              {row.label}
            </h2>
            <label className="mt-5 block text-sm font-semibold text-ink-soft">
              What should this say?
              <input
                value={draftValue}
                onChange={(event) => onDraftChange(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-surface-soft px-4 text-[16px] font-semibold text-ink outline-none transition-colors focus:border-sage"
              />
            </label>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={onClose}>
                Save
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function PencilIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
