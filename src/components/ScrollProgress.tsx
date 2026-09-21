import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { scrollToTop } from '../hooks/useSmoothScroll'

const ease = [0.16, 1, 0.3, 1] as const

/** Ring geometry for the 52px control: a 1.5px stroke set 2px inside the edge. */
const RING_RADIUS = 24
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/** How far into the page the reader must be before the return control appears. */
const SHOW_AFTER = 0.12

/**
 * Global scroll chrome, mounted once in App.tsx beside the cursor.
 *
 * A two-pixel reading line along the very top of the viewport — above the
 * floating navigation, which starts twelve pixels down — tracks how far
 * through the page the reader is. Once they are past the hero, a small control
 * appears bottom-right to take them back, wearing the same progress as a thin
 * ring so the two never disagree.
 *
 * The line is informative, so it stays under `prefers-reduced-motion`; only the
 * spring that smooths it is dropped. The control is hidden below the `sm`
 * breakpoint, where it would sit on top of the stacked calls to action.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // The spring gives the line a little inertia so it reads as a needle rather
  // than a scrollbar. Under reduced motion the raw value drives it directly.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  })
  const progress = reduced ? scrollYProgress : smoothed
  const ringOffset = useTransform(progress, [0, 1], [RING_LENGTH, 0])

  const [pastHero, setPastHero] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (value) => setPastHero(value > SHOW_AFTER))

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-emerald-deep via-emerald-soft to-gold"
      />

      <AnimatePresence>
        {pastHero && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease }}
            // z-35: above every section (nothing on the page exceeds z-20),
            // beneath the mobile menu (40), the nav (50) and the lightbox (60).
            className="group fixed bottom-6 right-6 z-[35] hidden h-[52px] w-[52px] items-center justify-center rounded-full border border-bone/15 bg-ink-950 text-bone shadow-[0_18px_40px_-18px_rgba(7,24,44,0.55)] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-bone/35 sm:flex lg:bottom-8 lg:right-8"
          >
            <svg
              viewBox="0 0 52 52"
              className="absolute inset-0 h-full w-full -rotate-90"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                cx="26"
                cy="26"
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(247, 248, 244, 0.1)"
                strokeWidth="1.25"
              />
              <motion.circle
                cx="26"
                cy="26"
                r={RING_RADIUS}
                fill="none"
                stroke="#12a879"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                style={{ strokeDashoffset: ringOffset }}
              />
            </svg>

            <ArrowUp
              aria-hidden="true"
              strokeWidth={1.6}
              className="relative h-[18px] w-[18px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
