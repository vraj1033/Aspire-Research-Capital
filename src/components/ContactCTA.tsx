import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { siteImages } from '../data/images'
import { brand, contactOptions, socialLinks } from '../data/site'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { MagneticButton } from './ui/MagneticButton'
import { MarketCurve } from './ui/MarketCurve'
import { Reveal, RevealGroup, revealItem } from './ui/Reveal'
import { socialIcons } from './ui/SocialIcon'

/* ------------------------------------------------------------ live clock */

type MumbaiClock = { time: string; open: boolean }

const clockFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  weekday: 'short',
})

/**
 * Reads the wall clock in Mumbai. The time itself is real; the open/closed
 * flag is only a rough guide.
 *
 * DEMO — illustrative trading-hours logic: the NSE cash session, Mon–Fri
 * 09:15–15:30 IST. It ignores exchange holidays, muhurat and special
 * sessions, and must not be read as a statement about any market being open.
 */
function readMumbaiClock(now = new Date()): MumbaiClock {
  const parts = clockFormat.formatToParts(now)
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  const hour = Number(part('hour'))
  const minute = Number(part('minute'))
  const weekday = part('weekday')
  const minutes = hour * 60 + minute

  const weekdaySession = weekday !== 'Sat' && weekday !== 'Sun'
  const open = weekdaySession && minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30

  return {
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    open,
  }
}

function useMumbaiClock() {
  const [clock, setClock] = useState<MumbaiClock>(() => readMumbaiClock())

  useEffect(() => {
    const tick = () => setClock(readMumbaiClock())
    // Half-minute cadence keeps the displayed minute honest without a
    // per-second render; a tab coming back from the background re-syncs.
    const id = window.setInterval(tick, 30_000)
    const onVisible = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return clock
}

/* Cursor spotlight, as in the Vision pillars: one --sx/--sy pair per cell so
   the gradient centre is in cell coordinates. Emerald stays at 10% alpha. */
const spotlight =
  'radial-gradient(240px circle at var(--sx, 50%) var(--sy, 50%), rgba(18, 168, 121, 0.10), transparent 70%)'

export function ContactCTA() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const clock = useMumbaiClock()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const backdropY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

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
      id="contact"
      ref={sectionRef}
      // Curtain edge over the light newsletter block above.
      className="relative z-[1] -mt-8 overflow-hidden rounded-t-[2.5rem] bg-ink-950 pb-20 pt-24 shadow-[0_-30px_60px_-40px_rgba(7,24,44,0.5)] sm:pb-24 sm:pt-32 lg:-mt-12 lg:rounded-t-[3.5rem] lg:pb-28 lg:pt-44"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Light trails, graded hard into navy and drifting with the scroll */}
        <motion.div
          className="absolute inset-x-0 -inset-y-[8%]"
          style={reduced ? undefined : { y: backdropY }}
        >
          <img
            src={siteImages.contactBackdrop}
            alt=""
            width={1800}
            height={1100}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-[0.2]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/85 to-ink-950" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-deep/12 blur-[150px]" />
        <MarketCurve
          className="absolute inset-x-0 bottom-0 h-[45%] w-full opacity-40"
          stroke="rgba(214, 169, 40, 0.3)"
          strokeWidth={1}
        />
        <div className="grain-layer absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      </div>

      <Container className="relative">
        {/* ------------------------------------------------------ headline */}
        <div className="max-w-4xl">
          <Reveal y={14}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/70" />
                <span className="eyebrow text-gold-soft">Connect</span>
              </div>

              {/* Live status chip — real Mumbai time; session flag is a guide */}
              <p className="inline-flex min-h-[32px] items-center gap-2.5 rounded-full border border-bone/15 bg-ink-900/50 px-3.5 py-1.5 font-display text-[0.64rem] font-semibold tracking-[0.16em] text-bone/70 backdrop-blur-md">
                <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
                  {clock.open && !reduced && (
                    <span className="animate-soft-pulse absolute inset-0 rounded-full bg-emerald-soft/60" />
                  )}
                  <span
                    className={`relative h-1.5 w-1.5 rounded-full ${
                      clock.open ? 'bg-emerald-soft' : 'bg-bone/30'
                    }`}
                  />
                </span>
                <span>MUMBAI</span>
                <span className="text-bone/30" aria-hidden="true">
                  ·
                </span>
                <time className="tabular-nums">{clock.time} IST</time>
                <span className="text-bone/30" aria-hidden="true">
                  ·
                </span>
                <span className={clock.open ? 'text-emerald-soft' : 'text-bone/50'}>
                  {clock.open ? 'MARKETS OPEN' : 'MARKETS CLOSED'}
                </span>
              </p>
            </div>
          </Reveal>

          <AnimatedText
            lines={[
              <>Let&rsquo;s Start a</>,
              <span key="c" className="editorial text-gold-soft">
                Conversation.
              </span>,
            ]}
            className="mt-6 text-[clamp(2.4rem,6.8vw,5.2rem)] font-bold leading-[1] tracking-[-0.045em] text-bone"
          />

          <Reveal delay={0.1}>
            <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.15vw,1.1rem)] leading-[1.8] text-bone/55">
              Whether it&rsquo;s research, a speaking invitation or a longer-term collaboration —
              the best conversations usually begin with a clear question.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MagneticButton variant="light" href={`mailto:${brand.email}`}>
                Connect with {brand.founder.split(' ')[0]}
              </MagneticButton>
              <MagneticButton
                variant="outline"
                withArrow
                href={`mailto:${brand.email}`}
                className="!border-bone/25 !text-bone hover:!border-bone/50"
              >
                Contact {brand.company}
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------------------------------- options */}
        <div ref={gridRef} onPointerMove={handleSpotlight} className="relative mt-20 lg:mt-28">
          <RevealGroup
            stagger={0.06}
            className="grid gap-px border-t border-bone/12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {contactOptions.map((option, i) => (
              <motion.a
                key={option.title}
                data-spot=""
                href={`mailto:${brand.email}?subject=${encodeURIComponent(option.title)}`}
                variants={reduced ? undefined : revealItem}
                className="group relative flex flex-col justify-between gap-8 py-8 lg:px-7 lg:first:pl-0"
              >
                {/* Cursor spotlight — pointer-only, off under reduced motion */}
                {!reduced && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: spotlight }}
                  />
                )}
                {/* Emerald hairline fills across the top on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-emerald-soft transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-px top-0 hidden h-full w-px bg-bone/10 lg:block"
                  />
                )}

                <div className="relative">
                  <h3 className="text-[1.08rem] font-bold tracking-[-0.025em] text-bone">
                    {option.title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-[0.89rem] leading-[1.7] text-bone/50">
                    {option.body}
                  </p>
                </div>

                <ArrowUpRight
                  className="relative h-5 w-5 text-bone/30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </motion.a>
            ))}
          </RevealGroup>
        </div>

        {/* -------------------------------------------------------- social */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-bone/12 pt-10">
            <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-bone/35">
              FOLLOW
            </span>
            <ul className="flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.label]
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${brand.founder} on ${social.label} (demo link)`}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/15 text-bone/60 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-bone hover:bg-bone hover:text-ink-950"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
