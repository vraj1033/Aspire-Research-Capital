import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

type MarketCurveProps = {
  className?: string
  /** Draws the line in as it enters view. */
  animate?: boolean
  stroke?: string
  /** Soft wash beneath the line. */
  fill?: boolean
  delay?: number
  strokeWidth?: number
}

/**
 * An abstract market curve used as background architecture.
 *
 * Deliberately *not* a real chart: no gridlines, no candles, no axis. It reads
 * as an ascent with setbacks, which is the idea the brand is built on, without
 * turning a section into a trading terminal.
 */
export function MarketCurve({
  className = '',
  animate = true,
  stroke = 'rgba(18, 168, 121, 0.55)',
  fill = false,
  delay = 0.3,
  strokeWidth = 1.5,
}: MarketCurveProps) {
  const reduced = useReducedMotion()
  const gradientId = useId()

  const d =
    'M0,336 C64,330 96,306 148,300 S232,324 286,268 S368,196 428,230 S524,270 566,210 S664,134 726,166 S826,198 876,128 S968,64 1038,92 S1148,52 1200,28'

  const area = `${d} L1200,400 L0,400 Z`

  return (
    <svg
      className={className}
      viewBox="0 0 1200 400"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12a879" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#12a879" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={area}
            fill={`url(#${gradientId})`}
            initial={reduced || !animate ? undefined : { opacity: 0 }}
            whileInView={reduced || !animate ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: delay + 0.9 }}
          />
        </>
      )}

      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced || !animate ? undefined : { pathLength: 0, opacity: 0 }}
        whileInView={reduced || !animate ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          pathLength: { duration: 2.6, delay, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.5, delay },
        }}
      />
    </svg>
  )
}
