import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  AmbulanceIcon,
  ArrowLeft01Icon,
  Clock01Icon,
  ConstellationIcon,
  Edit03Icon,
  Stethoscope02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { ParticleCloudCanvas } from '../components/ParticleCloudCanvas'
import { scenario } from '../data/scenario'
import type { TextBoxTransitionRect } from '../types/transitions'

type StructuredRow = (typeof scenario.structuredSummary)[number]

type StructureScreenProps = {
  concernText: string
  transitionTextBoxRect?: TextBoxTransitionRect | null
  onBack: () => void
  onContinue: () => void
}

type CareBriefRow = StructuredRow & {
  icon: IconSvgElement
}

const LOADER_DURATION = 4000
const ROW_REVEAL_INTERVAL = 320
const CARE_GUIDE_QUOTE_TOP = 78

const cardTransition = {
  duration: 0.6,
  ease: [0.215, 0.61, 0.355, 1],
} as const

const quoteTransition = {
  duration: 0.56,
  ease: [0.645, 0.045, 0.355, 1],
} as const

const headerTransition = {
  duration: 0.3,
  ease: [0.215, 0.61, 0.355, 1],
} as const

const rowTransition = {
  duration: 0.42,
  ease: [0.23, 1, 0.32, 1],
} as const

const rowIcons = [
  Stethoscope02Icon,
  ConstellationIcon,
  Clock01Icon,
  ViewIcon,
] satisfies IconSvgElement[]

export function StructureScreen({
  concernText,
  transitionTextBoxRect,
  onBack,
  onContinue,
}: StructureScreenProps) {
  const reduceMotion = useReducedMotion()
  const [isLoading, setIsLoading] = useState(true)
  const [visibleRowCount, setVisibleRowCount] = useState(0)
  const displayedConcern = concernText.trim() || scenario.concern

  const careBriefRows = useMemo<CareBriefRow[]>(
    () =>
      scenario.structuredSummary.map((row, index) => ({
        ...row,
        icon: rowIcons[index] ?? Stethoscope02Icon,
      })),
    [],
  )
  const briefComplete = !isLoading && visibleRowCount === careBriefRows.length

  useEffect(() => {
    const loaderTimer = window.setTimeout(
      () => setIsLoading(false),
      reduceMotion ? 200 : LOADER_DURATION,
    )

    return () => window.clearTimeout(loaderTimer)
  }, [reduceMotion])

  useEffect(() => {
    if (isLoading) {
      setVisibleRowCount(0)
      return undefined
    }

    if (reduceMotion) {
      setVisibleRowCount(careBriefRows.length)
      return undefined
    }

    let nextRow = 0
    let revealTimer: number | undefined

    const revealNextRow = () => {
      nextRow += 1
      setVisibleRowCount(nextRow)

      if (nextRow < careBriefRows.length) {
        revealTimer = window.setTimeout(revealNextRow, ROW_REVEAL_INTERVAL)
      }
    }

    revealTimer = window.setTimeout(revealNextRow, 460)

    return () => {
      if (revealTimer) {
        window.clearTimeout(revealTimer)
      }
    }
  }, [careBriefRows.length, isLoading, reduceMotion])

  return (
    <section className="relative h-full overflow-hidden bg-[#f7f4ee] text-ink">
      <CareGuideHeader onBack={onBack} reduceMotion={Boolean(reduceMotion)} />

      <main className="scrollbar-none absolute inset-x-0 bottom-[134px] top-[66px] overflow-y-auto pb-8 pt-3">
        <div className="relative z-10 px-4">
          <ConcernQuote
            concernText={displayedConcern}
            reduceMotion={Boolean(reduceMotion)}
            transitionTextBoxRect={transitionTextBoxRect}
          />

          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.article
                key="care-brief"
                className="mt-10 rounded bg-[#fefaf4] p-4 shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]"
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={cardTransition}
              >
                <h2 className="text-xl leading-6 text-ink">Care brief</h2>

                <div className="mt-5">
                  <AnimatePresence initial={false}>
                    {careBriefRows.slice(0, visibleRowCount).map((row, index) => (
                      <CareBriefField
                        key={row.label}
                        row={row}
                        showDivider={index < visibleRowCount - 1}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loader"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[376px] overflow-hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.58,
                delay: reduceMotion ? 0 : 0.16,
                ease: 'easeOut',
              }}
            >
              <DitherLoader />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <CareGuideFooter canContinue={briefComplete} onContinue={onContinue} />
    </section>
  )
}

function CareGuideHeader({
  onBack,
  reduceMotion,
}: {
  onBack: () => void
  reduceMotion: boolean
}) {
  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-10 grid h-[66px] grid-cols-[24px_1fr_24px] items-center px-4 py-2.5"
      initial={reduceMotion ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={headerTransition}
    >
      <motion.button
        type="button"
        onClick={onBack}
        className="-ml-1 flex h-8 w-8 items-center justify-center text-ink"
        aria-label="Go back"
        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...headerTransition, delay: reduceMotion ? 0 : 0.08 }}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} strokeWidth={1.7} />
      </motion.button>
      <h1 className="text-center text-xl leading-6 text-sage">Care guide</h1>
      <span aria-hidden="true" />
    </motion.header>
  )
}

