import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type ScreenProps = {
  screenKey: string
  children: ReactNode
}

export function Screen({ screenKey, children }: ScreenProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={screenKey}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
        className="flex h-full flex-col px-5 py-6"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
