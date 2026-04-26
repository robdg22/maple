import type { ReactNode } from 'react'

type PhoneFrameProps = {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full items-center justify-center px-6 py-8 sm:py-10">
      <div className="relative h-svh w-full overflow-hidden bg-surface shadow-none sm:h-[844px] sm:max-h-[calc(100svh-5rem)] sm:w-[390px] sm:rounded-[40px] sm:border-[9px] sm:border-[#171717] sm:shadow-phone">
        <div className="hidden h-8 items-center justify-between bg-[#171717] px-7 text-[11px] font-semibold text-white sm:flex">
          <span>9:41</span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-3 rounded-sm border border-white/80" />
            <span className="h-2 w-5 rounded-sm border border-white/80">
              <span className="block h-full w-4 rounded-[2px] bg-white/80" />
            </span>
          </span>
        </div>
        <div className="h-full overflow-hidden bg-bg sm:h-[calc(100%-2rem)]">{children}</div>
      </div>
    </div>
  )
}
