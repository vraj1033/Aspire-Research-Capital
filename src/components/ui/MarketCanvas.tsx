import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { isMotionPaused } from '../../hooks/useMotionPause'

type MarketCanvasProps = {
  className?: string
  /** Peak alpha of the brightest candle. Keep it low — this is atmosphere, not a chart. */
  alpha?: number
  /** Milliseconds between new candles entering from the right. */
  interval?: number
}

type Candle = { open: number; high: number; low: number; close: number }

/* Emerald-soft for advances, a muted rose for declines, bone for the average. */
const UP = '18, 168, 121'
const DOWN = '176, 74, 74'
const AVERAGE = '247, 248, 244'

const CANDLE_WIDTH = 3.5
const CANDLE_STEP = 8 // width + gap, in CSS px
const AVERAGE_PERIOD = 9
const MAX_DPR = 2

/** Approximately normal and cheap: three uniforms, recentred. */
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp((t - a) / (b - a), 0, 1)
  return x * x * (3 - 2 * x)
}

/**
 * Random walk with gentle mean reversion, so the series wanders but never
 * leaves the frame. Values are normalised 0–1; there is no price here.
 */
function nextCandle(prev: Candle | undefined): Candle {
  const open = prev ? prev.close : 0.5
  const drift = (0.5 - open) * 0.05
  const close = clamp(open + gauss() * 0.035 + drift, 0.06, 0.94)
  const high = Math.min(Math.max(open, close) + Math.abs(gauss()) * 0.014, 0.98)
  const low = Math.max(Math.min(open, close) - Math.abs(gauss()) * 0.014, 0.02)
  return { open, high, low, close }
}

/**
 * A slowly drifting, generative candlestick series — decorative only.
 *
 * NOT real data: no numbers, no axes, no symbols. Slim candles with thin wicks
 * and one faint moving average drift left as a new candle forms roughly every
 * second. A vertical mask dissolves it into the section, and the left third is
 * drawn fainter so whatever copy sits over it stays legible.
 *
 * Housekeeping: DPR-aware (capped at 2), resize-safe, cancels its frame on
 * unmount, pauses when the tab is hidden or the canvas is off-screen, and
 * renders a single static frame under `prefers-reduced-motion`.
 */
export function MarketCanvas({ className = '', alpha = 0.35, interval = 1100 }: MarketCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let candles: Candle[] = []
    let offset = 0 // px drifted since the last candle was committed
    let viewLow = 0.3
    let viewHigh = 0.7
    let averageStroke: CanvasGradient | string = 'transparent'
    let raf = 0
    let last = 0
    let running = false
    let inView = false

    const capacity = () => Math.ceil(width / CANDLE_STEP) + 3

    /** Eases the visible range toward the series' extent; weight 1 snaps. */
    const fitRange = (weight: number) => {
      let lo = 1
      let hi = 0
      for (const c of candles) {
        if (c.low < lo) lo = c.low
        if (c.high > hi) hi = c.high
      }
      const pad = (hi - lo) * 0.18 + 0.02
      viewLow += (lo - pad - viewLow) * weight
      viewHigh += (hi + pad - viewHigh) * weight
    }

    const seed = () => {
      candles = []
      for (let i = 0; i < capacity(); i++) candles.push(nextCandle(candles[candles.length - 1]))
      fitRange(1)
    }

    const toY = (v: number) => height - ((v - viewLow) / (viewHigh - viewLow)) * height

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const n = candles.length
      const xOf = (i: number) => width + CANDLE_WIDTH - offset - (n - 1 - i) * CANDLE_STEP

      for (let i = 0; i < n; i++) {
        const c = candles[i]
        const x = xOf(i)
        if (x < -CANDLE_STEP) continue

        // Quieter on the left, where the copy column lives.
        const a = alpha * (0.3 + 0.7 * smoothstep(0.12, 0.6, x / width))
        const colour = c.close >= c.open ? UP : DOWN

        ctx.strokeStyle = `rgba(${colour}, ${a * 0.7})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, toY(c.high))
        ctx.lineTo(x, toY(c.low))
        ctx.stroke()

        const top = toY(Math.max(c.open, c.close))
        const bottom = toY(Math.min(c.open, c.close))
        ctx.fillStyle = `rgba(${colour}, ${a})`
        ctx.fillRect(x - CANDLE_WIDTH / 2, top, CANDLE_WIDTH, Math.max(1, bottom - top))
      }

      // One faint moving average threading through the series.
      ctx.strokeStyle = averageStroke
      ctx.lineWidth = 1
      ctx.lineJoin = 'round'
      ctx.beginPath()
      let sum = 0
      let started = false
      for (let i = 0; i < n; i++) {
        sum += candles[i].close
        if (i >= AVERAGE_PERIOD) sum -= candles[i - AVERAGE_PERIOD].close
        if (i < AVERAGE_PERIOD - 1) continue
        const x = xOf(i)
        const y = toY(sum / AVERAGE_PERIOD)
        if (started) ctx.lineTo(x, y)
        else {
          ctx.moveTo(x, y)
          started = true
        }
      }
      ctx.stroke()
    }

    const step = (dt: number) => {
      offset += (CANDLE_STEP / interval) * dt

      // The newest candle keeps forming until it is committed.
      const live = candles[candles.length - 1]
      if (live) {
        live.close = clamp(live.close + gauss() * 0.0035 * (dt / 16), 0.04, 0.96)
        live.high = Math.max(live.high, live.close)
        live.low = Math.min(live.low, live.close)
      }

      while (offset >= CANDLE_STEP) {
        offset -= CANDLE_STEP
        candles.push(nextCandle(candles[candles.length - 1]))
        if (candles.length > capacity()) candles.shift()
      }

      fitRange(1 - Math.exp(-dt / 900))
    }

    const frame = (now: number) => {
      if (!running) return
      // The reader's pause control holds the series still. The loop keeps
      // ticking so it resumes the instant the attribute is cleared, but the
      // clock resets so there is no catch-up jump.
      if (isMotionPaused()) {
        last = 0
        raf = requestAnimationFrame(frame)
        return
      }
      const dt = last ? Math.min(now - last, 64) : 16
      last = now
      step(dt)
      draw()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      last = 0
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const sync = () => {
      if (inView && !document.hidden) start()
      else stop()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = Math.round(rect.width)
      height = Math.round(rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, `rgba(${AVERAGE}, 0)`)
      gradient.addColorStop(0.45, `rgba(${AVERAGE}, ${alpha * 0.4})`)
      gradient.addColorStop(1, `rgba(${AVERAGE}, ${alpha * 0.55})`)
      averageStroke = gradient

      if (candles.length < capacity()) seed()
      draw()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersection = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    intersection.observe(canvas)

    document.addEventListener('visibilitychange', sync)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [alpha, interval, reduced])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, #000 32%, #000 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 32%, #000 78%, transparent 100%)',
      }}
    />
  )
}
