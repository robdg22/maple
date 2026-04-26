import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'base' | 'soft' | 'elevated'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
  children: ReactNode
}

const variantClasses: Record<CardVariant, string> = {
  base: 'border border-line bg-surface',
  soft: 'border border-line bg-surface-soft',
  elevated: 'bg-surface shadow-card',
}

export function Card({
  className,
  variant = 'base',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx('rounded-card p-5 text-left', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}
