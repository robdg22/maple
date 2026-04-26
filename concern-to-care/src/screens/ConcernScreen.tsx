import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Button } from '../components/Button'
import { scenario } from '../data/scenario'

type ConcernScreenProps = {
  concernText: string
  onConcernChange: (value: string) => void
  onContinue: () => void
}

const entryVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 },
  },
}

export function ConcernScreen({
  concernText,
  onConcernChange,
  onContinue,
}: ConcernScreenProps) {
  const [isTypingExample, setIsTypingExample] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimer = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const hasConcern = concernText.trim().length > 0

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [concernText])

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        window.clearTimeout(typingTimer.current)
      }
    }
  }, [])

  function stopTypingExample() {
    if (typingTimer.current) {
      window.clearTimeout(typingTimer.current)
    }

    typingTimer.current = null
    setIsTypingExample(false)
  }

  function useExampleConcern() {
    if (isTypingExample) {
      return
    }

    if (reduceMotion) {
      onConcernChange(scenario.concern)
      return
    }

    let characterIndex = 0
    setIsTypingExample(true)
    onConcernChange('')

    const typeNextCharacter = () => {
      characterIndex += 1
      onConcernChange(scenario.concern.slice(0, characterIndex))

      if (characterIndex < scenario.concern.length) {
        typingTimer.current = window.setTimeout(typeNextCharacter, 30)
        return
      }

      typingTimer.current = null
      setIsTypingExample(false)
    }

    typingTimer.current = window.setTimeout(typeNextCharacter, 140)
  }

  return (
    <section className="flex flex-1 flex-col justify-between gap-6">
      <motion.div
        variants={entryVariants}
        initial="hidden"
        animate="visible"
        className="pt-12"
      >
        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm font-medium text-ink-soft"
        >
          From concern to care
        </motion.p>
        <motion.h1
          variants={itemVariants}
          className="text-[28px] font-bold leading-[1.2]"
        >
          What's been happening?
        </motion.h1>
        <motion.div variants={itemVariants} className="mt-8">
          <textarea
            ref={textareaRef}
            value={concernText}
            onChange={(event) => {
              stopTypingExample()
              onConcernChange(event.target.value)
            }}
            placeholder="A few sentences is enough."
            rows={1}
            className="max-h-72 min-h-44 w-full resize-none overflow-hidden border-0 border-b border-line bg-transparent pb-4 text-[16px] leading-6 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-sage"
          />
        </motion.div>
        <motion.p variants={itemVariants} className="mt-4 text-sm leading-5 text-ink-soft">
          Use your own words. You can always change anything later.
        </motion.p>
        <motion.button
          variants={itemVariants}
          type="button"
          onClick={useExampleConcern}
          disabled={isTypingExample}
          className="mt-5 text-sm font-semibold text-sage-deep underline decoration-sage/40 underline-offset-4 transition-colors hover:text-ink disabled:text-ink-muted"
        >
          {isTypingExample ? 'Typing example...' : 'Use example'}
        </motion.button>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: hasConcern ? 1 : 0,
          y: hasConcern ? 0 : 8,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
        className={hasConcern ? 'pointer-events-auto' : 'pointer-events-none'}
      >
        <Button
          type="button"
          disabled={!hasConcern}
          className="w-full"
          onClick={onContinue}
        >
          Continue
        </Button>
      </motion.div>
    </section>
  )
}
