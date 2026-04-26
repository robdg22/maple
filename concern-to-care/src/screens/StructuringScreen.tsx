import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Card } from '../components/Card'

type StructuringScreenProps = {
  concernText: string
  onComplete: () => void
}

export function StructuringScreen({ concernText, onComplete }: StructuringScreenProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 300 : 1800)

    return () => window.clearTimeout(timer)
  }, [onComplete, reduceMotion])

  return (
    <section className="flex flex-1 flex-col">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
      >
        <Card variant="soft" className="line-clamp-4 text-sm leading-5 text-ink-soft">
          "{concernText}"
        </Card>
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <div className="flex h-12 items-center gap-3" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-3 w-3 rounded-full bg-sage"
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 1.2,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 26,
            mass: 0.9,
            delay: reduceMotion ? 0 : 0.2,
          }}
          className="mt-5 text-[16px] font-semibold leading-6 text-ink"
        >
          Understanding what you've shared...
        </motion.p>
      </div>
    </section>
  )
}
