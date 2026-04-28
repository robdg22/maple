import { motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CalendarAdd01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  FileVerifiedIcon,
  Stethoscope02Icon,
} from '@hugeicons/core-free-icons'
import {
  CareButton,
  CareCard,
  CareEyebrow,
  CareScreen,
  SummaryBar,
  careShadow,
  careSpring,
} from '../components/CareScreen'
import { scenario } from '../data/scenario'
import type { BookingSlotId } from '../hooks/useScenarioState'

type ConfirmationScreenProps = {
  selectedSlotId: BookingSlotId
  onBack: () => void
  onRestart: () => void
}

export function ConfirmationScreen({
  selectedSlotId,
  onBack,
  onRestart,
}: ConfirmationScreenProps) {
  const reduceMotion = useReducedMotion()
  const slot =
    scenario.booking.slots.find((bookingSlot) => bookingSlot.id === selectedSlotId) ??
    scenario.booking.slots[0]

  return (
    <CareScreen title="Confirmed" onBack={onBack} className="items-center gap-10">
      <SummaryBar />

      <section className="flex w-full flex-col items-center gap-5 text-center">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <motion.span
            className="absolute h-24 w-24 rounded-full bg-[#dce9e5]"
            initial={reduceMotion ? false : { opacity: 0.7, scale: 0.5 }}
            animate={reduceMotion ? { opacity: 0.7 } : { opacity: 0, scale: 1.65 }}
            transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
            aria-hidden="true"
          />
          <motion.div
            className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-[#7a9e94] text-white ${careShadow}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={careSpring}
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={44} strokeWidth={1.8} />
          </motion.div>
        </div>

        <div>
          <CareEyebrow icon={Stethoscope02Icon}>Appointment confirmed</CareEyebrow>
          <h1 className="mt-5 text-[32px] font-semibold leading-[1.08] tracking-normal text-[#1a1a1a]">
            You’re booked
          </h1>
          <p className="mx-auto mt-3 max-w-[300px] text-[16px] font-medium leading-5 text-[#8a8a8a]">
            {slot.clinician} will have your care brief before the appointment.
          </p>
        </div>
      </section>

      <CareCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold uppercase leading-[18px] text-[#7a9e94]">
              {slot.day}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[32px] font-semibold leading-[1.08] text-[#1a1a1a]">
              <HugeiconsIcon icon={Clock01Icon} size={22} strokeWidth={1.7} />
              {slot.time}
            </p>
          </div>
          <HugeiconsIcon icon={Stethoscope02Icon} size={28} strokeWidth={1.7} />
        </div>
        <div className="mt-4 border-t border-[#e5e0d6] pt-4 text-[16px] font-medium leading-5 text-[#8a8a8a]">
          <p className="font-semibold text-[#1a1a1a]">{slot.clinician}</p>
          <p className="mt-1">{slot.clinic}</p>
        </div>
      </CareCard>

      <div className="grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          className={`flex h-11 items-center justify-center gap-2 rounded bg-white px-3 text-sm font-semibold text-[#5a5a55] ${careShadow}`}
        >
          <HugeiconsIcon icon={CalendarAdd01Icon} size={18} strokeWidth={1.7} />
          Add to calendar
        </button>
        <button
          type="button"
          className={`flex h-11 items-center justify-center gap-2 rounded bg-white px-3 text-sm font-semibold text-[#5a5a55] ${careShadow}`}
        >
          <HugeiconsIcon icon={FileVerifiedIcon} size={18} strokeWidth={1.7} />
          How to prepare
        </button>
      </div>

      <CareCard tone="muted">
        <p className="text-center text-[16px] font-medium leading-5 text-[#7a9e94]">
          We’ll check in with you afterwards to see how it went.
        </p>
      </CareCard>

      <CareButton onClick={onRestart} className="w-[calc(100%-32px)]">
        Restart demo
      </CareButton>
    </CareScreen>
  )
}
