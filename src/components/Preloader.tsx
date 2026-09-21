import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CandlestickMark } from './ui/CandlestickMark'

/* ----------------------------------------------------------------- TIMELINE */
/* Seconds from mount. Tuned to feel decisive rather than ceremonial: the
   mark prints, the wordmark rises under it, the bar fills, and the curtain is
   already lifting a beat after the counter reads 100.                       */
const T = {
  mark: 0.05,
  wordmark: 0.35,
  wordmarkStagger: 0.06,
  eyebrow: 0.6,
  corners: 0.25,
  bar: 0.3,
  barDuration: 1.0,
  curtainAt: 1.38,
  curtain: 0.8,
} as const

/** Milliseconds from mount to `onComplete`, for anything sequencing against it. */
export const PRELOADER_TOTAL_MS = Math.round((T.curtainAt + T.curtain) * 1000)

const EASE = [0.16, 1, 0.3, 1] as const
/* The bar uses the softer house curve. Expo-out reaches 97% at half time and
   then crawls, which on a progress bar reads as a stall, not a load. */
const EASE_BAR = [0.22, 0.61, 0.36, 1] as const

const LETTERS = ['A', 'R', 'C']

type PreloaderProps = {
  /** Fired exactly once, when the curtain has fully lifted. */
  onComplete: () => void
  /**
   * Optional. Fired once, the moment the curtain begins to lift. Starting the
   * hero entrance here means the reveal lands on a page already in motion.
   */
  onCurtainStart?: () => void
}

/**
 * The opening sequence: a candlestick mark prints, the ARC wordmark rises
 * beneath it, a hairline bar fills, and the whole navy plane lifts away like a
 * curtain to reveal the hero.
 *
 * Scroll is locked while the plane is down. The lock goes on `html` as well
 * as `body` because the navigation resets `body.style.overflow` in its own
 * mount effect; the root element keeps the lock honest. Wheel and touch input
 * is also swallowed at the overlay so the smooth-scroller never accumulates
 * deltas it cannot yet apply — otherwise the first real scroll after the
 * reveal would jump.
 *
 * Under `prefers-reduced-motion` nothing renders and `onComplete` fires at
 * once — the sequence is a layer, never a gate.
 */
