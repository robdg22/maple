import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  ConstellationIcon,
  Edit03Icon,
  Stethoscope02Icon,
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

const quoteTransition = {
  duration: 0.56,
  ease: [0.645, 0.045, 0.355, 1],
} as const

const headerTransition = {
  duration: 0.3,
  ease: [0.215, 0.61, 0.355, 1],
} as const

const rowTransition = {
  duration: 0.24,
  ease: [0.23, 1, 0.32, 1],
} as const

const summaryPanelTransition = {
  duration: 0.34,
  ease: [0.215, 0.61, 0.355, 1],
} as const

const rowIcons = [
  Stethoscope02Icon,
  ConstellationIcon,
  Clock01Icon,
  CheckmarkBadge01Icon,
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

    let nextRow = 1
    let revealTimer: number | undefined
    setVisibleRowCount(nextRow)

    const revealNextRow = () => {
      nextRow += 1
      setVisibleRowCount(nextRow)

      if (nextRow < careBriefRows.length) {
        revealTimer = window.setTimeout(revealNextRow, ROW_REVEAL_INTERVAL)
      }
    }

    revealTimer = window.setTimeout(revealNextRow, ROW_REVEAL_INTERVAL)

    return () => {
      if (revealTimer) {
        window.clearTimeout(revealTimer)
      }
    }
  }, [careBriefRows.length, isLoading, reduceMotion])

  return (
    <section className="relative h-full overflow-hidden bg-[#fcfaf6] text-ink">
      <SummaryHeader
        title="Summary"
        showHelp
        onBack={onBack}
        reduceMotion={Boolean(reduceMotion)}
      />

      <SummaryBody
        concernText={displayedConcern}
        careBriefRows={careBriefRows}
        visibleRowCount={visibleRowCount}
        isLoading={isLoading}
        briefComplete={briefComplete}
        reduceMotion={Boolean(reduceMotion)}
        transitionTextBoxRect={transitionTextBoxRect}
        onContinue={onContinue}
      />
    </section>
  )
}

function SummaryHeader({
  title,
  showHelp,
  onBack,
  reduceMotion,
}: {
  title: string
  showHelp?: boolean
  onBack: () => void
  reduceMotion: boolean
}) {
  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-30 grid h-[66px] grid-cols-[64px_1fr_88px] items-center bg-gradient-to-b from-[#fcfaf6] from-[70%] to-[#fcfaf600] px-4 py-2.5"
      initial={reduceMotion ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={headerTransition}
    >
      <motion.button
        type="button"
        onClick={onBack}
        className="-ml-1 flex size-8 items-center justify-center text-ink"
        aria-label="Go back"
        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...headerTransition, delay: reduceMotion ? 0 : 0.08 }}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} strokeWidth={1.7} />
      </motion.button>
      <h1 className="text-center text-[20px] font-semibold leading-5 text-[#1a1a1a]">
        {title}
      </h1>
      {showHelp ? (
        <button
          type="button"
          className="flex h-9 items-center justify-center whitespace-nowrap rounded border border-[#7a9e94] px-2 pb-1 pt-0.5 text-[16px] font-semibold leading-5 text-[#7a9e94] shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)]"
        >
          Get help
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </motion.header>
  )
}

