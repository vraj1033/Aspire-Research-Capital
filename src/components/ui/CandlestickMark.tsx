import { motion, useReducedMotion } from 'framer-motion'

type Tone = 'light' | 'dark'

type CandlestickMarkProps = {
  /** Rendered size in px. The mark is square. */
  size?: number
  /** Plays the build-in once on mount: baseline and wicks draw, bodies grow. */
  animate?: boolean
  /** Seconds before the build-in starts. */
  delay?: number
  /**
   * The surface the mark sits on. `dark` (navy sections, the preloader) draws
   * the wicks in bone; `light` draws them in ink so the mark holds on the page.
   */
  tone?: Tone
  className?: string
}

type CandlestickGlyphProps = Pick<CandlestickMarkProps, 'size' | 'tone' | 'className'>

/**
 * Five sessions in a 64-unit box, read left to right: an ascent with one
 * setback. Each candle opens roughly where the previous one closed, so the
 * sequence is a coherent price path rather than five bars of decorative
 * height. `y` grows downward (SVG space): `top`/`bottom` bound the body,
 * `high`/`low` bound the wick.
 *
 * The third session is the setback — drawn at half weight rather than in a
 * loss colour, which keeps the mark to two hues. The fifth carries the single
 * gold accent.
 */
type Candle = {
  x: number
  high: number
  low: number
  top: number
  bottom: number
  kind: 'up' | 'down' | 'gold'
}

const CANDLES: Candle[] = [
  { x: 10, high: 33, low: 53, top: 38, bottom: 49, kind: 'up' },
  { x: 21, high: 24, low: 44, top: 28, bottom: 41, kind: 'up' },
  { x: 32, high: 26, low: 46, top: 30, bottom: 38, kind: 'down' },
  { x: 43, high: 16, low: 42, top: 21, bottom: 39, kind: 'up' },
  { x: 54, high: 5, low: 27, top: 9, bottom: 24, kind: 'gold' },
]

const BODY_WIDTH = 6
const BODY_RADIUS = 0.6
const BASELINE_D = 'M4 58 H60'

const EASE = [0.16, 1, 0.3, 1] as const
const STAGGER = 0.07

const wickPath = (c: Candle) => `M${c.x} ${c.low} V${c.high}`

/** Colour and stroke decisions shared by the animated mark and the glyph. */
const geometry = (tone: Tone, size: number) => ({
  wick: tone === 'dark' ? '#f7f8f4' : '#07182c',
  // Below ~40px a 1.5-unit wick thins to under a pixel and drops out, so the
  // small glyph carries a slightly heavier stroke.
  wickWidth: size < 40 ? 2.2 : 1.5,
})

const bodyStyle = (kind: Candle['kind']) => {
  if (kind === 'gold') return { fill: '#d6a928', fillOpacity: 1 }
  if (kind === 'down') return { fill: '#12a879', fillOpacity: 0.5 }
  return { fill: '#12a879', fillOpacity: 1 }
}

/**
 * Static candlestick mark for the nav, footer and anywhere else the brand
 * needs to sit at a small size with no motion attached.
 */
export function CandlestickGlyph({ size = 24, tone = 'dark', className = '' }: CandlestickGlyphProps) {
  const { wick, wickWidth } = geometry(tone, size)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={BASELINE_D} stroke={wick} strokeOpacity={0.18} strokeWidth={1} strokeLinecap="square" />
      {CANDLES.map((c) => (
        <g key={c.x}>
          <path
            d={wickPath(c)}
            stroke={wick}
            strokeOpacity={0.6}
            strokeWidth={wickWidth}
            strokeLinecap="round"
          />
          <rect
            x={c.x - BODY_WIDTH / 2}
            y={c.top}
            width={BODY_WIDTH}
            height={c.bottom - c.top}
            rx={BODY_RADIUS}
            {...bodyStyle(c.kind)}
          />
        </g>
      ))}
    </svg>
  )
}

/**
 * The animated candlestick mark used by the preloader.
 *
 * Build-in, in order: the baseline draws, then each wick draws upward from its
 * low, then each body grows out of its own bottom edge — all staggered 70ms
 * per session so the sequence reads as a market printing left to right.
 * Falls back to the static glyph when `animate` is off or motion is reduced.
 */
export function CandlestickMark({
  size = 56,
  animate = false,
  delay = 0,
  tone = 'dark',
  className = '',
}: CandlestickMarkProps) {
  const reduced = useReducedMotion()

  if (!animate || reduced) {
    return <CandlestickGlyph size={size} tone={tone} className={className} />
  }

  const { wick, wickWidth } = geometry(tone, size)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <motion.path
        d={BASELINE_D}
        stroke={wick}
        strokeOpacity={0.18}
        strokeWidth={1}
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay, ease: EASE }}
      />

      {CANDLES.map((c, i) => {
        const at = delay + i * STAGGER
        return (
          <g key={c.x}>
            <motion.path
              d={wickPath(c)}
              stroke={wick}
              strokeOpacity={0.6}
              strokeWidth={wickWidth}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: at + 0.12, ease: EASE }}
            />
            {/* originY: 1 — framer switches SVG transforms to `fill-box`, so
                the body scales up from its own bottom edge, not the viewBox. */}
            <motion.rect
              x={c.x - BODY_WIDTH / 2}
              y={c.top}
              width={BODY_WIDTH}
              height={c.bottom - c.top}
              rx={BODY_RADIUS}
              {...bodyStyle(c.kind)}
              style={{ originX: 0.5, originY: 1 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.55, delay: at + 0.22, ease: EASE }}
            />
          </g>
        )
      })}
    </svg>
  )
}
