import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  AddCircleIcon,
  AmbulanceIcon,
  Calendar01Icon,
  File01Icon,
  Mic01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { useCallback, useEffect, useRef, useState, type Ref } from 'react'
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
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'delete'],
] as const

const BASE_EXPANDED_CARD_HEIGHT = 489
const TEXTBOX_CHARACTERS_PER_LINE = 42
const TYPING_CHARACTER_DELAY = 44
const TYPING_CLAUSE_PAUSE = 190
const TYPING_SENTENCE_PAUSE = 620
const TYPING_INITIAL_DELAY = 120
const SUBMIT_NAVIGATION_DELAY = 320

type ComposeRect = TextBoxTransitionRect

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
  const [composeRect, setComposeRect] = useState<ComposeRect | null>(null)
  const [expandedComposeRect, setExpandedComposeRect] = useState<ComposeRect | null>(null)
  const shellRef = useRef<HTMLElement>(null)
  const composeAnchorRef = useRef<HTMLDivElement>(null)
  const expandedTextBoxRef = useRef<HTMLButtonElement>(null)
  const typingTimer = useRef<number | null>(null)
  const submitTimer = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const visibleConcern = concernText.trim()

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

    const transitionRect = getRelativeRect(shellRef.current, expandedTextBoxRef.current)
    setIsSubmitting(true)
    submitTimer.current = window.setTimeout(
      () => onSubmitSymptoms(transitionRect ?? undefined),
      reduceMotion ? 0 : SUBMIT_NAVIGATION_DELAY,
    )
  }, [onConcernChange, onSubmitSymptoms, reduceMotion, stopTyping, visibleConcern])

  function openComposer() {
    setIsSubmitting(false)

    const shell = shellRef.current
    const composeAnchor = composeAnchorRef.current

    if (shell && composeAnchor) {
      const shellBox = shell.getBoundingClientRect()
      const composeBox = composeAnchor.getBoundingClientRect()

      setComposeRect({
        left: composeBox.left - shellBox.left,
        top: composeBox.top - shellBox.top,
        width: composeBox.width,
        height: composeBox.height,
      })
      setExpandedComposeRect(getExpandedCardRect(shell, visibleConcern))
    }

    setIsComposing(true)
  }

  useEffect(() => {
    if (!isComposing || !shellRef.current) {
      return
    }

    setExpandedComposeRect(getExpandedCardRect(shellRef.current, visibleConcern))
  }, [isComposing, visibleConcern])

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
        className="relative h-full overflow-hidden bg-[#fefaf4] text-[#1a1a1a]"
      >
        <header className="flex h-[66px] items-center justify-between px-4 py-2.5">
          <p className="text-[20px] font-semibold leading-5 tracking-normal text-[#7a9e94]">
            Care
          </p>
          <button
            type="button"
            className="flex items-center gap-1 text-[#1a1a1a]"
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

        <section className="scrollbar-none h-[calc(100%-66px)] overflow-y-auto px-4 pb-7 pt-5">
          <h1 className="text-[32px] font-semibold leading-[1.08] tracking-normal text-[#5a5a55]">
            How can we help today?
          </h1>

          <div className="mt-10 flex flex-col items-start gap-2.5">
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

          <div className="mt-10">
            {isComposing || isSubmitting ? (
              <div className="h-[184px]" aria-hidden="true" />
            ) : (
              <div ref={composeAnchorRef}>
                <ComposeCard concernText={visibleConcern} onTextBoxClick={openComposer} />
              </div>
            )}
          </div>

          <section className="mt-10 flex w-fit flex-col gap-2">
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
              className="h-9 w-fit rounded bg-[#7a9e94] px-2 pb-1 pt-0.5 text-[16px] font-semibold leading-5 text-white"
            >
              Get help now
            </button>
          </section>
        </section>

        <AnimatePresence>
          {isComposing && (
            <>
              <motion.button
                type="button"
                aria-label="Close symptom composer"
                className="absolute inset-0 z-10 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: isSubmitting ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                onClick={() => {
                  if (!isSubmitting) {
                    setIsComposing(false)
                  }
                }}
              />
              {composeRect && expandedComposeRect && (
                <motion.div
                  className="absolute z-20 overflow-hidden rounded-[20px] bg-[#f7f4ee] shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]"
                  initial={reduceMotion ? expandedComposeRect : composeRect}
                  animate={expandedComposeRect}
                  exit={reduceMotion ? { opacity: 0 } : composeRect}
                  transition={dashboardSpring}
                >
                <ComposeCard
                  expanded
                  chrome={false}
                  concernText={visibleConcern}
                  isSubmitting={isSubmitting}
                  textBoxRef={expandedTextBoxRef}
                  onTextBoxClick={() => undefined}
                />
                </motion.div>
              )}
              <AnimatePresence>
                {!isSubmitting ? (
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
                ) : null}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

