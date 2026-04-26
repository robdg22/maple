import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Card } from '../components/Card'
import { scenario } from '../data/scenario'
import type { BookingSlotId } from '../hooks/useScenarioState'

type BookingSlot = (typeof scenario.booking.slots)[number]

type BookingScreenProps = {
  onSelectSlot: (slotId: NonNullable<BookingSlotId>) => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const snappySpring = { type: 'spring', stiffness: 400, damping: 30, mass: 0.5 } as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
}

export function BookingScreen({ onSelectSlot }: BookingScreenProps) {
  const reduceMotion = useReducedMotion()
  const [selectedSlotId, setSelectedSlotId] = useState<BookingSlotId>(null)

  function chooseSlot(slot: BookingSlot) {
    setSelectedSlotId(slot.id)
    window.setTimeout(() => onSelectSlot(slot.id), reduceMotion ? 0 : 180)
  }

  return (
    <section className="flex min-h-full flex-col gap-5">
      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <p className="mb-3 text-xs font-semibold uppercase text-sage-deep">
          Booking
        </p>
        <h1 className="text-[30px] font-bold leading-[1.1]">GP appointments</h1>
        <p className="mt-2 text-[16px] font-semibold text-ink-soft">
          Same- or next-day, near you
        </p>
      </motion.div>

      <div className="grid gap-3">
        {scenario.booking.slots.map((slot, index) => {
          const isSelected = selectedSlotId === slot.id

          return (
            <motion.button
              key={slot.id}
              type="button"
              variants={fadeUp}
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
              custom={reduceMotion ? 0 : 0.12 + index * 0.07}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={snappySpring}
              onClick={() => chooseSlot(slot)}
              className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              <Card
                variant="base"
                className={[
                  'p-4 transition-colors',
                  isSelected ? 'border-sage bg-sage-soft' : 'hover:border-sage',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-sage-deep">
                      {slot.day}
                    </p>
                    <p className="mt-1 text-[26px] font-bold leading-8 text-ink">
                      {slot.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-ink-soft">
                    {slot.distance}
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{slot.clinician}</p>
                <p className="mt-1 text-sm leading-5 text-ink-soft">{slot.clinic}</p>
              </Card>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        type="button"
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.4}
        className="w-fit text-sm font-semibold text-sage-deep underline decoration-sage/40 underline-offset-4"
      >
        Show more times
      </motion.button>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.48}
        className="mt-auto"
      >
        <Card variant="soft" className="p-4 text-sm font-medium leading-5 text-sage-deep">
          Your care brief will be sent to your GP automatically when you book.
        </Card>
      </motion.div>
    </section>
  )
}
