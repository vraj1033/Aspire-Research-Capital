import type { ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full pass. Slower is calmer. */
  duration?: number
  className?: string
  pauseOnHover?: boolean
}

/**
 * Infinite horizontal drift.
 *
 * The track holds the content twice and travels exactly -50%, which is what
 * makes the loop seamless. Kept slow on purpose — this is texture, not an
 * animation anyone should have to watch.
 */
export function Marquee({ children, duration = 46, className = '', pauseOnHover = true }: MarqueeProps) {
  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <div
        className={`animate-marquee flex w-max ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center" aria-hidden="false">
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
