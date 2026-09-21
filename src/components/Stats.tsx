import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { impactStats } from '../data/site'
import { Container } from './ui/Container'
import { Counter } from './ui/Counter'
import { Reveal, RevealGroup, revealItem } from './ui/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * The top rule draws itself in as the block arrives. It rides the RevealGroup's
 * own variants rather than carrying a `whileInView` of its own: a line scaled
 * to zero has no area for an observer to see, so it could never trigger itself.
 */
const hairline = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.6, ease } },
}

/**
 * Numbers set as typography rather than packaged into cards. The figures carry
 * themselves; boxing them would only add furniture. Behind them a ghost "04"
 * — the count of figures — sits as a hollow watermark and slides a little
 * against the scroll, so the white block has depth without a photograph.
 *
 * DEMO FIGURES — see `impactStats` in src/data/site.ts.
 */
export function Stats() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const ghostX = useTransform(scrollYProgress, [0, 1], [48, -48])

  return (
    // `isolate` gives the section its own stacking context, so the -z-10 ghost
    // paints above the white background instead of vanishing behind it.
    <section
      ref={ref}
      aria-label="By the numbers"
      className="relative isolate overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <motion.span
        aria-hidden="true"
        style={
          reduced
            ? { WebkitTextStroke: '1px #07182c', color: 'transparent' }
            : { x: ghostX, WebkitTextStroke: '1px #07182c', color: 'transparent' }
        }
        className="pointer-events-none absolute -right-[2vw] top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[22vw] font-extrabold leading-none tracking-[-0.06em] opacity-[0.06]"
      >
        04
      </motion.span>

      <Container className="relative">
        <Reveal y={14}>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-emerald-deep/60" />
            <span className="eyebrow text-emerald-deep">Impact</span>
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.09}
          className="relative mt-10 grid grid-cols-2 gap-x-6 gap-y-12 pt-12 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8"
        >
          {/* The top rule, drawn left to right. Absolute, so it takes no cell. */}
          <motion.span
            aria-hidden="true"
            variants={reduced ? undefined : hairline}
            className="absolute inset-x-0 top-0 h-px origin-left bg-line"
          />

          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={reduced ? undefined : revealItem}
              className={`relative ${i === 0 ? '' : 'lg:pl-8'}`}
            >
              {/* Column rules, desktop only — never before the first figure */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 hidden h-[72%] w-px bg-line lg:block"
                />
              )}

              <p className="font-display text-[clamp(2.75rem,6.2vw,4.4rem)] font-extrabold leading-[0.9] tracking-[-0.055em] text-ink-950">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>

              <p className="mt-5 max-w-[20ch] text-[0.95rem] font-semibold leading-snug tracking-[-0.01em] text-ink-950">
                {stat.label}
              </p>

              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{stat.note}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