function SummaryBody({
  concernText,
  careBriefRows,
  visibleRowCount,
  isLoading,
  briefComplete,
  reduceMotion,
  transitionTextBoxRect,
  onContinue,
}: {
  concernText: string
  careBriefRows: CareBriefRow[]
  visibleRowCount: number
  isLoading: boolean
  briefComplete: boolean
  reduceMotion: boolean
  transitionTextBoxRect?: TextBoxTransitionRect | null
  onContinue: () => void
}) {
  return (
    <motion.main
      className="scrollbar-none absolute inset-x-0 bottom-0 top-[66px] touch-pan-y overflow-y-scroll overscroll-contain px-4 pb-20 pt-4 [-webkit-overflow-scrolling:touch]"
    >
      <motion.div
        className="flex min-h-full flex-col items-center justify-end gap-4"
        layout={!reduceMotion}
        transition={summaryPanelTransition}
      >
        <motion.div layout={!reduceMotion} className="relative z-10 w-full px-2">
          <ConcernQuote
            concernText={concernText}
            reduceMotion={reduceMotion}
            transitionTextBoxRect={transitionTextBoxRect}
            quoted={false}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {!isLoading ? (
            <motion.p
              key="summary-guidance"
              className="w-full px-4 text-center text-[14px] font-medium leading-[18px] text-[#8a8a8a]"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            >
              <strong className="font-bold">This is what we&apos;ve understood.</strong>{' '}
              Tap to correct anything that looks off.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="relative flex w-full justify-center">
          {isLoading ? (
            <LoadingPanel reduceMotion={reduceMotion} />
          ) : (
            <SummaryCard
              careBriefRows={careBriefRows}
              visibleRowCount={visibleRowCount}
              reduceMotion={reduceMotion}
            />
          )}
        </div>

        {isLoading ? (
          <motion.p
            className="-mt-2 text-center text-[14px] font-bold leading-[18px] text-[#8a8a8a]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            Preparing your next step...
          </motion.p>
        ) : (
          <AnimatePresence initial={false}>
            <motion.button
              key="continue-button"
              type="button"
              disabled={!briefComplete}
              onClick={briefComplete ? onContinue : undefined}
              className="mx-auto h-9 w-[calc(100%-32px)] rounded bg-[#7a9e94] px-4 pb-1 pt-0.5 text-[16px] font-semibold leading-5 text-white shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)] transition-opacity disabled:opacity-50"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: briefComplete ? 1 : 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            >
              Continue
            </motion.button>
          </AnimatePresence>
        )}
      </motion.div>
    </motion.main>
  )
}

function LoadingPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="pointer-events-none relative mx-auto h-[352px] w-full max-w-full overflow-hidden"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={summaryPanelTransition}
    >
      <DitherLoader className="absolute left-1/2 top-1/2 h-[min(250px,34svh)] w-[min(316px,82vw)] -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  )
}

function SummaryCard({
  careBriefRows,
  visibleRowCount,
  reduceMotion,
}: {
  careBriefRows: CareBriefRow[]
  visibleRowCount: number
  reduceMotion: boolean
}) {
  return (
    <motion.article
      className="w-full overflow-hidden rounded-xl bg-white px-3 pb-1.5 pt-3 shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={summaryPanelTransition}
    >
      <div className="flex flex-col">
        {careBriefRows.map((row, index) => (
          <CareBriefRowSlot
            key={row.label}
            row={row}
            isVisible={index < visibleRowCount}
            showDivider={index < careBriefRows.length - 1}
          />
        ))}
      </div>
    </motion.article>
  )
}

function ConcernQuote({
  concernText,
  reduceMotion,
  transitionTextBoxRect,
  quoted = true,
}: {
  concernText: string
  reduceMotion: boolean
  transitionTextBoxRect?: TextBoxTransitionRect | null
  quoted?: boolean
}) {
  const initialY = transitionTextBoxRect
    ? transitionTextBoxRect.top - CARE_GUIDE_QUOTE_TOP
    : 12

  return (
    <section className="relative z-10 pt-0">
      <motion.div
        layoutId="concern-text-box"
        className="rounded-xl bg-white p-4 text-[14px] font-medium leading-[18px] text-[#8a8a8a] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]"
        initial={
          reduceMotion
            ? false
            : {
                opacity: transitionTextBoxRect ? 1 : 0,
                y: initialY,
                backgroundColor: '#ffffff',
                borderRadius: 12,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          backgroundColor: '#ffffff',
          borderRadius: 12,
        }}
        transition={quoteTransition}
      >
        {quoted ? `“${concernText}”` : concernText}
      </motion.div>
    </section>
  )
}

function DitherLoader({ className = 'absolute inset-x-0 bottom-0 block h-[376px] w-full' }: { className?: string }) {
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
      bgColor="#FCFAF6"
      particleColor="#EFEAE1"
      className={className}
    />
  )
}

function getSummaryLabel(label: string) {
  return label === 'Other' ? 'Details' : label
}

function CareBriefRowSlot({
  row,
  isVisible,
  showDivider,
}: {
  row: CareBriefRow
  isVisible: boolean
  showDivider: boolean
}) {
  const rowHeightClass = showDivider
    ? row.label === 'Pattern'
      ? 'min-h-[84px]'
      : 'min-h-[68px]'
    : 'min-h-[44px]'

  return (
    <div className={`relative ${rowHeightClass}`}>
      <motion.div
        className="absolute inset-x-0 top-0"
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={rowTransition}
      >
        <CareBriefField row={row} isVisible={isVisible} />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-0"
        animate={{ opacity: isVisible ? 0 : 1 }}
        transition={rowTransition}
        aria-hidden="true"
      >
        <CareBriefSkeleton />
      </motion.div>

      {showDivider ? <div className="absolute inset-x-0 bottom-3 h-px bg-[#e5e0d6]" /> : null}
    </div>
  )
}

function CareBriefSkeleton() {
  return (
    <div className="flex w-full items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 gap-2.5">
        <div className="size-6 shrink-0 rounded-full bg-[#efeae1]" />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="h-[14px] w-[72px] rounded bg-[#efeae1]" />
          <div className="mt-2 h-4 w-[78%] rounded bg-[#efeae1]" />
        </div>
      </div>
      <div className="size-6 shrink-0 rounded bg-[#efeae1]" />
    </div>
  )
}

function CareBriefField({ row, isVisible }: { row: CareBriefRow; isVisible: boolean }) {
  return (
    <button
      type="button"
      className="flex w-full items-start justify-between gap-4 text-left"
      aria-label={`Edit ${row.label}: ${row.value}`}
      tabIndex={isVisible ? 0 : -1}
    >
      <span className="flex min-w-0 gap-2.5 overflow-hidden rounded">
        <span className="flex size-6 shrink-0 items-center justify-center text-[#8a8a8a]">
          <HugeiconsIcon icon={row.icon} size={24} strokeWidth={1.6} />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-medium uppercase leading-[18px] text-[#8a8a8a]">
            {getSummaryLabel(row.label)}
          </span>
          <span className="mt-1 block text-[16px] font-medium leading-[20px] text-[#5a5a55]">
            {row.value}
          </span>
        </span>
      </span>
      <span className="flex size-6 shrink-0 items-center justify-center text-[#8a8a8a]">
        <HugeiconsIcon icon={Edit03Icon} size={24} strokeWidth={1.6} />
      </span>
    </button>
  )
}
