import type { ReactNode } from 'react'

type PhoneFrameProps = {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto flex h-svh w-full items-center justify-center overflow-hidden px-6 sm:py-10">
      <div className="relative h-full w-full max-w-[393px] overflow-hidden bg-surface shadow-none sm:h-[852px] sm:max-h-[calc(100svh-5rem)] sm:rounded-[40px] sm:border-[9px] sm:border-[#171717] sm:shadow-phone">
        <div className="h-full overflow-hidden bg-bg">{children}</div>
      </div>
    </div>
  )
}
