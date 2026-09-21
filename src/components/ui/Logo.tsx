import { motion, useReducedMotion } from 'framer-motion'

type LogoProps = {
  /** Inverted for dark backgrounds. */
  light?: boolean
  showWordmark?: boolean
  className?: string
  /** Plays the build-in once, on first load. */
  animateIn?: boolean
}

/**
 * ARC monogram — an ascending apex crossed by a gold bar.
 *
 * Drawn rather than lettered so it holds up at 28px in the nav and at any size
 * in the footer, and so the mark reads as a peak, not just the letter A.
 */
export function Logo({ light = false, showWordmark = true, className = '', animateIn = false }: LogoProps) {
  const reduced = useReducedMotion()
  const ink = light ? '#F7F8F4' : '#07182C'
  const shouldAnimate = animateIn && !reduced

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <motion.path
          d="M14 48 L32 14 L50 48"
          stroke={ink}
          strokeWidth="5"
          strokeLinecap="square"
          initial={shouldAnimate ? { pathLength: 0 } : undefined}
          animate={shouldAnimate ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
        <motion.path
          d="M22 38 H42"
          stroke="#D6A928"
          strokeWidth="5"
          strokeLinecap="square"
          initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : undefined}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
        />
      </svg>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-[0.95rem] font-extrabold tracking-[-0.02em] ${
              light ? 'text-bone' : 'text-ink-950'
            }`}
          >
            ARC
          </span>
          <span
            className={`mt-[3px] text-[0.5rem] font-semibold tracking-[0.18em] ${
              light ? 'text-bone/50' : 'text-muted'
            }`}
          >
            ASPIRE RESEARCH
          </span>
        </span>
      )}
    </span>
  )
}
