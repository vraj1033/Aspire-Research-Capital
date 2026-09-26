import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef, useState } from 'react'
import { siteImages } from '../data/images'
import { philosophyPrinciples } from '../data/site'
import { scrollToPosition } from '../hooks/useSmoothScroll'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { MarketCurve } from './ui/MarketCurve'
import { Reveal } from './ui/Reveal'

const total = philosophyPrinciples.length
const ease = [0.16, 1, 0.3, 1] as const

/**
 * Shared backdrop for both the pinned frame and the stacked mobile list.
 *
 * The photograph is blended in luminosity so it only ever contributes tone,
 * never colour — it stays monochrome navy whatever the source looks like. The
 * blend needs an opaque backdrop inside the same stacking context, which is
 * why the caller paints `bg-charcoal` on the frame that holds this.
 */
function PhilosophyBackdrop({ drift }: { drift?: MotionValue<string> }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Wider than the frame so a ±3% drift never exposes an edge. The blend
          mode lives on this wrapper, not the image: the drift transform makes
          the wrapper a stacking context, and a blend set inside it would only
          ever see a transparent backdrop. */}
      <motion.div
        className="absolute inset-y-0 -inset-x-[4%] mix-blend-luminosity"
        style={drift ? { x: drift } : undefined}
      >
        <img
          src={siteImages.philosophyBackdrop}
          alt=""
          width={1800}
          height={1100}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-[0.35]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/70 to-charcoal" />
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-700/25 blur-[160px]" />
      <MarketCurve
        className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-30"
        stroke="rgba(18, 168, 121, 0.35)"
        strokeWidth={1}
      />
      <div className="grain-layer absolute inset-0 opacity-[0.12] mix-blend-overlay" />
    </div>
  )
}

/**
 * A pinned passage.
 *
 * The section holds the viewport while scroll advances through five principles
 * one at a time. It is the one place on the page where scrolling drives
 * narrative rather than simply revealing layout — which is why nothing else on
 * the page pins.
 *
 * Below `lg` it degrades to an ordinary stacked list; pinning on a short phone
 * viewport costs more than it gives.
 *
 * The outer section clips with `overflow-clip`, not `overflow-hidden`: hidden
 * turns the ancestor into a scroll container and silently kills `sticky`,
 * while clip keeps the rounded curtain edge without touching scrolling.
 */
