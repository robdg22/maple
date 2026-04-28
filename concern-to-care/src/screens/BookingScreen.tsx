import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar01Icon,
  Clock01Icon,
  FileVerifiedIcon,
  Location01Icon,
} from '@hugeicons/core-free-icons'
import {
  CareCard,
  CareEyebrow,
  CareScreen,
  SummaryBar,
  careShadow,
  careSpring,
} from '../components/CareScreen'
import { scenario } from '../data/scenario'
import type { BookingSlotId } from '../hooks/useScenarioState'

type BookingSlot = (typeof scenario.booking.slots)[number]

type BookingScreenProps = {
  onBack: () => void
  onSelectSlot: (slotId: NonNullable<BookingSlotId>) => void
}

export function BookingScreen({ onBack, onSelectSlot }: BookingScreenProps) {
  const reduceMotion = useReducedMotion()
  const [selectedSlotId, setSelectedSlotId] = useState<BookingSlotId>(null)

  function chooseSlot(slot: BookingSlot) {
    setSelectedSlotId(slot.id)
    window.setTimeout(() => onSelectSlot(slot.id), reduceMotion ? 0 : 180)
  }

  return (
    <CareScreen title="Booking" onBack={onBack} className="items-center gap-10">
      <SummaryBar />

      <section className="flex w-full flex-col gap-5">
        <CareEyebrow icon={Calendar01Icon}>GP appointments</CareEyebrow>
        <div>
          <h1 className="text-[32px] font-semibold leading-[1.08] tracking-normal text-[#1a1a1a]">
            Same- or next-day, near you
          </h1>
          <p className="mt-3 text-[16px] font-medium leading-5 text-[#8a8a8a]">
            Choose a time. Your care brief will be attached automatically.
          </p>
        </div>
      </section>

      <div className="grid w-full gap-3">
        {scenario.booking.slots.map((slot, index) => {
          const isSelected = selectedSlotId === slot.id

          return (
            <motion.button
              key={slot.id}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...careSpring, delay: reduceMotion ? 0 : index * 0.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              onClick={() => chooseSlot(slot)}
              className={[
                `rounded-xl p-4 text-left transition-colors ${careShadow}`,
                isSelected ? 'bg-[#7a9e94] text-white' : 'bg-white text-[#1a1a1a]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={[
                      'text-[14px] font-semibold uppercase leading-[18px]',
                      isSelected ? 'text-white/80' : 'text-[#7a9e94]',
                    ].join(' ')}
                  >
                    {slot.day}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[32px] font-semibold leading-[1.08]">
                    <HugeiconsIcon icon={Clock01Icon} size={22} strokeWidth={1.7} />
                    {slot.time}
                  </p>
                </div>
                <span
                  className={[
                    'rounded px-3 py-1 text-sm font-semibold',
                    isSelected
                      ? 'bg-white/15 text-white'
                      : 'bg-[#f7f4ee] text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]',
                  ].join(' ')}
                >
                  {slot.distance}
                </span>
              </div>
              <p className="mt-3 text-[16px] font-semibold leading-5">{slot.clinician}</p>
              <p
                className={[
                  'mt-1 flex items-center gap-2 text-[16px] font-medium leading-5',
                  isSelected ? 'text-white/85' : 'text-[#8a8a8a]',
                ].join(' ')}
              >
                <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={1.7} />
                {slot.clinic}
              </p>
            </motion.button>
          )
        })}
      </div>

      <button
        type="button"
        className="w-fit text-[16px] font-semibold leading-5 text-[#7a9e94] decoration-dotted underline underline-offset-4"
      >
        Show more times
      </button>

      <CareCard tone="muted">
        <div className="flex gap-3 text-[16px] font-medium leading-5 text-[#7a9e94]">
          <HugeiconsIcon icon={FileVerifiedIcon} size={24} strokeWidth={1.7} />
          <p>Your care brief will be sent to your GP automatically when you book.</p>
        </div>
      </CareCard>
    </CareScreen>
  )
}
