import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { siteImages } from '../data/images'
import { brand, pillars } from '../data/site'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { MagneticButton } from './ui/MagneticButton'
import { MarketCurve } from './ui/MarketCurve'
import { Reveal, RevealGroup, revealItem } from './ui/Reveal'

/* Custom line marks — drawn for these three ideas specifically, rather than
   pulled from an icon set, so they read as part of the identity. */
function PillarMark({ index }: { index: number }) {
  const common = {
    width: 34,
    height: 34,
    viewBox: '0 0 34 34',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.15,
    strokeLinecap: 'round' as const,
    'aria-hidden': true,
    focusable: 'false' as const,
  }

  if (index === 0) {
    // Research — an aperture narrowing on a point
    return (
      <svg {...common}>
        <circle cx="15" cy="15" r="9.5" />
        <circle cx="15" cy="15" r="3.2" />
        <path d="M22 22 L30 30" />
      </svg>
    )
  }

  if (index === 1) {
    // Perspective — converging sightlines across a horizon
    return (
      <svg {...common}>
        <path d="M2 24 L32 24" />
        <path d="M6 24 L17 6 L28 24" />
        <path d="M11.5 24 L17 15 L22.5 24" />
      </svg>
    )
  }

  // Education — ascending understanding
  return (
    <svg {...common}>
      <path d="M3 29 L11 29 L11 21" />
      <path d="M13 29 L21 29 L21 14" />
      <path d="M23 29 L31 29 L31 6" />
      <path d="M3 22 L31 4" strokeDasharray="2 3" />
    </svg>
  )
}

/* Cursor spotlight painted per cell. Each cell owns its own --sx/--sy so the
   gradient centre is in that cell's coordinate space; only the hovered cell
   fades its overlay in (Tailwind v4 media-gates `hover` to pointer devices,
   so touch never sees a stuck highlight). Emerald stays at 10% alpha. */
const spotlight =
  'radial-gradient(240px circle at var(--sx, 50%) var(--sy, 50%), rgba(18, 168, 121, 0.10), transparent 70%)'

export function AspireVision() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Backdrop drifts with the scroll; the ghost wordmark drifts the other way,
  // so the two planes separate and the section reads as deep rather than flat.
  const backdropY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [90, -70])

  const handleSpotlight = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !gridRef.current) return
    const cells = gridRef.current.querySelectorAll<HTMLElement>('[data-spot]')
    cells.forEach((cell) => {
      const rect = cell.getBoundingClientRect()
      cell.style.setProperty('--sx', `${event.clientX - rect.left}px`)
      cell.style.setProperty('--sy', `${event.clientY - rect.top}px`)
    })
  }

  return (
    <section
      id="vision"
      ref={sectionRef}
      // Curtain edge: the dark block rises over the light section above it.
      className="relative z-[1] -mt-8 overflow-hidden rounded-t-[2.5rem] bg-ink-950 py-24 shadow-[0_-30px_60px_-40px_rgba(7,24,44,0.5)] sm:py-32 lg:-mt-12 lg:rounded-t-[3.5rem] lg:py-44"
    >
      {/* ------------------------------------------------------ backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Oversized on the vertical axis so the parallax never exposes an edge */}
        <motion.div
          className="absolute inset-x-0 -inset-y-[8%]"
          style={reduced ? undefined : { y: backdropY }}
        >
          <img
            src={siteImages.visionBackdrop}
            alt=""
            width={1800}
            height={1100}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-[0.28]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/85 to-ink-950" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute -bottom-[12%] -left-[10%] h-[620px] w-[620px] rounded-full bg-emerald-deep/12 blur-[150px]" />

        <MarketCurve
          className="absolute inset-x-0 bottom-0 h-[38%] w-full opacity-45"
          stroke="rgba(214, 169, 40, 0.28)"
          strokeWidth={1}
          delay={0.2}
        />
        <div className="grain-layer absolute inset-0 opacity-[0.14] mix-blend-overlay" />

        {/* Ghost wordmark — outline only, anchored to the bottom-right corner */}
        <motion.span
          className="absolute -bottom-[0.16em] -right-[0.04em] select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none tracking-[-0.06em] text-transparent"
          style={{
            WebkitTextStroke: '1px rgba(247, 248, 244, 0.10)',
            ...(reduced ? {} : { y: wordmarkY }),
          }}
        >
          {brand.shortName}
        </motion.span>
      </div>

      <Container className="relative">
        {/* ------------------------------------------------- statement */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal y={14}>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/70" />
                <span className="eyebrow text-gold-soft">The Vision</span>
              </div>
            </Reveal>

            <AnimatedText
              lines={[
                'Research before',
                <span key="r" className="editorial text-gold-soft">
                  reaction.
                </span>,
              ]}
              className="mt-6 text-[clamp(2.4rem,6.4vw,5rem)] font-bold leading-[1] tracking-[-0.045em] text-bone"
            />
          </div>

          <div className="flex items-end lg:col-span-5">
            <div className="space-y-5 text-[clamp(0.98rem,1.1vw,1.08rem)] leading-[1.8] text-bone/60">
              <Reveal delay={0.08}>
                <p>
                  {brand.company} exists for the investor who wants to understand the decision, not
                  just receive it. Every note begins with evidence, states its reasoning, and is
                  honest about what remains uncertain.
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-bone/45">
                  Three disciplines hold it together — and none of them works without the other two.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- pillars */}
        <Reveal y={10} className="mt-20 lg:mt-28">
          <div className="flex items-center gap-5">
            <span className="eyebrow whitespace-nowrap text-bone/40">
              {String(pillars.length).padStart(2, '0')} disciplines
              <span className="mx-2 text-gold/70" aria-hidden="true">
                ·
              </span>
              one method
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-bone/10" />
          </div>
        </Reveal>

        <div ref={gridRef} onPointerMove={handleSpotlight} className="relative mt-6">
          <RevealGroup className="grid gap-px overflow-hidden border-t border-bone/12 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <motion.article
                key={pillar.number}
                data-spot=""
                variants={reduced ? undefined : revealItem}
                className="group relative bg-ink-950 pt-10 sm:px-7 sm:first:pl-0 sm:last:pr-0"
              >
                {/* Cursor spotlight — pointer-only, off under reduced motion */}
                {!reduced && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: spotlight }}
                  />
                )}
                {/* Hairline that fills on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 block h-px origin-left scale-x-0 bg-gradient-to-r from-emerald-soft to-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 sm:first:left-0"
                />
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-px top-0 hidden h-full w-px bg-bone/10 sm:block"
                  />
                )}

                {/* Content is positioned so it paints above the spotlight */}
                <div className="relative">
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-display text-[0.8rem] font-bold tracking-[0.2em] text-gold/70">
                      {pillar.number}
                    </span>
                    <span className="text-bone/35 transition-colors duration-500 group-hover:text-emerald-soft">
                      <PillarMark index={i} />
                    </span>
                  </div>

                  <h3 className="mt-8 text-[clamp(1.4rem,2.2vw,1.85rem)] font-bold tracking-[-0.03em] text-bone">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-[38ch] pb-10 text-[0.95rem] leading-[1.8] text-bone/55">
                    {pillar.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <MagneticButton variant="light" withArrow onClick={() => scrollToSection('research')}>
            Explore {brand.company}
          </MagneticButton>
        </Reveal>
      </Container>
    </section>
  )
}
