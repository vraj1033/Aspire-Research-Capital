import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { InsightFilter } from '../data/site'
import { insightFilters, insights } from '../data/site'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

/** Items behind each pill — static content, so counted once at module load. */
const filterCounts = Object.fromEntries(
  insightFilters.map((option) => [
    option,
    option === 'All' ? insights.length : insights.filter((item) => item.category === option).length,
  ]),
) as Record<InsightFilter, number>

/**
 * Insights index with animated filtering.
 *
 * Cards animate by layout rather than by re-mounting the grid, so filtering
 * reads as the collection rearranging itself instead of a page swap.
 *
 * DEMO CONTENT — see `insights` in src/data/site.ts.
 */
export function Insights() {
  const [filter, setFilter] = useState<InsightFilter>('All')
  const reduced = useReducedMotion()

  const visible = useMemo(
    () => (filter === 'All' ? insights : insights.filter((item) => item.category === filter)),
    [filter],
  )

  return (
    <section id="insights" className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-10">
          <SectionHeading
            eyebrow="Insights"
            lines={[
              'Notes, Ideas and',
              <span key="m" className="editorial text-emerald-deep">
                Market Thinking.
              </span>,
            ]}
            className="max-w-2xl"
          />
        </div>

        {/* ------------------------------------------------------- filters */}
        <Reveal delay={0.08} className="mt-10 lg:mt-14">
          <div
            role="tablist"
            aria-label="Filter insights"
            className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {insightFilters.map((option) => {
              const isActive = filter === option
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(option)}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-[0.83rem] font-semibold tracking-[-0.01em] transition-colors duration-400 ${
                    isActive ? 'text-bone' : 'text-muted hover:text-ink-950'
                  }`}
                >
                  {/* Painted before the label and left at z-auto on purpose.
                      A negative z-index would drop these behind the section's
                      own white background, since nothing here establishes a
                      stacking context. */}
                  {isActive ? (
                    <motion.span
                      layoutId="insight-filter"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-ink-950"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-line"
                    />
                  )}
                  <span className="relative flex items-baseline gap-1.5">
                    {option}
                    {/* The count inherits the label colour so contrast holds
                        in both states; only the size steps down. */}
                    <span className="text-[0.68rem] font-medium tabular-nums">
                      <span aria-hidden="true">·&nbsp;</span>
                      {filterCounts[option]}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* --------------------------------------------------------- grid */}
        <motion.div layout className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.article
                key={item.title}
                layout={!reduced}
                initial={reduced ? undefined : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -14, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <a
                  href="#insights"
                  onClick={(e) => e.preventDefault()}
                  aria-label={`${item.kind}: ${item.title}`}
                  className="block cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-[4px] bg-bone-deep">
                    {/* Rests a quarter desaturated so the grid reads as one
                        set; hover returns the colour and eases in. */}
                    <img
                      src={item.image}
                      alt=""
                      width={800}
                      height={560}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/11] w-full object-cover grayscale-[0.25] transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055] group-hover:grayscale-0"
                    />

                    {/* Kind badge */}
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-bone/92 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.14em] text-ink-950 backdrop-blur-sm">
                      {item.kind.toUpperCase()}
                    </span>

                    {item.kind === 'Video' && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bone/90 text-ink-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                          <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={0} />
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3 text-[0.73rem] text-muted">
                    <span className="font-semibold tracking-[0.12em] text-emerald-deep">
                      {item.category.toUpperCase()}
                    </span>
                    <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                    <span>{item.date}</span>
                    <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                    <span>{item.meta}</span>
                  </div>

                  {/* Reserves two lines so excerpts and CTAs stay on a shared
                      baseline across the row regardless of title length. */}
                  <h3 className="mt-3 min-h-[3.1rem] text-[1.12rem] font-bold leading-snug tracking-[-0.025em] text-ink-950">
                    <span className="link-underline">{item.title}</span>
                  </h3>

                  <p className="mt-2.5 min-h-[3rem] text-[0.89rem] leading-[1.7] text-muted">
                    {item.excerpt}
                  </p>

                  <span className="mt-5 flex items-center gap-2 text-[0.78rem] font-semibold text-ink-950">
                    {/* Underline draws in from the left on card hover — the
                        `link-underline` utility only answers its own hover. */}
                    <span className="relative">
                      Read
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                      />
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
