import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'

type CareScreenProps = {
  title: string
  onBack: () => void
  children: ReactNode
  className?: string
}

type CareButtonProps = {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

type CareCardProps = {
  children: ReactNode
  tone?: 'surface' | 'muted' | 'warning'
  className?: string
}

type EyebrowProps = {
  children: ReactNode
  icon?: IconSvgElement
  tone?: 'sage' | 'muted' | 'warning'
}

export const careShadow =
  'shadow-[0_2px_2px_1px_rgb(0_0_0_/_6%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_0_0_1px_rgb(0_0_0_/_12%)]'

export const careSoftShadow = 'shadow-[0_0_0_1px_rgb(0_0_0_/_8%)]'

export const careTransition = {
  duration: 0.34,
  ease: [0.215, 0.61, 0.355, 1],
} as const

export const careSpring = {
  type: 'spring',
  stiffness: 280,
  damping: 26,
  mass: 0.9,
} as const

export function CareScreen({ title, onBack, children, className = '' }: CareScreenProps) {
  return (
    <section className="relative h-full overflow-hidden bg-[#fcfaf6] text-[#1a1a1a]">
      <CareHeader title={title} onBack={onBack} />
      <main className="scrollbar-none absolute inset-x-0 bottom-0 top-[66px] touch-pan-y overflow-y-scroll overscroll-contain px-4 pb-5 pt-4 [-webkit-overflow-scrolling:touch]">
        <motion.div
          className={`flex min-h-full flex-col ${className}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={careTransition}
        >
          {children}
        </motion.div>
      </main>
    </section>
  )
}

export function CareHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-30 grid h-[66px] grid-cols-[64px_1fr_88px] items-center bg-gradient-to-b from-[#fcfaf6] from-[70%] to-[#fcfaf600] px-4 py-2.5"
      initial={reduceMotion ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={careTransition}
    >
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 flex size-8 items-center justify-center text-[#1a1a1a]"
        aria-label="Go back"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} strokeWidth={1.7} />
      </button>
      <h1 className="text-center text-[20px] font-semibold leading-5 text-[#1a1a1a]">
        {title}
      </h1>
      <button
        type="button"
        className="flex h-9 items-center justify-center whitespace-nowrap rounded border border-[#7a9e94] px-2 pb-1 pt-0.5 text-[16px] font-semibold leading-5 text-[#7a9e94] shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)]"
      >
        Get help
      </button>
    </motion.header>
  )
}

export function SummaryBar() {
  return (
    <div
      className={`flex w-full items-center justify-center gap-5 overflow-hidden rounded-xl bg-white p-4 text-[16px] font-semibold leading-5 text-[#5a5a55] ${careShadow}`}
    >
      <button type="button" className="shrink-0 whitespace-nowrap decoration-dotted underline underline-offset-4">
        Headaches
      </button>
      <button type="button" className="shrink-0 whitespace-nowrap decoration-dotted underline underline-offset-4">
        Two weeks
      </button>
      <button type="button" className="shrink-0 whitespace-nowrap decoration-dotted underline underline-offset-4">
        Vision changes
      </button>
    </div>
  )
}

export function CareButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
}: CareButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'border-transparent bg-[#7a9e94] text-white'
      : 'border-[#7a9e94] bg-[#fcfaf6] text-[#7a9e94]'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 items-center justify-center rounded border px-4 pb-1 pt-0.5 text-[16px] font-semibold leading-5 shadow-[0_0_0_1px_rgb(79_112_101_/_80%),0_1px_1px_0.5px_rgb(0_0_0_/_8%),0_2px_2px_1px_rgb(0_0_0_/_6%)] transition-opacity disabled:opacity-50 ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}

export function CareCard({ children, tone = 'surface', className = '' }: CareCardProps) {
  const toneClass =
    tone === 'warning'
      ? 'bg-[#f0dcc9] shadow-[0_0_0_1px_rgb(200_137_106_/_50%)]'
      : tone === 'muted'
        ? `bg-[#f7f4ee] ${careShadow}`
        : `bg-white ${careShadow}`

  return (
    <article className={`overflow-hidden rounded-xl p-4 ${toneClass} ${className}`}>
      {children}
    </article>
  )
}

export function CareEyebrow({ children, icon, tone = 'sage' }: EyebrowProps) {
  const toneClass =
    tone === 'warning'
      ? 'text-[#8e5032]'
      : tone === 'muted'
        ? 'text-[#5a5a55]'
        : 'text-[#7a9e94]'

  return (
    <div className={`flex items-center gap-2.5 ${toneClass}`}>
      {icon ? <HugeiconsIcon icon={icon} size={24} strokeWidth={1.7} /> : null}
      <p className="text-[16px] font-semibold uppercase leading-5 tracking-normal">
        {children}
      </p>
    </div>
  )
}