function ConcernQuote({
  concernText,
  reduceMotion,
  transitionTextBoxRect,
}: {
  concernText: string
  reduceMotion: boolean
  transitionTextBoxRect?: TextBoxTransitionRect | null
}) {
  const initialY = transitionTextBoxRect
    ? transitionTextBoxRect.top - CARE_GUIDE_QUOTE_TOP
    : 12

  return (
    <section className="relative z-10 pt-0">
      <motion.div
        className="rounded bg-white p-4 text-[14px] font-medium leading-[18px] text-[#8a8a8a] shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)] [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]"
        initial={
          reduceMotion
            ? false
            : {
                opacity: transitionTextBoxRect ? 1 : 0,
                y: initialY,
                backgroundColor: '#ffffff',
                borderRadius: 8,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          backgroundColor: '#ffffff',
          borderRadius: 4,
        }}
        transition={quoteTransition}
      >
        &ldquo;{concernText}&rdquo;
      </motion.div>
    </section>
  )
}

function DitherLoader() {
  return (
    <ParticleCloudCanvas
      cloudTime={3800}
      coalesceTime={4000}
      holdTime={1200}
      disperseTime={2000}
      pulseRate={0.6}
      pulseAmount={0.3}
      pulseSharpness={0.2}
      pulseRectDamping={0.75}
      speed={1.2}
      distance={0.5}
      rotation={0.75}
      wobble={1.1}
      spread={150}
      tightness={0.9}
      rectWidth={0.82}
      rectHeight={1.2}
      count={900}
      size={2.6}
      darkness={0.36}
      bgColor="#F7F4EE"
      particleColor="#EFEAE1"
      className="absolute inset-x-0 bottom-0 block h-[376px] w-full"
    />
  )
}

function CareBriefField({
  row,
  showDivider,
}: {
  row: CareBriefRow
  showDivider: boolean
}) {
  return (
    <motion.div
      className="overflow-hidden"
      initial={{ opacity: 0, maxHeight: 0, y: 10 }}
      animate={{ opacity: 1, maxHeight: 140, y: 0 }}
      exit={{ opacity: 0, maxHeight: 0, y: -2 }}
      transition={rowTransition}
    >
      <motion.button
        type="button"
        className="flex min-h-[47px] w-full items-start justify-between gap-4 text-left"
        aria-label={`Edit ${row.label}: ${row.value}`}
      >
        <span className="flex min-w-0 gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#8a8a8a]">
            <HugeiconsIcon icon={row.icon} size={20} strokeWidth={1.6} />
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-medium uppercase leading-[17px] text-[#8a8a8a]">
              {row.label}
            </span>
            <span className="mt-1 block text-[16px] font-medium leading-[20px] text-[#5a5a55]">
              {row.value}
            </span>
          </span>
        </span>
        <span className="mt-[23px] flex h-5 w-5 shrink-0 items-center justify-center text-[#8a8a8a]">
          <HugeiconsIcon icon={Edit03Icon} size={20} strokeWidth={1.6} />
        </span>
      </motion.button>

      {showDivider ? <div className="my-3 h-px w-full bg-[#e5e0d6]" /> : null}
    </motion.div>
  )
}

function CareGuideFooter({
  canContinue,
  onContinue,
}: {
  canContinue: boolean
  onContinue: () => void
}) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 flex h-[134px] flex-col gap-3 bg-[#f7f4ee]/95 px-4 pb-4 pt-2.5 shadow-[0_-1px_0_rgb(0_0_0_/_8%)] backdrop-blur">
      <AnimatePresence initial={false}>
        {canContinue ? (
          <motion.button
            key="continue"
            type="button"
            onClick={onContinue}
            className="h-[50px] w-full rounded bg-sage px-4 text-[16px] font-semibold leading-5 text-[#fefaf4] shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)] transition-colors hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
          >
            Continue
          </motion.button>
        ) : (
          <motion.div
            key="waiting"
            className="flex h-[50px] items-center justify-center rounded bg-[#efeae1] text-[14px] font-medium leading-5 text-[#8a8a8a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Preparing your next step...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-11 items-center justify-between">
        <div className="flex items-center gap-2 text-ink">
          <HugeiconsIcon icon={AmbulanceIcon} size={22} strokeWidth={1.7} />
          <span className="text-[15px] font-medium leading-5">Need urgent help?</span>
        </div>
        <button
          type="button"
          className="h-9 rounded bg-[#fefaf4] px-3 text-[14px] font-semibold leading-5 text-sage-deep shadow-[0_0_0_1px_rgb(0_0_0_/_10%)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          Get help now
        </button>
      </div>
    </footer>
  )
}
