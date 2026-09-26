import { Pause, Play } from 'lucide-react'
import { tickerDisclaimer, tickerDisclaimerShort, tickerItems, type TickerDirection } from '../data/ticker'
import { useMotionPause } from '../hooks/useMotionPause'
import { Marquee } from './ui/Marquee'

/* Emerald-soft for advances; a dusty rose for declines — never an alert red.
   Both clear 4.5:1 against ink-950 at the sizes used here. */
const emerald = '#12a879'
const rose = '#d98b8b'

function Delta({ direction }: { direction: TickerDirection }) {
  const up = direction === 'up'
  return (
    <svg viewBox="0 0 8 8" width="7" height="7" aria-hidden="true" focusable="false" className="shrink-0">
      <path d={up ? 'M4 1.2 7.2 6.8H0.8Z' : 'M4 6.8 0.8 1.2h6.4Z'} fill={up ? emerald : rose} />
    </svg>
  )
}

type TickerTapeProps = { className?: string }

/**
 * One thin line of market symbols pinned to the hero's floor.
 *
 * It exists to set a mood, not to inform — the values are static placeholders
 * (see src/data/ticker.ts), so the strip is permanently labelled illustrative.
 * Kept to 44px and a single weight of type so the headline above stays the
 * loudest thing in the frame. The marquee pauses on hover.
 */
export function TickerTape({ className = '' }: TickerTapeProps) {
  const [paused, togglePaused] = useMotionPause()

  return (
    <aside
      aria-label="Illustrative market ticker — demo values, not live data"
      className={`flex h-11 items-stretch border-t border-bone/10 bg-ink-950/60 backdrop-blur-md ${className}`}
    >
      <p className="eyebrow flex shrink-0 items-center border-r border-bone/10 px-4 text-[0.5rem] tracking-[0.18em] text-gold/70 sm:px-6 sm:text-[0.58rem] sm:tracking-[0.22em]">
        <span className="sm:hidden">{tickerDisclaimerShort}</span>
        <span className="hidden sm:inline">{tickerDisclaimer}</span>
      </p>

      <div className="flex min-w-0 flex-1 items-center">
        <Marquee duration={60} className="w-full">
          {tickerItems.map((item) => (
            <span key={item.symbol} className="flex items-center gap-2.5 whitespace-nowrap px-4 sm:px-7">
              <span className="eyebrow text-[0.56rem] tracking-[0.16em] text-bone/70 sm:text-[0.62rem] sm:tracking-[0.2em]">
                {item.symbol}
              </span>
              <span className="font-display text-[0.7rem] font-semibold tabular-nums tracking-[-0.01em] text-bone sm:text-[0.78rem]">
                {item.value}
              </span>
              <span
                className="flex items-center gap-1 text-[0.62rem] font-medium tabular-nums sm:text-[0.68rem]"
                style={{ color: item.direction === 'up' ? emerald : rose }}
              >
                <Delta direction={item.direction} />
                {item.change}
              </span>
              <span aria-hidden="true" className="ml-2 h-[3px] w-[3px] rotate-45 bg-bone/20 sm:ml-4" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* One control for every auto-moving element on the page — the ticker,
          the marquees and the hero canvas. Hover-to-pause is not enough for
          keyboard and touch users. */}
      <button
        type="button"
        onClick={togglePaused}
        aria-pressed={paused}
        aria-label={paused ? 'Resume moving content' : 'Pause moving content'}
        title={paused ? 'Resume moving content' : 'Pause moving content'}
        className="flex w-11 shrink-0 items-center justify-center border-l border-bone/10 text-bone/55 transition-colors duration-300 hover:bg-bone/5 hover:text-bone"
      >
        {paused ? (
          <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden="true" />
        ) : (
          <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden="true" />
        )}
      </button>
    </aside>
  )
}
