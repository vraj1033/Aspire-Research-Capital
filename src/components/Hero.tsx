import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { siteImages } from '../data/images'
import { brand } from '../data/site'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { TickerTape } from './TickerTape'
import { Container } from './ui/Container'
import { MagneticButton } from './ui/MagneticButton'
import { MarketCanvas } from './ui/MarketCanvas'
import { MarketCurve } from './ui/MarketCurve'

const ease = [0.16, 1, 0.3, 1] as const

const trustIndicators = ['Research-first approach', 'Investor education', 'Market perspective']

/* The headline, one entry per visual line. Only the closing word is styled. */
type Word = { text: string; className?: string }
const headline: Word[][] = [
  [{ text: 'Building' }, { text: 'Clarity' }],
  [{ text: 'in' }, { text: 'Complex' }, { text: 'Markets.', className: 'editorial text-gold-soft' }],
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease },
  }),
}

/* Each word rises out of its line mask while sharpening from a soft blur. The
   filter is cleared once settled so the type rasterises crisply afterwards. */
const wordReveal = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(10px)' },
  visible: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.05, ease },
    transitionEnd: { filter: 'none' },
  },
}

/* ------------------------------------------------------------ live clock */

const istFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Asia/Kolkata',
})
const nowInMumbai = () => istFormatter.format(new Date())

