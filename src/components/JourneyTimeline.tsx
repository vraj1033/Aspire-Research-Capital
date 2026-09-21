import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Milestone } from '../data/site'
import { journeyMilestones } from '../data/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

/* --------------------------------------------------------------- one row */

function MilestoneRow({
  milestone,
  isActive,
  registerRef,
}: {
  milestone: Milestone
  isActive: boolean
  registerRef: (node: HTMLLIElement | null) => void
}) {
  const reduced = useReducedMotion()

  return (
    <li ref={registerRef} className="relative pb-16 last:pb-0 sm:pb-20 lg:pb-28">
      {/* Node on the rail */}
      <span
        aria-hidden="true"
        className={`absolute -left-[41px] top-[13px] hidden h-[9px] w-[9px] rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
          isActive
            ? 'scale-125 border-emerald-deep bg-emerald-deep'
            : 'border-line bg-white'
        }`}
      />

      {/* Pulse ring — a sibling of the node rather than a child, so the
          node's own scale transition and the ring's keyframe never share a
          transform. Centred on the node: (41 - 4.5) - 8.5 = 45. */}
      {isActive && !reduced && (
        <span
          aria-hidden="true"
          className="animate-soft-pulse absolute -left-[45px] top-[9px] hidden h-[17px] w-[17px] rounded-full border border-emerald-soft/70 lg:block"
        />
      )}

      <motion.div
        animate={{ opacity: isActive ? 1 : 0.42, x: isActive && !reduced ? 6 : 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        // Dimming and the nudge only make sense beside the sticky panel. On
        // mobile every card is read in sequence, so it stays fully legible
        // and planted.
        className="max-lg:!opacity-100 max-lg:!transform-none"
      >
        <div className="flex items-baseline gap-4">
          <span
            className={`font-display text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-none tracking-[-0.05em] transition-colors duration-500 ${
              isActive ? 'text-ink-950' : 'text-ink-950/35'
            }`}
          >
            {milestone.year}
          </span>
          <span
            className={`eyebrow transition-colors duration-500 ${
              isActive ? 'text-emerald-deep' : 'text-muted/50'
            }`}
          >
            {milestone.marker}
          </span>
        </div>

        <h3 className="mt-4 text-[clamp(1.25rem,2.1vw,1.6rem)] font-bold leading-tight text-ink-950">
          {milestone.title}
        </h3>

        <p className="mt-3.5 max-w-[52ch] text-[0.97rem] leading-[1.8] text-muted">{milestone.body}</p>

        {/* Mobile carries its own image — the sticky panel only exists on desktop */}
        <div className="mt-6 overflow-hidden rounded-[4px] lg:hidden">
          <img
            src={milestone.image}
            alt={milestone.imageAlt}
            width={900}
            height={1100}
            loading="lazy"
            decoding="async"
            className="aspect-[16/11] w-full object-cover"
          />
        </div>
      </motion.div>
    </li>
  )
}

/* ------------------------------------------------------------- section */

export function JourneyTimeline() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  /**
   * Which milestone owns the panel.
   *
   * Measured against a read-line 45% down the viewport rather than with a
   * per-row IntersectionObserver band: a band leaves dead zones between rows
   * where nothing qualifies, which strands the panel on a stale image and dims
   * every row at once. A read-line always resolves to exactly one milestone.
   */
  const measure = useCallback(() => {
    const readLine = window.scrollY + window.innerHeight * 0.45
    let next = 0
    rowRefs.current.forEach((row, i) => {
      if (!row) return
      const top = row.getBoundingClientRect().top + window.scrollY
      if (top <= readLine) next = i
    })
    setActive((prev) => (prev === next ? prev : next))
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [measure])

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 62%', 'end 72%'],
  })
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  // The Ken Burns drift is continuous, so it only runs while the panel is
  // actually on screen (and never on mobile, where the panel is display:none
  // and reports out of view). Off-screen it settles back to rest.
  const panelInView = useInView(panelRef, { amount: 0.1 })
  const kenBurns = panelInView && !reduced

  const current = journeyMilestones[active]

  return (
    // `overflow-clip`, not `overflow-hidden`: hidden makes the section the
    // sticky panel's scroll container, which never scrolls, so the panel would
    // simply ride away with its column. Clip contains the decor without that.
    <section id="journey" className="relative overflow-clip bg-white py-24 sm:py-32 lg:py-40">
      {/* A faint grid gives the section architecture without adding weight */}
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 opacity-45" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white to-transparent"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="The Journey"
          lines={[
            'A Journey Built',
            <>
              Through <span className="editorial text-emerald-deep">Markets.</span>
            </>,
          ]}
          intro="Almost two decades spent learning the same subject from different angles — as a student of price, as a researcher, as an advisor, and now as a founder."
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* STICKY MEDIA PANEL — desktop only */}
          <div className="hidden lg:col-span-5 lg:block">
            {/* `isolate` so the ghost year's negative z-index stays inside this
                stacking context — behind the panel, above the section. */}
            <div className="sticky top-28 isolate">
              {/* Ghost year — an outlined chapter number that peeks out from
                  behind the panel and crossfades with the active milestone. */}
              <AnimatePresence mode="sync">
                <motion.span
                  key={current.year}
                  aria-hidden="true"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease: easeOutExpo }}
                  className="pointer-events-none absolute -right-2 -top-[4.6rem] -z-10 select-none font-display text-[9rem] font-extrabold leading-none tracking-[-0.06em]"
                  style={{ WebkitTextStroke: '1px rgba(7, 24, 44, 0.10)', color: 'transparent' }}
                >
                  {current.year}
                </motion.span>
              </AnimatePresence>

              <div
                ref={panelRef}
                className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-bone-deep"
              >
                <AnimatePresence mode="sync">
                  {/* The entrance (opacity + settle) and the Ken Burns drift
                      live on different elements so the two scales never fight
                      over one transform. */}
                  <motion.div
                    key={current.image}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.07 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.95, ease: easeOutExpo }}
                    className="absolute inset-0"
                  >
                    <motion.img
                      src={current.image}
                      alt={current.imageAlt}
                      width={900}
                      height={1100}
                      loading="lazy"
                      decoding="async"
                      initial={{ scale: 1 }}
                      animate={{ scale: kenBurns ? 1.06 : 1 }}
                      transition={
                        kenBurns
                          ? { duration: 14, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
                          : { duration: 0.8, ease: easeOutExpo }
                      }
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent"
                />

                {/* Year plate */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.year}
                      initial={reduced ? undefined : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -14 }}
                      transition={{ duration: 0.5, ease: easeOutExpo }}
                      className="font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] text-bone"
                    >
                      {current.year}
                    </motion.span>
                  </AnimatePresence>

                  <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-bone/60">
                    {String(active + 1).padStart(2, '0')} / {String(journeyMilestones.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Step ticks */}
              <div className="mt-5 flex gap-1.5">
                {journeyMilestones.map((m, i) => (
                  <span
                    key={m.year}
                    className={`h-[2px] flex-1 transition-colors duration-500 ${
                      i <= active ? 'bg-emerald-deep' : 'bg-line'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="relative lg:col-span-7">
            {/* Rail + fill */}
            <div
              aria-hidden="true"
              className="absolute -left-[37px] top-2 hidden h-[calc(100%-6rem)] w-px bg-line lg:block"
            >
              <motion.span
                className="absolute inset-x-0 top-0 block h-full origin-top bg-gradient-to-b from-emerald-deep to-emerald-soft"
                style={{ scaleY: reduced ? 1 : railProgress }}
              />
            </div>

            <ol ref={listRef} className="lg:pl-0">
              {journeyMilestones.map((milestone, index) => (
                <MilestoneRow
                  key={milestone.year}
                  milestone={milestone}
                  isActive={active === index}
                  registerRef={(node) => {
                    rowRefs.current[index] = node
                  }}
                />
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
