import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar01Icon,
  Clock01Icon,
  FileVerifiedIcon,
  Location01Icon,
} from '@hugeicons/core-free-icons'
import { scenario } from '../data/scenario'
import type { BookingSlotId } from '../hooks/useScenarioState'

type BookingSlot = (typeof scenario.booking.slots)[number]

type BookingScreenProps = {
  onSelectSlot: (slotId: NonNullable<BookingSlotId>) => void
}

const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
const snappySpring = { type: 'spring', stiffness: 400, damping: 30, mass: 0.5 } as const
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

export function BookingScreen({ onSelectSlot }: BookingScreenProps) {
  const reduceMotion = useReducedMotion()
  const [selectedSlotId, setSelectedSlotId] = useState<BookingSlotId>(null)

  function chooseSlot(slot: BookingSlot) {
    setSelectedSlotId(slot.id)
    window.setTimeout(() => onSelectSlot(slot.id), reduceMotion ? 0 : 180)
  }

  return (
    <section className="flex min-h-full flex-col gap-5 bg-[#f7f4ee] text-ink">
      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="mb-3 flex items-center gap-2 text-sage-deep">
          <HugeiconsIcon icon={Calendar01Icon} size={20} strokeWidth={1.7} />
          <p className="text-xs font-semibold uppercase">Booking</p>
        </div>
        <h1 className="text-[30px] font-semibold leading-[1.08] text-[#5a5a55]">
          GP appointments
        </h1>
        <p className="mt-2 text-[16px] font-semibold text-[#5a5a55]">
          Same- or next-day, near you
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.1}
        className={`rounded bg-white p-4 text-[14px] font-medium leading-[18px] text-[#8a8a8a] ${paperShadow} [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]`}
      >
        {scenario.recommendation.summary}
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
              custom={reduceMotion ? 0 : 0.18 + index * 0.07}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={snappySpring}
              onClick={() => chooseSlot(slot)}
              className={[
                `rounded p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${paperShadow}`,
                isSelected ? 'bg-sage text-[#fefaf4]' : 'bg-[#fefaf4] text-ink hover:bg-white',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={[
                      'text-xs font-semibold uppercase',
                      isSelected ? 'text-[#fefaf4]/80' : 'text-sage-deep',
                    ].join(' ')}
                  >
                    {slot.day}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[27px] font-semibold leading-8">
                    <HugeiconsIcon icon={Clock01Icon} size={21} strokeWidth={1.7} />
                    {slot.time}
                  </p>
                </div>
                <span
                  className={[
                    'rounded px-3 py-1 text-xs font-semibold',
                    isSelected
                      ? 'bg-[#fefaf4]/15 text-[#fefaf4]'
                      : 'bg-white text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]',
                  ].join(' ')}
                >
                  {slot.distance}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold">{slot.clinician}</p>
              <p
                className={[
                  'mt-1 flex items-center gap-2 text-sm font-medium leading-5',
                  isSelected ? 'text-[#fefaf4]/85' : 'text-[#5a5a55]',
                ].join(' ')}
              >
                <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.7} />
                {slot.clinic}
              </p>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        type="button"
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.42}
        className="w-fit text-sm font-semibold text-sage-deep underline decoration-sage/40 underline-offset-4"
      >
        Show more times
      </motion.button>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.5}
        className="mt-auto rounded bg-[#fefaf4] p-4 text-sm font-medium leading-5 text-sage-deep shadow-[0_0_0_1px_rgb(0_0_0_/_10%)]"
      >
        <div className="flex gap-3">
          <HugeiconsIcon icon={FileVerifiedIcon} size={20} strokeWidth={1.7} />
          <p>Your care brief will be sent to your GP automatically when you book.</p>
        </div>
      </motion.div>
    </section>
  )
}