/** Real wall-clock time in Mumbai, refreshed every 30s. This is not demo data. */
function useMumbaiClock() {
  const [time, setTime] = useState(nowInMumbai)
  useEffect(() => {
    const id = window.setInterval(() => setTime(nowInMumbai()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

/* ------------------------------------------------------- small fragments */

/** A static, decorative sparkline — it draws itself in once with the chips. */
function Sparkline({ play, reduced }: { play: boolean; reduced: boolean }) {
  return (
    <svg
      width="40"
      height="16"
      viewBox="0 0 40 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <motion.path
        d="M1 12.5 L7 9.5 L12 11 L18 6.5 L24 8 L30 3.5 L39 2"
        stroke="#12a879"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? undefined : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: play ? 1 : 0 }}
        transition={{ duration: 1.4, delay: 1.75, ease }}
      />
      <circle cx="39" cy="2" r="1.6" fill="#12a879" />
    </svg>
  )
}

type ChipProps = {
  children: ReactNode
  className: string
  delay: number
  state: 'hidden' | 'visible'
  reduced: boolean
}

/** Floating annotation pinned along the portrait's orbit ring. Desktop only. */
function AnnotationChip({ children, className, delay, state, reduced }: ChipProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial={reduced ? undefined : 'hidden'}
      animate={reduced ? undefined : state}
      className={`absolute z-10 hidden items-center gap-3 rounded-full border border-bone/12 bg-ink-900/70 py-2.5 pl-4 pr-5 backdrop-blur-xl lg:flex ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ hero */

type HeroProps = {
  /**
   * App can hold every entrance in its hidden state until the preloader
   * curtain lifts, then flip this to true to play them all in sequence.
   */
  ready?: boolean
}

export function Hero({ ready = true }: HeroProps) {
  const reduced = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const time = useMumbaiClock()

  const state = ready ? 'visible' : 'hidden'
  const play = !reduced && ready

  /** Entrance props for anything that simply fades up; a no-op under reduced motion. */
  const entrance = (delay: number) =>
    reduced ? {} : { variants: fadeUp, initial: 'hidden' as const, animate: state, custom: delay }

  // Scroll-out: progress runs 0 → 1 as the section leaves through the top of
  // the viewport. The copy lifts away first, the portrait settles back, and the
  // photography keeps its slower parallax underneath.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 0.7], [0, -60])
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const copyStyle = reduced ? undefined : { opacity: copyOpacity, y: copyY }

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink-950 pb-24 pt-28 sm:pb-28 lg:pb-32 lg:pt-24"
    >
      {/* ---------------------------------------------------- background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/*
          Photography, parallaxed as a pair. The candlestick screen carries the
          section; the glowing chart lines breathe over it on an 11s cross-fade
          so the surface never reads as a still. Ken Burns lives on the image,
          parallax on the wrapper — two elements, so the transforms never fight.
        */}
        <motion.div style={reduced ? undefined : { y: backdropY }} className="absolute inset-0">
          <motion.img
            src={siteImages.heroBackdrop}
            alt=""
            width={1900}
            height={1200}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            initial={reduced ? undefined : { scale: 1, opacity: 0.3 }}
            animate={reduced ? undefined : { scale: 1.08, opacity: 0.24 }}
            transition={{
              scale: { duration: 28, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
              opacity: { duration: 11, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
            }}
            className="h-full w-full object-cover opacity-30 saturate-[0.35]"
          />
          <motion.img
            src={siteImages.heroBackdropAlt}
            alt=""
            width={1900}
            height={1200}
            loading="eager"
            decoding="async"
            initial={reduced ? undefined : { opacity: 0.08 }}
            animate={reduced ? undefined : { opacity: 0.18 }}
            transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
            className="absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-screen saturate-[0.5]"
          />
        </motion.div>

        {/* Grade the photograph into the palette: a navy colour wash, then the
            legibility gradients that keep the headline column at ≥ 4.5:1. */}
        <div className="absolute inset-0 bg-ink-800 opacity-70 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/35" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/85 to-transparent" />

        {/* Radial lighting: one warm source low-left, one cool high-right */}
        <div className="absolute -left-[18%] bottom-[-22%] h-[680px] w-[680px] rounded-full bg-emerald-deep/18 blur-[140px]" />
        <div className="absolute -right-[12%] -top-[18%] h-[560px] w-[560px] rounded-full bg-ink-600/30 blur-[130px]" />

        <div className="bg-grid absolute inset-0 opacity-60" />

        {/* Generative candlesticks drifting along the floor — atmosphere, not a chart */}
        <div className="mask-fade-x absolute inset-x-0 bottom-0 h-[48%]">
          <MarketCanvas className="h-full w-full opacity-60 sm:opacity-100" />
        </div>

        {/* The market curve still draws itself in, now as a whisper behind the photo */}
        <MarketCurve
          className="absolute inset-x-0 bottom-0 h-[52%] w-full opacity-20 sm:opacity-35"
          stroke="rgba(18, 168, 121, 0.4)"
          strokeWidth={1}
          fill
          delay={0.9}
        />

        <div className="grain-layer absolute inset-0 opacity-[0.16] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* ---------------------------------------------------- content */}
      <Container className="relative z-10">
        {/*
          Three blocks rather than two columns.

          On desktop the text stacks in the left column with the portrait
          spanning both rows beside it. On mobile the portrait slots BETWEEN the
          headline and the supporting copy, so the founder is on screen in the
          first view instead of being pushed a full screen down by the CTAs.
        */}
        <div className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 xl:gap-x-14">
          {/* A — eyebrow + headline */}
          <motion.div
            style={copyStyle}
            className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 xl:col-span-6"
          >
            <motion.div {...entrance(0.15)} className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-gold/70" />
              <p className="eyebrow text-[0.62rem] tracking-[0.16em] text-gold-soft sm:text-[0.6875rem] sm:tracking-[0.22em]">
                Founder <span className="mx-1.5 text-gold/40">•</span> Market Researcher
                <span className="mx-1.5 text-gold/40">•</span> Investor
              </p>
            </motion.div>

            {/* Two masked lines, each word rising and sharpening on a 60ms stagger */}
            <h1 className="mt-6 text-[clamp(2.35rem,7.1vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.045em] text-bone">
              {reduced ? (
                headline.map((line, i) => (
                  <span key={i} className="block">
                    {line.map((w, j) => (
                      <Fragment key={j}>
                        {j > 0 && ' '}
                        <span className={w.className}>{w.text}</span>
                      </Fragment>
                    ))}
                  </span>
                ))
              ) : (
                <motion.span
                  className="block"
                  initial="hidden"
                  animate={state}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
                  }}
                >
                  {headline.map((line, i) => (
                    <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                      {line.map((w, j) => (
                        <Fragment key={j}>
                          {j > 0 && ' '}
                          <motion.span variants={wordReveal} className={`inline-block ${w.className ?? ''}`}>
                            {w.text}
                          </motion.span>
                        </Fragment>
                      ))}
                    </span>
                  ))}
                </motion.span>
              )}
            </h1>
          </motion.div>

          {/* C — supporting copy, actions, trust */}
          <motion.div
            style={copyStyle}
            className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 xl:col-span-6"
          >
            <motion.p
              {...entrance(0.85)}
              className="max-w-[52ch] text-[clamp(1rem,1.25vw,1.13rem)] leading-[1.75] text-bone/60 lg:mt-7"
            >
              {brand.founder} brings research, market experience and disciplined thinking together to
              help investors understand opportunities beyond the noise.
            </motion.p>

            <motion.div {...entrance(1)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10">
              <MagneticButton variant="light" onClick={() => scrollToSection('journey')}>
                Explore My Journey
              </MagneticButton>
              <MagneticButton
                variant="outline"
                withArrow
                onClick={() => scrollToSection('vision')}
                className="!border-bone/25 !text-bone hover:!border-bone/50"
              >
                Discover Aspire Research Capital
              </MagneticButton>
            </motion.div>

            {/* Trust indicators */}
            <motion.ul
              {...entrance(1.15)}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-12"
            >
              {trustIndicators.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-[3px] w-[3px] rounded-full bg-emerald-soft" aria-hidden="true" />
                  <span className="text-[0.76rem] font-medium tracking-[0.02em] text-bone/45">{item}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* B — portrait */}
          <motion.figure
            style={reduced ? undefined : { scale: portraitScale }}
            className="order-2 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center xl:col-span-6 xl:col-start-7"
          >
            <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[400px] lg:ml-auto lg:mr-0 lg:max-w-[500px]">
              {/* Orbit: a dashed hairline ring turning once every 90s behind the portrait */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={play ? { rotate: 360 } : undefined}
                transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
                className="absolute left-1/2 top-[44%] hidden w-[124%] -translate-x-1/2 -translate-y-1/2 lg:block"
              >
                <svg viewBox="0 0 200 200" fill="none" className="h-auto w-full" focusable="false">
                  <circle
                    cx="100"
                    cy="100"
                    r="99"
                    stroke="rgba(247, 248, 244, 0.12)"
                    strokeWidth="1"
                    strokeDasharray="1.5 4"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* A single gold satellite marks the ring's motion */}
                  <circle cx="100" cy="1" r="1.1" fill="#d6a928" opacity="0.7" />
                </svg>
              </motion.div>

              {/* Architectural scaffolding behind the portrait */}
              <div
                aria-hidden="true"
                className="absolute -left-5 -top-5 hidden h-28 w-28 border-l border-t border-bone/12 sm:block"
              />
              <motion.span
                aria-hidden="true"
                initial={reduced ? undefined : { scaleY: 0 }}
                animate={reduced ? undefined : { scaleY: play ? 1 : 0 }}
                transition={{ duration: 1.3, delay: 1.1, ease }}
                className="absolute -right-3 top-8 hidden h-[62%] w-px origin-top bg-gradient-to-b from-gold/70 via-gold/25 to-transparent sm:block"
              />

              {/* Portrait — architectural arch crop, base dissolved into the navy.
                  The clip is driven through variants from `animate`, never from
                  an in-view trigger on the clipped node itself. */}
              <motion.div
                initial={reduced ? undefined : 'hidden'}
                animate={reduced ? undefined : state}
                variants={{
                  hidden: { clipPath: 'inset(8% 0% 100% 0%)', opacity: 0 },
                  visible: {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    opacity: 1,
                    transition: { duration: 1.5, delay: 0.55, ease },
                  },
                }}
                className="relative overflow-hidden rounded-t-[999px] rounded-b-[28px] bg-ink-900"
                style={{
                  maskImage: 'linear-gradient(to bottom, #000 72%, rgba(0,0,0,0.25) 96%, transparent)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, #000 72%, rgba(0,0,0,0.25) 96%, transparent)',
                }}
              >
                {/* DEMO IMAGE — Replace with Ramsingh Vaghela's actual professional
                    photograph before production. See src/data/images.ts */}
                <motion.img
                  src={siteImages.founderPortrait}
                  alt="Founder portrait — demo placeholder photograph, not the founder"
                  width={1000}
                  height={1300}
                  fetchPriority="high"
                  decoding="async"
                  variants={{
                    hidden: { scale: 1.16 },
                    visible: { scale: 1, transition: { duration: 2, delay: 0.55, ease } },
                  }}
                  className="aspect-[4/4.3] w-full object-cover object-top sm:aspect-[4/5.1]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/5 to-ink-950/25"
                />
              </motion.div>

              {/* Floating identity plate */}
              <motion.figcaption
                {...entrance(1.35)}
                className="absolute -bottom-2 left-0 z-10 rounded-2xl border border-bone/12 bg-ink-900/70 px-5 py-4 backdrop-blur-xl sm:-left-6"
              >
                <p className="font-display text-[0.92rem] font-bold tracking-[-0.02em] text-bone">
                  {brand.founder}
                </p>
                <p className="mt-1 text-[0.7rem] font-medium tracking-[0.04em] text-bone/45">
                  {brand.role}
                </p>
                <div className="mt-2.5 flex items-center gap-2 border-t border-bone/10 pt-2.5">
                  <span className="h-px w-3 bg-gold" aria-hidden="true" />
                  <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold-soft">
                    {brand.company.toUpperCase()}
                  </p>
                </div>
              </motion.figcaption>

              {/* Annotation chips along the ring — desktop only */}
              <AnnotationChip delay={1.5} state={state} reduced={reduced} className="left-[-6%] top-[12%]">
                <Sparkline play={play} reduced={reduced} />
                <span className="eyebrow text-[0.58rem] tracking-[0.2em] text-bone/70">Research-first</span>
              </AnnotationChip>

              <AnnotationChip delay={1.65} state={state} reduced={reduced} className="right-[-5%] bottom-[30%]">
                <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                  <span className={`absolute inset-0 rounded-full bg-emerald-soft/60 ${play ? 'animate-soft-pulse' : ''}`} />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-soft" />
                </span>
                <span className="eyebrow text-[0.58rem] tracking-[0.2em] text-bone/70">Mumbai · IST</span>
                <time
                  dateTime={time}
                  className="font-display text-[0.8rem] font-semibold tabular-nums tracking-[-0.01em] text-bone"
                >
                  {time}
                </time>
              </AnnotationChip>
            </div>
          </motion.figure>
        </div>
      </Container>

      {/* ---------------------------------------------------- scroll cue */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: play ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.7 }}
        // xl only: at 1024px the cue lands beside the trust row and reads as
        // a fourth item.
        className="pointer-events-none absolute bottom-16 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 xl:flex"
      >
        <span className="text-[0.6rem] font-semibold tracking-[0.28em] text-bone/35">SCROLL</span>
        <span className="relative block h-12 w-px overflow-hidden bg-bone/12">
          <span className="animate-scroll-hint absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent via-emerald-soft to-transparent" />
        </span>
      </motion.div>

      {/* ---------------------------------------------------- ticker tape */}
      <TickerTape className="absolute inset-x-0 bottom-0 z-20" />
    </section>
  )
}