export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(total - 1, Math.max(0, Math.floor(value * total)))
    setIndex((prev) => (prev === next ? prev : next))
  })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  // The backdrop crosses the whole pinned scroll in a single slow pass.
  const backdropDrift = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])
  const active = philosophyPrinciples[index]
  const numeral = String(index + 1).padStart(2, '0')

  return (
    <section
      id="philosophy"
      // Curtain edge over the light section above. See note on overflow-clip.
      className="relative z-[1] -mt-8 overflow-clip rounded-t-[2.5rem] bg-charcoal text-bone shadow-[0_-30px_60px_-40px_rgba(7,24,44,0.5)] lg:-mt-12 lg:rounded-t-[3.5rem]"
    >
      {/* =============================================== DESKTOP: pinned */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${total * 85 + 60}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-charcoal">
          <PhilosophyBackdrop drift={reduced ? undefined : backdropDrift} />

          <Container className="relative">
            <div className="grid grid-cols-12 items-center gap-12">
              {/* Statement */}
              <div className="col-span-5">
                <Reveal y={14}>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold/70" />
                    <span className="eyebrow text-gold-soft">Market Philosophy</span>
                  </div>
                </Reveal>

                <AnimatedText
                  lines={[
                    'Great investing begins',
                    <>
                      with better <span className="editorial text-gold-soft">questions.</span>
                    </>,
                  ]}
                  // Sized so "Great investing begins" holds one line inside the
                  // five-column measure instead of orphaning a word.
                  className="mt-7 text-[clamp(1.9rem,3.05vw,2.8rem)] font-bold leading-[1.1] text-bone"
                />

                <p className="mt-8 max-w-[38ch] text-[0.95rem] leading-[1.8] text-bone/45">
                  Five steps that run in order, every time. Skipping one is how
                  conviction gets built on the wrong evidence.
                </p>
              </div>

              {/* Active principle */}
              <div className="relative col-span-7 pl-4 xl:pl-12">
                {/* Ghost numeral of the active step, outlined, behind the word.
                    Absolutely positioned so both numerals can crossfade in
                    place without ever touching layout. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -right-[8%] left-0 select-none"
                >
                  {reduced ? (
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[34vw] font-extrabold leading-none tracking-[-0.06em] text-transparent"
                      style={{ WebkitTextStroke: '1px rgba(247, 248, 244, 0.08)' }}
                    >
                      {numeral}
                    </span>
                  ) : (
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={numeral}
                        className="absolute right-0 top-1/2 font-display text-[34vw] font-extrabold leading-none tracking-[-0.06em] text-transparent"
                        style={{ WebkitTextStroke: '1px rgba(247, 248, 244, 0.08)', y: '-50%' }}
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -28 }}
                        transition={{ duration: 0.9, ease }}
                      >
                        {numeral}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>

                <div className="relative min-h-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.label}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -28 }}
                      transition={{ duration: 0.6, ease }}
                    >
                      <span className="font-display text-[0.75rem] font-bold tracking-[0.24em] text-gold/70">
                        {numeral} / {String(total).padStart(2, '0')}
                      </span>

                      <h3 className="mt-6 text-[clamp(3.2rem,6.4vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-bone">
                        {active.label}
                      </h3>

                      <p className="mt-8 max-w-[44ch] text-[clamp(1.05rem,1.4vw,1.32rem)] leading-[1.65] text-bone/60">
                        {active.body}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Container>

          {/* Stepper pinned to the base of the held screen. Carrying the index
              full-width anchors the composition and shows position at a glance,
              which a vertical list tucked in one column never did. */}
          <Container className="absolute inset-x-0 bottom-12">
            <ol className="grid grid-cols-5 gap-5">
              {philosophyPrinciples.map((principle, i) => (
                <li key={principle.label}>
                  {/* Each step is a jump: scroll progress maps linearly onto
                      the pinned range, so the midpoint of step i's slice is
                      the exact scroll position that shows it. */}
                  <button
                    type="button"
                    aria-label={`Show step ${i + 1}: ${principle.label}`}
                    aria-current={i === index ? 'step' : undefined}
                    onClick={() => {
                      const pinned = ref.current
                      if (!pinned) return
                      const top = pinned.getBoundingClientRect().top + window.scrollY
                      const range = pinned.offsetHeight - window.innerHeight
                      scrollToPosition(top + ((i + 0.5) / total) * range)
                    }}
                    className="group/step block w-full cursor-pointer text-left"
                  >
                  <span
                    aria-hidden="true"
                    className={`block h-px w-full transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/step:bg-emerald-soft ${
                      i <= index ? 'bg-emerald-soft' : 'bg-bone/12'
                    }`}
                  />
                  <div className="mt-3.5 flex items-baseline gap-2.5">
                    <span
                      className={`font-display text-[0.62rem] font-bold tracking-[0.2em] transition-colors duration-700 ${
                        i === index ? 'text-gold' : 'text-bone/25'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[0.92rem] font-semibold tracking-[-0.01em] transition-colors duration-700 ${
                        i === index ? 'text-bone' : 'text-bone/35'
                      }`}
                    >
                      {principle.label}
                    </span>
                  </div>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-6 h-px w-full bg-bone/8">
              <motion.span
                className="block h-px origin-left bg-gradient-to-r from-emerald-deep to-gold"
                style={{ width: reduced ? '100%' : progressWidth }}
              />
            </div>
          </Container>
        </div>
      </div>

      {/* =============================================== MOBILE: stacked */}
      <div className="relative py-24 sm:py-28 lg:hidden">
        <PhilosophyBackdrop />

        <Container className="relative">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold/70" />
            <span className="eyebrow text-gold-soft">Market Philosophy</span>
          </div>

          <AnimatedText
            lines={[
              'Great investing begins',
              <>
                with better <span className="editorial text-gold-soft">questions.</span>
              </>,
            ]}
            className="mt-6 text-[clamp(1.85rem,7vw,2.6rem)] font-bold leading-[1.1] text-bone"
          />

          <ol className="mt-12 space-y-10">
            {philosophyPrinciples.map((principle, i) => (
              <Reveal key={principle.label} delay={i * 0.04}>
                <li className="border-t border-bone/12 pt-6">
                  <span className="font-display text-[0.7rem] font-bold tracking-[0.24em] text-gold/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-bone">
                    {principle.label}
                  </h3>
                  <p className="mt-3.5 text-[0.97rem] leading-[1.75] text-bone/60">{principle.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </div>
    </section>
  )
}