function getExpandedCardRect(shell: HTMLElement | null, concernText: string): ComposeRect {
  const width = shell?.clientWidth ?? 393
  const shellHeight = shell?.clientHeight ?? 852
  const extraHeight = getTextBoxExtraHeight(concernText)
  const height = BASE_EXPANDED_CARD_HEIGHT + extraHeight

  return {
    left: 0,
    top: shellHeight - height + 26,
    width,
    height,
  }
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

function getTextBoxExtraHeight(concernText: string) {
  if (!concernText) {
    return 0
  }

  const visualLines = Math.ceil(concernText.length / TEXTBOX_CHARACTERS_PER_LINE)
  const textBoxHeight = Math.max(56, 32 + visualLines * 20)

  return textBoxHeight - 56
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
      className="flex h-14 items-center gap-2.5 rounded bg-[#f7f4ee] px-4 py-4 text-[#5a5a55] shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]"
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
  expanded = false,
  chrome = true,
  concernText,
  isSubmitting = false,
  textBoxRef,
  onTextBoxClick,
}: {
  expanded?: boolean
  chrome?: boolean
  concernText: string
  isSubmitting?: boolean
  textBoxRef?: Ref<HTMLButtonElement>
  onTextBoxClick: () => void
}) {
  const hasConcern = concernText.length > 0

  return (
    <motion.article
      transition={dashboardSpring}
      className={`flex flex-col gap-5 p-4 ${
        chrome
          ? 'rounded-[20px] bg-[#f7f4ee] shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]'
          : 'h-full bg-transparent'
      }`}
      style={{
        width: expanded ? '100%' : '100%',
        height: expanded ? '100%' : 184,
      }}
    >
      <motion.h2
        className="text-[20px] font-semibold leading-5 text-[#1a1a1a]"
        animate={{ opacity: isSubmitting ? 0 : 1, y: isSubmitting ? -4 : 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        Not sure what you need?
      </motion.h2>
      <motion.p
        className="max-w-[361px] text-[14px] font-medium leading-[18px] text-[#8a8a8a]"
        animate={{ opacity: isSubmitting ? 0 : 1, y: isSubmitting ? -4 : 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        Describe what’s happening and Care will help suggest the safest next step.
      </motion.p>
      <motion.button
        ref={textBoxRef}
        type="button"
        className="flex min-h-14 w-full items-end justify-between gap-2.5 rounded-lg bg-white px-4 py-4 text-left shadow-[0_0_0_1px_rgb(0_0_0_/_8%)] [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]"
        onClick={onTextBoxClick}
      >
        <span
          className={
            hasConcern
              ? expanded
                ? 'min-w-0 flex-1 whitespace-pre-wrap break-words text-[15px] font-medium leading-5 text-[#1a1a1a]'
                : 'line-clamp-2 text-[15px] font-medium leading-5 text-[#1a1a1a]'
              : 'text-[16px] font-medium leading-5 text-[#8a8a8a]'
          }
        >
          {hasConcern ? concernText : 'Describe what’s happening'}
        </span>
        <HugeiconsIcon
          icon={Mic01Icon}
          size={24}
          color="#8a8a8a"
          strokeWidth={1.5}
          className="mb-0.5 shrink-0"
        />
      </motion.button>
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
      className="block h-[276px] w-full rounded-t-[27px] bg-white/60 px-1 pb-2 pt-3 text-[#333] shadow-[inset_0_1px_rgb(255_255_255_/_60%)] backdrop-blur-xl"
      aria-label="Onscreen keyboard"
    >
      <div className="mx-auto mb-2 flex h-[38px] max-w-[350px] items-center justify-around rounded-full bg-white/70 px-4 text-[15px] font-medium shadow-[0_0_0_1px_rgb(0_0_0_/_5%)]">
        <span>headaches</span>
        <span className="text-[#8a8a8a]">vision</span>
        <span className="text-[#8a8a8a]">frequent</span>
      </div>
      <div className="space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={row.join('')} className="flex justify-center gap-1.5">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                className={
                  key.length > 1
                    ? 'flex h-10 min-w-10 items-center justify-center rounded-md bg-[#d4d6dc] px-2 text-[11px] font-semibold uppercase text-[#333] shadow-[0_1px_0_rgb(0_0_0_/_18%)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage'
                    : 'flex h-10 w-[33px] items-center justify-center rounded-md bg-white text-[17px] font-medium shadow-[0_1px_0_rgb(0_0_0_/_18%)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage'
                }
                onClick={onType}
              >
                {key.length > 1 ? (rowIndex === 2 && key === 'delete' ? '⌫' : '⇧') : key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 px-1">
        <button
          type="button"
          className="flex h-10 w-12 items-center justify-center rounded-md bg-[#d4d6dc] text-[13px] font-semibold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
          onClick={onType}
        >
          123
        </button>
        <button
          type="button"
          className="h-10 flex-1 rounded-md bg-white shadow-[0_1px_0_rgb(0_0_0_/_18%)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
          aria-label="Space"
          onClick={onType}
        />
        <button
          type="button"
          className="flex h-10 w-20 items-center justify-center rounded-md bg-[#7a9e94] text-[13px] font-semibold text-white shadow-[0_1px_0_rgb(0_0_0_/_18%)] outline-none transition-colors hover:bg-[#6f9187] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a9e94]"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
      <span className="mx-auto mt-3 block h-1 w-32 rounded-full bg-[#111]" />
    </div>
  )
}
