import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useRef, useState } from 'react'
import type { Expertise as ExpertiseArea } from '../data/site'
import { expertiseAreas } from '../data/site'
import { Container } from './ui/Container'
import { RevealGroup, revealItem } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

/**
 * Keeps only a 1px ring of whatever is painted inside: the border-box layer
 * is punched out by the content-box layer (the span carries `p-px`), so the
 * rotating gradient beneath shows through as a hairline and nothing else.
 * Shorthands first, composites after — the shorthand would reset them.
 */
const ringMask: CSSProperties = {
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
}

/** A short comet: a long transparent tail, an emerald body, a gold head. */
const beamGradient =
  'conic-gradient(from 0deg, transparent 0deg 235deg, rgba(8, 127, 91, 0.85) 300deg, rgba(214, 169, 40, 0.95) 342deg, transparent 360deg)'

/* --------------------------------------------------------------- one cell */

function ExpertiseCell({ area, reduced }: { area: ExpertiseArea; reduced: boolean }) {
  // The beam is a continuous rotation, so it only spins while this cell is
  // hovered (mouse) or focused — never for all eight at once.
  const [beam, setBeam] = useState(false)

  return (
    <motion.article
      variants={reduced ? undefined : revealItem}
      tabIndex={0}
      onPointerEnter={(event) => {
        if (!reduced && event.pointerType === 'mouse') setBeam(true)
      }}
      onPointerLeave={() => setBeam(false)}
      onFocus={() => {
        if (!reduced) setBeam(true)
      }}
      onBlur={() => setBeam(false)}
      className="group relative isolate flex min-h-[248px] cursor-default flex-col justify-between overflow-hidden bg-bone p-7 outline-offset-[-2px] transition-colors duration-500 sm:p-8"
    >
      {/* Navy fill rises from the base */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink-950 transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />

      {/* Border beam — a masked ring over an oversized rotating conic square.
          The square is 200% wide so it still covers the corners of a wide
          cell at every angle. Transform channels are split: x/y are static
          in style, rotate is the only animated value. */}
      {!reduced && (
        <span
          aria-hidden="true"
          style={ringMask}
          className="pointer-events-none absolute inset-0 z-10 p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <motion.span
            className="absolute left-1/2 top-1/2 aspect-square w-[200%]"
            style={{ x: '-50%', y: '-50%', background: beamGradient }}
            initial={false}
            animate={{ rotate: beam ? 360 : 0 }}
            transition={
              beam ? { duration: 3.4, ease: 'linear', repeat: Infinity } : { duration: 0 }
            }
          />
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-[0.75rem] font-bold tracking-[0.22em] text-emerald-deep transition-colors duration-500 group-hover:text-gold group-focus-visible:text-gold">
          {area.number}
        </span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-ink-950/12 transition-all duration-500 group-hover:bg-emerald-soft group-focus-visible:bg-emerald-soft"
        />
      </div>

      <div className="mt-10">
        <h3 className="text-[1.18rem] font-bold leading-snug tracking-[-0.025em] text-ink-950 transition-colors duration-500 group-hover:text-bone group-focus-visible:text-bone">
          {area.title}
        </h3>

        {/* Summary slides out as the detail slides in — same slot, so
            the cell never changes height. */}
        <div className="relative mt-3 min-h-[4.6rem]">
          <p className="text-[0.87rem] leading-[1.7] text-muted transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:opacity-0 group-focus-visible:-translate-y-2 group-focus-visible:opacity-0">
            {area.summary}
          </p>
          <p className="absolute inset-0 translate-y-3 text-[0.87rem] leading-[1.7] text-bone/65 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {area.detail}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------- section */

/**
 * A ledger, not a card deck.
 *
 * The areas sit in a hairline grid — closer to a research contents page than to
 * the usual row of rounded boxes. Each cell inverts to navy on hover and pushes
 * a second line of detail up from beneath, so the extra information is earned
 * by interaction instead of crowding the page.
 *
 * Two pointer-only layers sit on top: a soft emerald spotlight that follows the
 * cursor across the whole grid, and a hairline beam that circles the hovered
 * cell. Both are decoration — the grid is complete without them.
 */
export function Expertise() {
  const reduced = useReducedMotion()

  /* ------------------------------------------------------------ spotlight */
  // Written straight to CSS variables on the wrapper — no React state on
  // pointermove, so the grid never re-renders while the cursor travels.
  const gridRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState(false)

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    gridRef.current.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    gridRef.current.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <section id="expertise" className="relative overflow-hidden bg-bone py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Expertise"
            lines={[
              'Where Research Meets',
              <span key="e" className="editorial text-emerald-deep">
                Experience.
              </span>,
            ]}
            className="max-w-3xl"
          />
          <p className="max-w-[34ch] pb-2 text-[0.95rem] leading-[1.8] text-muted">
            Eight disciplines that overlap more than they separate. The work moves between them
            depending on what a question actually requires.
          </p>
        </div>

        <div
          ref={gridRef}
          onPointerMove={handleMove}
          onPointerEnter={(event) => {
            if (!reduced && event.pointerType === 'mouse') setSpot(true)
          }}
          onPointerLeave={() => setSpot(false)}
          className="relative mt-14 lg:mt-20"
        >
          {/* Hairline grid built from gap-px over a rule-coloured surface */}
          <RevealGroup
            stagger={0.05}
            className="grid gap-px border-y border-line bg-line sm:grid-cols-2 xl:grid-cols-4"
          >
            {expertiseAreas.map((area) => (
              <ExpertiseCell key={area.number} area={area} reduced={reduced ?? false} />
            ))}
          </RevealGroup>

          {/* Cursor spotlight. Sits above the cells (they are opaque) but
              stays out of the hit-test, so hover on each cell is untouched. */}
          {!reduced && (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 ${
                spot ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background:
                  'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(8, 127, 91, 0.08), transparent 70%)',
              }}
            />
          )}
        </div>
      </Container>
    </section>
  )
}
