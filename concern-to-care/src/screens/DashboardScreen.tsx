import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  AddCircleIcon,
  AmbulanceIcon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  Calendar01Icon,
  File01Icon,
  Mic01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Ref } from 'react'
import { scenario } from '../data/scenario'
import type { TextBoxTransitionRect } from '../types/transitions'

type DashboardScreenProps = {
  concernText: string
  onConcernChange: (value: string) => void
  onBookAppointment: () => void
  onUpcomingAppointments: () => void
  onCareBriefs: () => void
  onSubmitSymptoms: (textBoxRect?: TextBoxTransitionRect) => void
}

const dashboardSpring = {
  type: 'spring',
  stiffness: 380,
  damping: 34,
  mass: 0.8,
} as const

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
] as const

const TYPING_CHARACTER_DELAY = 44
const TYPING_CLAUSE_PAUSE = 190
const TYPING_SENTENCE_PAUSE = 620
const TYPING_INITIAL_DELAY = 120
const SUBMIT_NAVIGATION_DELAY = 320
const COMPOSER_TEXTBOX_PADDING_Y = 32
const COMPOSER_MIN_TEXTBOX_HEIGHT = 68

export function DashboardScreen({
  concernText,
  onConcernChange,
  onBookAppointment,
  onUpcomingAppointments,
  onCareBriefs,
  onSubmitSymptoms,
}: DashboardScreenProps) {
  const [isComposing, setIsComposing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const shellRef = useRef<HTMLElement>(null)
  const composeCardRef = useRef<HTMLElement>(null)
  const composeTextBoxRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<number | null>(null)
  const submitTimer = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const visibleConcern = concernText.trim()
  const hasTypedConcern = isComposing && visibleConcern.length > 0

  const stopTyping = useCallback(() => {
    if (typingTimer.current) {
      window.clearTimeout(typingTimer.current)
    }

    typingTimer.current = null
  }, [])

  const typeSymptoms = useCallback(() => {
    if (typingTimer.current) {
      return
    }

    if (reduceMotion) {
      onConcernChange(scenario.concern)
      return
    }

    const startIndex = scenario.concern.startsWith(concernText) ? concernText.length : 0
    let characterIndex = startIndex

    if (startIndex === scenario.concern.length) {
      return
    }

    if (startIndex === 0) {
      onConcernChange('')
    }

    const typeNextCharacter = () => {
      characterIndex += 1
      onConcernChange(scenario.concern.slice(0, characterIndex))

      if (characterIndex >= scenario.concern.length) {
        typingTimer.current = null
        return
      }

      const currentCharacter = scenario.concern[characterIndex - 1]
      const nextDelay = getTypingDelay(currentCharacter)
      typingTimer.current = window.setTimeout(typeNextCharacter, nextDelay)
    }

    typingTimer.current = window.setTimeout(typeNextCharacter, TYPING_INITIAL_DELAY)
  }, [concernText, onConcernChange, reduceMotion])

  const submitSymptoms = useCallback(() => {
    stopTyping()

    if (!visibleConcern) {
      onConcernChange(scenario.concern)
    }

    if (submitTimer.current) {
      window.clearTimeout(submitTimer.current)
    }

    const transitionRect = getRelativeRect(shellRef.current, composeTextBoxRef.current)
    setIsSubmitting(true)
    submitTimer.current = window.setTimeout(
      () => onSubmitSymptoms(transitionRect ?? undefined),
      reduceMotion ? 0 : SUBMIT_NAVIGATION_DELAY,
    )
  }, [onConcernChange, onSubmitSymptoms, reduceMotion, stopTyping, visibleConcern])

  function openComposer() {
    setIsSubmitting(false)
    setIsComposing(true)
  }

  function closeComposer() {
    stopTyping()
    setIsSubmitting(false)
    setIsComposing(false)
  }

  useEffect(() => {
    if (!isComposing || isSubmitting) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      composeCardRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isComposing, isSubmitting, visibleConcern])

  useEffect(() => {
    if (!isComposing || isSubmitting) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        submitSymptoms()
        return
      }

      if (event.key.length === 1 || event.key === 'Backspace' || event.key === ' ') {
        event.preventDefault()
        typeSymptoms()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isComposing, isSubmitting, submitSymptoms, typeSymptoms])

  useEffect(() => {
    return () => {
      stopTyping()

      if (submitTimer.current) {
        window.clearTimeout(submitTimer.current)
      }
    }
  }, [stopTyping])

  return (
    <>
      <main
        ref={shellRef}
        className="relative h-full overflow-hidden bg-[#fcfaf6] text-[#1a1a1a]"
      >
        <DashboardHeader
          isFocusedComposer={hasTypedConcern}
          onBack={closeComposer}
        />

        <section className="scrollbar-none h-full touch-pan-y overflow-y-scroll overscroll-contain [-webkit-overflow-scrolling:touch]">
          <div
            className={`flex min-h-full flex-col justify-end gap-10 px-4 pt-[66px] ${
              isComposing ? 'pb-[300px]' : 'pb-14'
            }`}
          >
            <div
              className={`flex flex-col gap-10 transition-opacity duration-200 ${
                hasTypedConcern ? 'hidden pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              <h1 className="text-[32px] font-semibold leading-[1.08] tracking-normal text-[#5a5a55]">
                How can we help today?
              </h1>

              <div className="flex flex-col items-start gap-2.5">
                <ListAction
                  icon={AddCircleIcon}
                  label="Book new appointment"
                  onClick={onBookAppointment}
                />
                <ListAction
                  icon={Calendar01Icon}
                  label="Upcoming appointments"
                  onClick={onUpcomingAppointments}
                />
                <ListAction icon={File01Icon} label="Care briefs (3)" onClick={onCareBriefs} />
              </div>

              <section className="flex w-fit flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon
                    icon={AmbulanceIcon}
                    size={24}
                    color="#5a5a55"
                    strokeWidth={1.5}
                  />
                  <p className="text-[16px] font-semibold leading-5 text-[#5a5a55]">
                    Need urgent help?
                  </p>
                </div>
                <button
                  type="button"
                  className="h-9 w-fit rounded border border-[#7a9e94] bg-transparent px-2 pb-1 pt-0.5 text-[16px] font-semibold leading-5 text-[#7a9e94] shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)] transition-colors hover:bg-[#eef5f2]"
                >
                  Get help
                </button>
              </section>
            </div>

            <ComposeCard
              articleRef={composeCardRef}
              concernText={visibleConcern}
              isComposing={isComposing}
              isSubmitting={isSubmitting}
              textBoxRef={composeTextBoxRef}
              onTextBoxClick={openComposer}
              onSubmit={submitSymptoms}
            />
          </div>
        </section>

        <AnimatePresence>
          {isComposing && (
            <motion.div
              key="keyboard"
              className="absolute inset-x-0 bottom-0 z-30"
              initial={reduceMotion ? false : { y: 280 }}
              animate={{ y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: 280 }}
              transition={dashboardSpring}
            >
              <Keyboard onType={typeSymptoms} onSubmit={submitSymptoms} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

function DashboardHeader({
  isFocusedComposer,
  onBack,
}: {
  isFocusedComposer: boolean
  onBack: () => void
}) {
  if (isFocusedComposer) {
    return (
      <header className="absolute inset-x-0 top-0 z-20 grid h-[66px] grid-cols-[64px_1fr_88px] items-center bg-gradient-to-b from-[#fcfaf6] from-[70%] to-[#fcfaf600] px-4 py-2.5">
        <button
          type="button"
          className="-ml-1 flex size-8 items-center justify-center text-[#1a1a1a]"
          aria-label="Back to dashboard"
          onClick={onBack}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="currentColor" strokeWidth={1.7} />
        </button>
        <p className="text-center text-[20px] font-semibold leading-5 text-[#1a1a1a]">
          Tell us
        </p>
        <button
          type="button"
          className="flex h-9 items-center justify-center whitespace-nowrap rounded border border-[#7a9e94] px-2 pb-1 pt-0.5 text-[16px] font-semibold leading-5 text-[#7a9e94] shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)]"
        >
          Get help
        </button>
      </header>
    )
  }

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-[66px] items-center justify-between bg-gradient-to-b from-[#fcfaf6] from-[70%] to-[#fcfaf600] px-4 py-2.5">
      <p className="text-[20px] font-semibold leading-5 tracking-normal text-[#7a9e94]">
        Care
      </p>
      <button
        type="button"
        className="flex h-9 items-center justify-center gap-1 rounded border border-[#1a1a1a] px-2 pb-1 pt-0.5 text-[#1a1a1a] shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)]"
        aria-label="Open Rob's profile"
      >
        <span className="text-[16px] font-semibold leading-5">
          Rob
        </span>
        <HugeiconsIcon
          icon={UserIcon}
          size={24}
          color="#5a5a55"
          strokeWidth={1.5}
        />
      </button>
    </header>
  )
}

function getRelativeRect(
  shell: HTMLElement | null,
  element: HTMLElement | null,
): TextBoxTransitionRect | null {
  if (!shell || !element) {
    return null
  }

  const shellBox = shell.getBoundingClientRect()
  const elementBox = element.getBoundingClientRect()

  return {
    left: elementBox.left - shellBox.left,
    top: elementBox.top - shellBox.top,
    width: elementBox.width,
    height: elementBox.height,
  }
}

function getTypingDelay(character: string) {
  if (character === '.' || character === '!' || character === '?') {
    return TYPING_SENTENCE_PAUSE
  }

  if (character === ',' || character === ';' || character === ':') {
    return TYPING_CLAUSE_PAUSE
  }

  return TYPING_CHARACTER_DELAY
}

function ListAction({
  icon,
  label,
  onClick,
}: {
  icon: IconSvgElement
  label: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      transition={dashboardSpring}
      className="flex h-14 items-center gap-2.5 rounded bg-[#f7f4ee] px-4 py-4 text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] transition-colors hover:bg-[#f2eee7]"
      onClick={onClick}
    >
      <HugeiconsIcon icon={icon} size={24} color="currentColor" strokeWidth={1.5} />
      <span className="text-[16px] font-semibold leading-5">
        {label}
      </span>
    </motion.button>
  )
}

function ComposeCard({
  articleRef,
  concernText,
  isComposing,
  isSubmitting = false,
  textBoxRef,
  onTextBoxClick,
  onSubmit,
}: {
  articleRef?: Ref<HTMLElement>
  concernText: string
  isComposing: boolean
  isSubmitting?: boolean
  textBoxRef?: Ref<HTMLDivElement>
  onTextBoxClick: () => void
  onSubmit: () => void
}) {
  const hasConcern = concernText.length > 0
  const textContentRef = useRef<HTMLSpanElement>(null)
  const [textBoxHeight, setTextBoxHeight] = useState(COMPOSER_MIN_TEXTBOX_HEIGHT)

  useLayoutEffect(() => {
    const textContent = textContentRef.current

    if (!hasConcern || !textContent) {
      setTextBoxHeight(COMPOSER_MIN_TEXTBOX_HEIGHT)
      return undefined
    }

    const syncTextBoxHeight = () => {
      const contentHeight = Math.ceil(textContent.getBoundingClientRect().height)
      const nextHeight = Math.max(
        COMPOSER_MIN_TEXTBOX_HEIGHT,
        COMPOSER_TEXTBOX_PADDING_Y + contentHeight,
      )

      setTextBoxHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    syncTextBoxHeight()

    const observer = new ResizeObserver(syncTextBoxHeight)
    observer.observe(textContent)

    return () => observer.disconnect()
  }, [concernText, hasConcern])

  return (
    <motion.article
      ref={articleRef}
      transition={dashboardSpring}
      className="flex w-full scroll-mb-[300px] flex-col items-center gap-3.5"
    >
      <motion.div
        layoutId="concern-text-box"
        ref={textBoxRef}
        role="button"
        tabIndex={0}
        className="relative flex w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-4 pr-[68px] text-left shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] outline-none focus-visible:outline-none"
        style={{ minHeight: textBoxHeight }}
        onClick={onTextBoxClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onTextBoxClick()
          }
        }}
        animate={{ opacity: isSubmitting ? 0.4 : 1 }}
      >
        {!hasConcern ? (
          <HugeiconsIcon
            icon={Mic01Icon}
            size={24}
            color="#8a8a8a"
            strokeWidth={1.5}
            className="shrink-0"
          />
        ) : null}
        <span
          ref={textContentRef}
          className={
            hasConcern
              ? 'min-w-0 flex-1 whitespace-pre-wrap break-words text-[14px] font-medium leading-[18px] text-[#8a8a8a] [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]'
              : 'min-w-0 flex-1 text-[15px] font-medium leading-5 text-transparent'
          }
        >
          {hasConcern ? concernText : isComposing ? ' ' : 'Describe what’s happening'}
        </span>
        <button
          type="button"
          className={`absolute bottom-4 right-4 flex size-9 shrink-0 items-center justify-center rounded bg-[#7a9e94] pb-1 pt-0.5 text-white shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)] transition-opacity ${
            hasConcern ? 'opacity-100' : 'opacity-40'
          }`}
          aria-label="Submit symptoms"
          onClick={(event) => {
            event.stopPropagation()
            onSubmit()
          }}
        >
          <HugeiconsIcon icon={ArrowUp01Icon} size={24} color="currentColor" strokeWidth={2} />
        </button>
      </motion.div>
      <p className="w-full text-center text-[14px] font-medium leading-[18px] text-[#8a8a8a]">
        <strong className="font-semibold">Not sure what you need?</strong>{' '}
        Tell us what&apos;s happening - Care will suggest the safest next step.
      </p>
    </motion.article>
  )
}

function Keyboard({
  onType,
  onSubmit,
}: {
  onType: () => void
  onSubmit: () => void
}) {
  return (
    <div
      className="block h-[273px] w-full rounded-t-[27px] bg-white/60 px-0 pb-0 pt-[11px] text-[#595959] shadow-[inset_0_1px_rgb(255_255_255_/_60%)] backdrop-blur-xl"
      aria-label="Onscreen keyboard"
    >
      <div className="flex flex-col gap-[13px] px-[6.5px]">
        <div className="flex w-full justify-center gap-[6.5px]">
          {keyboardRows[0].map((key) => (
            <KeyboardKey key={key} onClick={onType}>
              {key}
            </KeyboardKey>
          ))}
        </div>
        <div className="flex w-full justify-center gap-[6.5px] px-5">
          {keyboardRows[1].map((key) => (
            <KeyboardKey key={key} onClick={onType}>
              {key}
            </KeyboardKey>
          ))}
        </div>
        <div className="flex w-full items-center gap-[14.25px]">
          <KeyboardKey className="w-[45px] flex-none text-[23px]" onClick={onType}>
            ⇧
          </KeyboardKey>
          <div className="flex min-w-0 flex-1 gap-[6.5px]">
            {keyboardRows[2].map((key) => (
              <KeyboardKey key={key} onClick={onType}>
                {key}
              </KeyboardKey>
            ))}
          </div>
          <KeyboardKey className="w-[45px] flex-none text-[23px]" onClick={onType}>
            ⌫
          </KeyboardKey>
        </div>
        <div className="flex w-full items-center gap-1.5">
          <KeyboardKey className="w-[92.25px] flex-none text-[18px]" onClick={onType}>
            ABC
          </KeyboardKey>
          <KeyboardKey className="min-w-0 flex-1" ariaLabel="Space" onClick={onType}>
            {' '}
          </KeyboardKey>
          <button
            type="button"
            className="flex h-[42px] w-[92.25px] flex-none items-center justify-center rounded-[8.5px] bg-[#0088ff] text-[28px] leading-none text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0088ff]"
            aria-label="Submit symptoms"
            onClick={onSubmit}
          >
            ↩
          </button>
        </div>
      </div>
      <div className="flex h-14 items-start justify-between pl-9 pr-[39px] pt-3 text-[27px] leading-none text-[#6f7894]">
        <span aria-hidden="true">☺</span>
        <HugeiconsIcon icon={Mic01Icon} size={28} color="currentColor" strokeWidth={1.8} />
      </div>
    </div>
  )
}

function KeyboardKey({
  children,
  className = '',
  ariaLabel,
  onClick,
}: {
  children: string
  className?: string
  ariaLabel?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-[8.5px] bg-white text-[25px] font-medium leading-[30px] text-[#595959] shadow-[0_1px_0_rgb(0_0_0_/_18%)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
