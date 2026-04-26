import type { ReactNode } from 'react'

type PhoneFrameProps = {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full items-center justify-center px-6 py-8 sm:py-10">
      <div className="relative h-svh w-full overflow-hidden bg-surface shadow-none sm:h-[844px] sm:max-h-[calc(100svh-5rem)] sm:w-[390px] sm:rounded-[40px] sm:border-[9px] sm:border-[#171717] sm:shadow-phone">
        <div className="h-full overflow-hidden bg-bg">{children}</div>
      </div>
    </div>
  )
}
