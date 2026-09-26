import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mediaAppearances, mediaLogos } from '../data/site'
import { fromAppearance, useReader } from './ArticleReader'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

/**
 * Two-letter monogram for an outlet: first and last word initials, ignoring a
 * leading article, so "The Market Desk" becomes MD rather than TD.
 */
function monogram(outlet: string) {
  const words = outlet.split(/\s+/).filter((word) => word.toLowerCase() !== 'the')
  const first = words[0] ?? outlet
  const last = words[words.length - 1] ?? first
  if (words.length <= 1) return first.slice(0, 2).toUpperCase()
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

/**
 * Recognition.
 *
 * The card rail is a native horizontally-scrolling list with click-and-drag
 * layered on top. Building it on real scroll rather than a transform means
 * keyboard, trackpad, touch and scrollbar all work without extra code — the
 * drag is an enhancement for mouse users, not the mechanism.
 *
 * DEMO APPEARANCES — see `mediaAppearances` in src/data/site.ts.
 */
export function Media() {
  const railRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [canScroll, setCanScroll] = useState({ left: false, right: true })
  const reduced = useReducedMotion()

  const drag = useRef({ startX: 0, startScroll: 0, moved: 0 })
  const reader = useReader()

  const updateArrows = useCallback(() => {
    const el = railRef.current
    if (!el) return
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    })
  }, [])

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [updateArrows])

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || !railRef.current) return
    setDragging(true)
    drag.current = {
      startX: event.clientX,
      startScroll: railRef.current.scrollLeft,
      moved: 0,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging || !railRef.current) return
    const delta = event.clientX - drag.current.startX
    drag.current.moved = Math.abs(delta)
    railRef.current.scrollLeft = drag.current.startScroll - delta
  }

  const endDrag = () => setDragging(false)

  const nudge = (direction: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 460), behavior: 'smooth' })
  }

  // Lift and shadow are transform/box-shadow only — the card's box never
  // changes size, so the snap points and scroll-padding stay exact.
  const cardHover = reduced
    ? ''
    : 'transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-30px_rgba(7,24,44,0.35)]'

  return (
    <section id="media" className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Recognition"
            lines={[
              'In The',
              <span key="s" className="editorial text-emerald-deep">
                Spotlight.
              </span>,
            ]}
            intro="Conversations, keynotes and contributed writing across podcasts, publications and investor events."
            className="max-w-xl"
          />

          {/* Rail controls */}
          <Reveal delay={0.1} className="hidden pb-3 sm:block">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={!canScroll.left}
                aria-label="Previous appearances"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink-950 transition-all duration-400 enabled:hover:border-ink-950 enabled:hover:bg-ink-950 enabled:hover:text-bone disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={!canScroll.right}
                aria-label="More appearances"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink-950 transition-all duration-400 enabled:hover:border-ink-950 enabled:hover:bg-ink-950 enabled:hover:text-bone disabled:opacity-30"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* ---------------------------------------------------------- rail */}
      <Reveal delay={0.06}>
        <div
          ref={railRef}
          onScroll={updateArrows}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          // The rail bleeds to the right edge of the screen but its first card
          // must line up with `Container`'s text column. `--gutter` mirrors the
          // Container padding, and the calc adds the centring margin once the
          // viewport is wider than the 1380px measure.
          //
          // scroll-padding has to match, or `snap-start` parks the first card
          // against the scrollport edge and it bleeds off the side of the page.
          data-cursor="Drag"
          className={`hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [--gutter:1.25rem] pl-[calc(max(var(--gutter),(100vw-1380px)/2+var(--gutter)))] pr-5 scroll-pl-[calc(max(var(--gutter),(100vw-1380px)/2+var(--gutter)))] sm:[--gutter:2rem] lg:mt-16 lg:[--gutter:3rem] xl:[--gutter:4rem] ${
            dragging ? 'cursor-grabbing select-none' : 'lg:cursor-grab'
          }`}
        >
          {mediaAppearances.map((item) => (
            <article
              key={item.title}
              className={`group w-[78vw] max-w-[380px] shrink-0 snap-start border-t border-ink-950/15 bg-white pt-6 sm:w-[46vw] lg:w-[31vw] ${cardHover}`}
            >
              {/* The whole card opens the appearance in the reader. A drag on
                  the rail that ends over a card is not a click. */}
              <button
                type="button"
                onClick={() => {
                  if (drag.current.moved > 6) return
                  reader.open(fromAppearance(item))
                }}
                aria-label={`Open: ${item.outlet} — ${item.title}`}
                className="block w-full cursor-pointer text-left"
              >
              <span className="flex items-center justify-between gap-4">
                {/* Outlet monogram — stands in for the logo until rights are
                    confirmed. Decorative: the outlet name follows in text. */}
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-950 font-display text-[0.72rem] font-extrabold tracking-[0.08em] text-ink-950 transition-colors duration-500 group-hover:bg-ink-950 group-hover:text-bone"
                >
                  {monogram(item.outlet)}
                </span>

                <span className="flex items-center gap-3">
                  <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-emerald-deep">
                    {item.type.toUpperCase()}
                  </span>
                  <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                  <span className="text-[0.72rem] text-muted">{item.year}</span>
                </span>
              </span>

              <span className="mt-5 block font-display text-[1.05rem] font-extrabold tracking-[-0.02em] text-ink-950">
                {item.outlet}
              </span>

              <span className="mt-3 block min-h-[3.4rem] text-[0.92rem] leading-[1.65] text-muted">
                {item.title}
              </span>

              <span className="mt-6 flex items-center gap-2 text-[0.76rem] font-semibold text-ink-950/60 transition-colors duration-400 group-hover:text-ink-950">
                View
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              </button>
            </article>
          ))}

          {/* Trailing spacer so the last card can clear the gutter */}
          <span aria-hidden="true" className="w-1 shrink-0 sm:w-8" />
        </div>
      </Reveal>

      {/* --------------------------------------------------- logo strip */}
      <Container>
        <Reveal delay={0.1}>
          <div className="mt-16 border-t border-line pt-10 lg:mt-24">
            <p className="eyebrow text-muted">Featured &amp; Published In</p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {mediaLogos.map((logo) => (
                <li key={logo} className="text-center">
                  {/* Placeholder wordmarks — swap for the client's real media
                      logos (SVG preferred) when rights are confirmed. The
                      underline is sized to the text, not the cell. */}
                  <span className="group/logo relative inline-block cursor-default font-display text-[0.78rem] font-extrabold tracking-[0.1em] text-ink-950/30 transition-colors duration-500 hover:text-ink-950 lg:text-[0.72rem]">
                    {logo}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-emerald-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-x-100"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
