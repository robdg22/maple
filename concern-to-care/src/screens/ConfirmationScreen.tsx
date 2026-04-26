import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { scenario } from '../data/scenario'
import type { BookingSlotId } from '../hooks/useScenarioState'

type ConfirmationScreenProps = {
  selectedSlotId: BookingSlotId
  onRestart: () => void
}

const settleSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.1 } as const
const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
}

export function ConfirmationScreen({
  selectedSlotId,
  onRestart,
}: ConfirmationScreenProps) {
  const reduceMotion = useReducedMotion()
  const slot =
    scenario.booking.slots.find((bookingSlot) => bookingSlot.id === selectedSlotId) ??
    scenario.booking.slots[0]

  return (
    <section className="flex min-h-full flex-col justify-center gap-5 py-6 text-center">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute h-24 w-24 rounded-full bg-sage-soft"
          initial={reduceMotion ? false : { opacity: 0.7, scale: 0.5 }}
          animate={reduceMotion ? { opacity: 0.7 } : { opacity: 0, scale: 1.75 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
          aria-hidden="true"
        />
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-sage text-white shadow-card"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={settleSpring}
        >
          <svg
            viewBox="0 0 32 32"
            className="h-10 w-10"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="m8 16.5 5.1 5.1L24.5 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.22 }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.72}
      >
        <h1 className="text-[32px] font-bold leading-[1.08]">You're booked</h1>
        <p className="mt-3 text-[15px] leading-6 text-ink-soft">
          {slot.clinician} will have your care brief before the appointment.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.86}
      >
        <Card variant="elevated" className="mx-auto max-w-[300px] p-5 text-center">
          <p className="text-xs font-semibold uppercase text-sage-deep">
            {slot.day}
          </p>
          <p className="mt-1 text-[28px] font-bold leading-8 text-ink">
            {slot.time}
          </p>
          <div className="mt-4 space-y-1 text-sm leading-5 text-ink-soft">
            <p className="font-bold text-ink">{slot.clinician}</p>
            <p>{slot.clinic}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 1}
        className="grid grid-cols-2 gap-3"
      >
        <Button type="button" variant="secondary" className="px-3">
          Add to calendar
        </Button>
        <Button type="button" variant="secondary" className="px-3">
          How to prepare
        </Button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 1.12}
        className="space-y-4"
      >
        <p className="text-sm leading-5 text-ink-soft">
          We'll check in with you afterwards to see how it went.
        </p>
        <Button type="button" onClick={onRestart} className="w-full">
          Restart demo
        </Button>
      </motion.div>
    </section>
  )
}
