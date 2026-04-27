import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CalendarAdd01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  FileVerifiedIcon,
  Stethoscope02Icon,
} from '@hugeicons/core-free-icons'
import { scenario } from '../data/scenario'
import type { BookingSlotId } from '../hooks/useScenarioState'

type ConfirmationScreenProps = {
  selectedSlotId: BookingSlotId
  onRestart: () => void
}

const settleSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.1 } as const
const spring = { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 } as const
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

export function ConfirmationScreen({
  selectedSlotId,
  onRestart,
}: ConfirmationScreenProps) {
  const reduceMotion = useReducedMotion()
  const slot =
    scenario.booking.slots.find((bookingSlot) => bookingSlot.id === selectedSlotId) ??
    scenario.booking.slots[0]

  return (
    <section className="flex min-h-full flex-col gap-5 bg-[#f7f4ee] py-4 text-ink">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute h-24 w-24 rounded bg-sage-soft"
          initial={reduceMotion ? false : { opacity: 0.7, scale: 0.5 }}
          animate={reduceMotion ? { opacity: 0.7 } : { opacity: 0, scale: 1.65 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
          aria-hidden="true"
        />
        <motion.div
          className={`relative flex h-20 w-20 items-center justify-center rounded bg-sage text-[#fefaf4] ${paperShadow}`}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={settleSpring}
        >
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={44} strokeWidth={1.8} />
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.34}
        className="text-center"
      >
        <p className="mb-3 text-xs font-semibold uppercase text-sage-deep">
          Appointment confirmed
        </p>
        <h1 className="text-[32px] font-semibold leading-[1.08] text-[#5a5a55]">
          You're booked
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] text-[15px] font-medium leading-6 text-[#5a5a55]">
          {slot.clinician} will have your care brief before the appointment.
        </p>
      </motion.div>

      <motion.article
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.46}
        className={`rounded bg-[#fefaf4] p-5 ${paperShadow}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-sage-deep">
              {slot.day}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[29px] font-semibold leading-8 text-ink">
              <HugeiconsIcon icon={Clock01Icon} size={22} strokeWidth={1.7} />
              {slot.time}
            </p>
          </div>
          <HugeiconsIcon icon={Stethoscope02Icon} size={28} strokeWidth={1.7} />
        </div>
        <div className="mt-4 border-t border-[#e5e0d6] pt-4 text-sm font-medium leading-5 text-[#5a5a55]">
          <p className="font-semibold text-ink">{slot.clinician}</p>
          <p className="mt-1">{slot.clinic}</p>
        </div>
      </motion.article>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.58}
        className="grid grid-cols-2 gap-3"
      >
        <button
          type="button"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded bg-white px-3 text-sm font-semibold text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] transition-colors hover:bg-[#fefaf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
        >
          <HugeiconsIcon icon={CalendarAdd01Icon} size={18} strokeWidth={1.7} />
          Add to calendar
        </button>
        <button
          type="button"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded bg-white px-3 text-sm font-semibold text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] transition-colors hover:bg-[#fefaf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
        >
          <HugeiconsIcon icon={FileVerifiedIcon} size={18} strokeWidth={1.7} />
          How to prepare
        </button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        custom={reduceMotion ? 0 : 0.7}
        className="mt-auto space-y-4"
      >
        <p className="rounded bg-[#fefaf4] p-4 text-center text-sm font-medium leading-5 text-sage-deep shadow-[0_0_0_1px_rgb(0_0_0_/_10%)]">
          We'll check in with you afterwards to see how it went.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className={`min-h-[50px] w-full rounded bg-sage px-4 text-[16px] font-semibold leading-5 text-[#fefaf4] transition-colors hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${paperShadow}`}
        >
          Restart demo
        </button>
      </motion.div>
    </section>
  )
}
