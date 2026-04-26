import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import type { HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'pill'

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: ButtonVariant
  selected?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-amber text-white shadow-card hover:bg-[#b97859] disabled:bg-amber-soft disabled:text-ink-muted',
  secondary:
    'border border-line bg-surface text-ink hover:border-sage hover:text-sage-deep',
  pill: 'rounded-full border border-line bg-surface px-4 text-ink hover:border-sage',
}

export function Button({
  className,
  variant = 'primary',
  selected = false,
  children,
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
      className={clsx(
        'inline-flex min-h-12 items-center justify-center rounded-button px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:shadow-none',
        variantClasses[variant],
        selected && 'border-sage bg-sage-soft text-sage-deep',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
