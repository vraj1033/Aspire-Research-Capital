import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

type ScrollMarqueeProps = {
  items: string[]
  /**
   * Drift in track-percent per second before the scroll multiplier. One copy
   * of the items is a quarter of the track, so 2 = a full pass every ~12s.
   */
  baseSpeed?: number
  tone?: 'light' | 'dark'
  /** Hollow letterforms: a hairline stroke with no fill. */
  outlined?: boolean
  className?: string
}

/** The track holds this many copies; the loop wraps at one copy's width. */
const COPIES = 4
const COPY_WIDTH = 100 / COPIES

/** Hardest the scroll may push the drift, as a multiple of the base speed. */
const MAX_BOOST = 3.5

/** A frame delta is capped here so a backgrounded tab returns without a jump. */
const MAX_DELTA_MS = 64

/** Wraps `value` into [min, max) so the track position loops seamlessly. */
const wrap = (min: number, max: number, value: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/**
 * A velocity-reactive text band.
 *
 * Huge display type drifts left on its own, then speeds up and — when the
 * reader scrolls back up — reverses, so the band feels tied to the hand on the
 * wheel rather than to a timer. The position is a MotionValue advanced every
 * frame and wrapped at one copy's width, which is what makes the loop seamless.
 *
 * The frame work is skipped while the band is off-screen or the tab is hidden,
 * and under `prefers-reduced-motion` the band is simply static.
 */
export function ScrollMarquee({
  items,
  baseSpeed = 2,
  tone = 'dark',
  outlined = true,
  className = '',
}: ScrollMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const onScreen = useRef(true)
  const direction = useRef(1)

  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400, mass: 0.6 })
  // px/s → a signed multiplier on the base drift, clamped at both ends.
  const boost = useTransform(smoothVelocity, [-1400, 0, 1400], [-MAX_BOOST, 0, MAX_BOOST])

  const distance = useMotionValue(0)
  const x = useTransform(distance, (travelled) => `${-wrap(0, COPY_WIDTH, travelled)}%`)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting
      },
      { rootMargin: '10% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduced || !onScreen.current || document.hidden) return

    const seconds = Math.min(delta, MAX_DELTA_MS) / 1000
    const push = boost.get()

    // Only a definite scroll flips the direction; a settling spring keeps the
    // last one, so the band never flickers back and forth around zero.
    if (push < -0.15) direction.current = -1
    else if (push > 0.15) direction.current = 1

    distance.set(distance.get() + direction.current * baseSpeed * seconds * (1 + Math.abs(push)))
  })

  const isDark = tone === 'dark'
  const strokeColor = isDark ? 'rgba(247, 248, 244, 0.25)' : 'rgba(7, 24, 44, 0.22)'
  const fillColor = isDark ? 'rgba(247, 248, 244, 0.9)' : '#07182c'
  const textStyle = outlined
    ? { WebkitTextStroke: `1px ${strokeColor}`, color: 'transparent' }
    : { color: fillColor }

  // The first copy is the one assistive tech reads; the rest are texture.
  const copy = (decorative: boolean, key: number) => (
    <span key={key} aria-hidden={decorative || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="px-[0.28em]">{item.toUpperCase()}</span>
          <span
            aria-hidden="true"
            className="inline-block h-[0.14em] w-[0.14em] rotate-45 bg-gold/60"
          />
        </span>
      ))}
    </span>
  )

  return (
    <div ref={ref} className={`mask-fade-x w-full overflow-hidden ${className}`}>
      <motion.div
        style={reduced ? textStyle : { ...textStyle, x }}
        className="flex w-max select-none whitespace-nowrap font-display text-[clamp(3rem,9vw,8rem)] font-extrabold leading-[1.1] tracking-[-0.045em] will-change-transform"
      >
        {Array.from({ length: COPIES }, (_, i) => copy(i > 0, i))}
      </motion.div>
    </div>
  )
}
