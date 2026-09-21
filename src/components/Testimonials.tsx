import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { testimonials } from '../data/site'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'

const AUTO_ADVANCE_MS = 7600

/**
 * Editorial testimonial carousel.
 *
 * Set as a quotation, not as a review card — no avatars, no star ratings, no
 * boxes. Auto-advance pauses on hover and focus and never runs under reduced
 * motion, and the controls are real buttons so the section is fully operable
 * from the keyboard.
 *
 * DEMO TESTIMONIALS — see `testimonials` in src/data/site.ts.
 */
export function Testimonials() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  const go = useCallback((step: number) => {
    setState(([current]) => [
      (current + step + testimonials.length) % testimonials.length,
      step >= 0 ? 1 : -1,
    ])
  }, [])

  useEffect(() => {
    if (paused || reduced) return
    const id = window.setInterval(() => go(1), AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [paused, reduced, go])

  const active = testimonials[index]
  const offset = reduced ? 0 : 42

  return (
    <section
      aria-label="What people say"
      className="relative overflow-hidden bg-bone py-24 sm:py-32 lg:py-40"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — framing and controls */}
          <div className="lg:col-span-4">
            <Reveal y={14}>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-emerald-deep/60" />
                <span className="eyebrow text-emerald-deep">Community</span>
              </div>
            </Reveal>

            <AnimatedText
              lines={[
                'Read by people',
                <>
                  who <span className="editorial text-emerald-deep">think.</span>
                </>,
              ]}
              className="mt-6 text-[clamp(1.75rem,3.4vw,2.6rem)] font-bold leading-[1.1] text-ink-950"
            />

            <Reveal delay={0.12}>
              <div className="mt-10 flex items-center gap-5">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink-950 transition-all duration-400 hover:border-ink-950 hover:bg-ink-950 hover:text-bone"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink-950 transition-all duration-400 hover:border-ink-950 hover:bg-ink-950 hover:text-bone"
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>

                <span className="font-display text-[0.8rem] font-bold tracking-[0.12em] text-muted">
                  {String(index + 1).padStart(2, '0')}
                  <span className="mx-1 text-ink-950/20">/</span>
                  {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right — the quote */}
          <div className="lg:col-span-8 lg:pl-6">
            <div
              className="relative min-h-[260px] sm:min-h-[240px]"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.figure
                  key={active.name}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * offset }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -offset }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-ink-950/15 pt-8"
                >
                  <blockquote>
                    <p className="text-[clamp(1.2rem,2.6vw,1.95rem)] font-medium leading-[1.45] tracking-[-0.025em] text-ink-950">
                      <span className="editorial mr-1 text-gold">&ldquo;</span>
                      {active.quote}
                      <span className="editorial ml-0.5 text-gold">&rdquo;</span>
                    </p>
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-3.5">
                    <span className="h-px w-7 bg-gold" aria-hidden="true" />
                    <span className="text-[0.88rem] font-semibold tracking-[-0.01em] text-ink-950">
                      {active.name}
                    </span>
                    <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                    <span className="text-[0.82rem] text-muted">{active.role}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Progress ticks */}
            <div className="mt-8 flex gap-1.5">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index}
                  className="group h-6 flex-1"
                >
                  <span
                    className={`block h-[2px] w-full transition-colors duration-500 ${
                      i === index ? 'bg-ink-950' : 'bg-line group-hover:bg-muted'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