export function Preloader({ onComplete, onCurtainStart }: PreloaderProps) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(true)

  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // The done guard is a ref so StrictMode's double-invoked effects, the exit
  // callback and the timeout guard can never fire `onComplete` twice.
  const doneRef = useRef(false)
  const unlockRef = useRef<() => void>(() => {})
  const callbacks = useRef({ onComplete, onCurtainStart })
  useEffect(() => {
    callbacks.current = { onComplete, onCurtainStart }
  })

  // One source of truth drives the bar and the counter, so they can never
  // disagree about what "loaded" means. Rendering the counter as a MotionValue
  // child keeps the 60fps tick out of React entirely.
  const progress = useMotionValue(0)
  const barScale = useTransform(progress, [0, 100], [0, 1])
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(2, '0'))

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    unlockRef.current()
    callbacks.current.onComplete()
  }, [])

  useEffect(() => {
    if (reduced) {
      finish()
      return
    }

    /* ------------------------------------------------------- scroll lock */
    const html = document.documentElement
    const body = document.body
    // Width of a classic scrollbar (0 for overlay scrollbars). Compensated as
    // padding so the page beneath is laid out at its final width from the
    // start, and the reveal does not end with a 10px sideways hop.
    const scrollbar = Math.max(0, window.innerWidth - html.clientWidth)
    const previous = {
      html: html.style.overflow,
      body: body.style.overflow,
      padding: html.style.paddingRight,
    }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbar) html.style.paddingRight = `${scrollbar}px`
    // The overlay's content centres inside the post-load viewport width.
    // Written imperatively: once AnimatePresence begins an exit it renders
    // its snapshot of the element, so a prop change would never reach the DOM.
    if (contentRef.current) contentRef.current.style.right = `${scrollbar}px`

    let locked = true
    const unlock = () => {
      if (!locked) return
      locked = false
      html.style.overflow = previous.html
      body.style.overflow = previous.body
      html.style.paddingRight = previous.padding
      if (contentRef.current) contentRef.current.style.right = '0px'
    }
    unlockRef.current = unlock

    const root = rootRef.current
    const swallow = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    root?.addEventListener('wheel', swallow, { passive: false })
    root?.addEventListener('touchmove', swallow, { passive: false })

    /* --------------------------------------------------------- sequence */
    const bar = animate(progress, 100, { duration: T.barDuration, delay: T.bar, ease: EASE_BAR })

    const lift = window.setTimeout(() => {
      // Released as the curtain starts, while the plane still covers the
      // page, so the scrollbar's return is never seen.
      unlock()
      setVisible(false)
      callbacks.current.onCurtainStart?.()
    }, T.curtainAt * 1000)

    // If the exit animation never reports back (a throttled background tab,
    // for instance) the page must still open.
    const guard = window.setTimeout(finish, PRELOADER_TOTAL_MS + 600)

    return () => {
      window.clearTimeout(lift)
      window.clearTimeout(guard)
      bar.stop()
      root?.removeEventListener('wheel', swallow)
      root?.removeEventListener('touchmove', swallow)
      unlock()
    }
  }, [reduced, finish, progress])

  if (reduced) return null

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          key="preloader"
          ref={rootRef}
          role="status"
          aria-live="polite"
          aria-label="Loading"
          aria-busy="true"
          initial="shown"
          animate="shown"
          exit="lift"
          // Pointer-events is switched through the variant rather than a
          // class, for the same snapshot reason as the content layer above.
          variants={{ shown: { pointerEvents: 'auto' }, lift: { pointerEvents: 'none' } }}
          className="fixed inset-0 z-[90]"
        >
          {/* The curtain. Everything visual lives inside this clipped plane. */}
          <motion.div
            variants={{
              shown: { clipPath: 'inset(0% 0% 0% 0%)' },
              lift: {
                clipPath: 'inset(0% 0% 100% 0%)',
                transition: { duration: T.curtain, ease: EASE },
              },
            }}
            className="absolute inset-0 isolate overflow-hidden bg-ink-950"
          >
            <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[56%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-deep/12 blur-[150px]"
            />
            <div aria-hidden="true" className="grain-layer absolute inset-0 opacity-[0.14] mix-blend-overlay" />

            {/* Content layer — its right edge is set imperatively to the
                scrollbar width while locked, see the effect above. */}
            <div ref={contentRef} className="absolute inset-y-0 left-0 right-0">
              {/* The centre stack drifts up with the curtain so it feels
                  attached to the plane rather than left behind by it. */}
              <motion.div
                variants={{
                  shown: { y: 0 },
                  lift: { y: -44, transition: { duration: T.curtain, ease: EASE } },
                }}
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
              >
                <CandlestickMark size={60} animate delay={T.mark} tone="dark" />

                {/* Wordmark: each letter rises out of its own mask. The masks
                    overlap by a hair instead of using negative tracking, which
                    would clip the right edge of every glyph. */}
                <div aria-hidden="true" className="mt-7 flex">
                  {LETTERS.map((letter, i) => (
                    <span
                      key={letter}
                      className="-mr-[0.045em] inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] last:mr-0"
                    >
                      <motion.span
                        initial={{ y: '112%' }}
                        animate={{ y: '0%' }}
                        transition={{
                          duration: 0.9,
                          delay: T.wordmark + i * T.wordmarkStagger,
                          ease: EASE,
                        }}
                        className="inline-block font-display text-[2.6rem] font-extrabold leading-none text-bone sm:text-[2.9rem]"
                      >
                        {letter}
                      </motion.span>
                    </span>
                  ))}
                </div>

                <motion.p
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: T.eyebrow, ease: EASE }}
                  className="eyebrow mt-3.5 text-[0.6rem] tracking-[0.3em] text-bone/45"
                >
                  Aspire Research Capital
                </motion.p>

                {/* Hairline progress: emerald into gold, left to right. */}
                <div aria-hidden="true" className="mt-9 h-px w-[164px] overflow-hidden bg-bone/12">
                  <motion.div
                    style={{ scaleX: barScale, originX: 0 }}
                    className="h-full w-full bg-gradient-to-r from-emerald-soft to-gold"
                  />
                </div>
              </motion.div>

              {/* Corner micro-labels */}
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: T.corners }}
                className="absolute inset-x-5 bottom-5 flex items-end justify-between sm:inset-x-8 sm:bottom-7 lg:inset-x-12 lg:bottom-9"
              >
                {/* DEMO — the founding year and city are placeholder copy. */}
                <div className="space-y-1.5">
                  <p className="text-[0.58rem] font-semibold tracking-[0.26em] text-bone/30">
                    LOADING MARKET VIEW
                  </p>
                  <p className="text-[0.58rem] font-semibold tracking-[0.26em] text-bone/30">
                    EST. 2023 · MUMBAI
                  </p>
                </div>
                <p className="font-display text-[0.82rem] font-semibold tabular-nums tracking-[0.1em] text-bone/45">
                  <motion.span>{counter}</motion.span>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* A 1px gold hairline riding the curtain's leading edge. It sits
              outside the clipped plane, tracks the same curve for the same
              duration, and fades over the last stretch so it never lands on
              the navigation as a stray line. */}
          <motion.div
            aria-hidden="true"
            variants={{
              shown: { top: '100%', opacity: 0 },
              lift: {
                top: '0%',
                opacity: [0, 1, 1, 0],
                transition: {
                  duration: T.curtain,
                  ease: EASE,
                  opacity: { duration: T.curtain, times: [0, 0.06, 0.82, 1], ease: 'linear' },
                },
              },
            }}
            className="absolute inset-x-0 h-px bg-gold"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
