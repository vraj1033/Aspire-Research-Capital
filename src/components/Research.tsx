import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { featuredResearch, researchArticles } from '../data/site'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { fromArticle, useReader } from './ArticleReader'
import { Container } from './ui/Container'
import { MagneticButton } from './ui/MagneticButton'
import { Reveal } from './ui/Reveal'
import { RevealImage } from './ui/RevealImage'
import { SectionHeading } from './ui/SectionHeading'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

/* ---------------------------------------------------------------- hairline */

/**
 * A row divider that draws itself from the left. It has no variants of its
 * own under reduced motion, so it simply renders at full width.
 */
function Hairline({ edge, delay, reduced }: { edge: 'top' | 'bottom'; delay: number; reduced: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute inset-x-0 h-px origin-left bg-line transition-colors duration-500 group-hover:bg-ink-950/25 ${
        edge === 'top' ? 'top-0' : 'bottom-0'
      }`}
      variants={
        reduced
          ? undefined
          : {
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 1.1, delay, ease: easeOutExpo } },
            }
      }
    />
  )
}

/* ------------------------------------------------------------- section */

/**
 * Research desk.
 *
 * One featured report given real space, then the rest as an index — the way a
 * research house actually publishes. The index rows carry a preview image that
 * tracks the cursor, which keeps the list typographic while still showing the
 * art. Pointer-only, and switched off under reduced motion.
 *
 * DEMO ARTICLES — see `featuredResearch` / `researchArticles` in src/data/site.ts.
 */
export function Research() {
  const listRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const reader = useReader()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const previewX = useSpring(rawX, { stiffness: 260, damping: 32, mass: 0.5 })
  const previewY = useSpring(rawY, { stiffness: 260, damping: 32, mass: 0.5 })

  const handleMove = (event: React.PointerEvent) => {
    if (reduced || event.pointerType !== 'mouse' || !listRef.current) return
    const rect = listRef.current.getBoundingClientRect()
    rawX.set(event.clientX - rect.left)
    rawY.set(event.clientY - rect.top)
  }

  const showPreview = hovered !== null && !reduced

  return (
    <section id="research" className="relative overflow-hidden bg-bone py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Research"
            lines={[
              'Research & Market',
              <span key="i" className="editorial text-emerald-deep">
                Intelligence.
              </span>,
            ]}
            className="max-w-2xl"
          />
          <Reveal delay={0.1} className="pb-2">
            <MagneticButton variant="ghost" withArrow onClick={() => scrollToSection('insights')}>
              View All Research
            </MagneticButton>
          </Reveal>
        </div>

        {/* ------------------------------------------------------ featured */}
        <Reveal className="mt-14 lg:mt-20">
          <a
            href="#research"
            onClick={(e) => {
              e.preventDefault()
              reader.open(fromArticle(featuredResearch))
            }}
            aria-label={`Read featured research: ${featuredResearch.title}`}
            className="group grid items-center gap-8 border-t border-ink-950/15 pt-8 lg:grid-cols-12 lg:gap-14 lg:pt-10"
          >
            <div className="lg:col-span-7">
              {/* The sweep needs its own clipping frame — RevealImage owns the
                  one inside it, and the sweep has to travel across the top. */}
              <div className="relative overflow-hidden rounded-[4px]">
                <RevealImage
                  src={featuredResearch.image}
                  alt=""
                  className="aspect-[16/10] w-full rounded-[4px] bg-bone-deep"
                  // The stock frame runs hot on orange and teal; pulling the
                  // saturation back settles it into the navy/emerald palette.
                  imgClassName="saturate-[0.72] contrast-[1.03]"
                  hoverZoom
                  width={1200}
                  height={800}
                />

                {/* Diagonal light sweep. The transition is declared only on
                    the hover state, so the pass plays once across and snaps
                    back silently when the cursor leaves. */}
                {!reduced && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-[45%] -translate-x-[140%] -skew-x-[14deg] bg-gradient-to-r from-transparent via-bone/35 to-transparent transition-none group-hover:translate-x-[340%] group-hover:transition-transform group-hover:duration-[1100ms] group-hover:ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-ink-950 px-3.5 py-1.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bone">
                  FEATURED
                </span>
                <span className="text-[0.72rem] font-semibold tracking-[0.14em] text-emerald-deep">
                  {featuredResearch.category.toUpperCase()}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                <span className="text-[0.75rem] text-muted">{featuredResearch.date}</span>
              </div>

              <h3 className="mt-6 text-[clamp(1.5rem,2.8vw,2.3rem)] font-bold leading-[1.12] tracking-[-0.035em] text-ink-950">
                {featuredResearch.title}
              </h3>

              <p className="mt-5 max-w-[46ch] text-[0.98rem] leading-[1.8] text-muted">
                {featuredResearch.excerpt}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-[0.78rem] font-medium text-muted">
                  {featuredResearch.readingTime}
                </span>
                <span className="h-px flex-1 bg-line transition-colors duration-500 group-hover:bg-ink-950/30" />
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-950/15 text-ink-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-ink-950 group-hover:bg-ink-950 group-hover:text-bone">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        </Reveal>

        {/* --------------------------------------------------------- index */}
        <div ref={listRef} className="relative mt-16 lg:mt-24" onPointerMove={handleMove}>
          <p className="eyebrow mb-1 text-muted">Latest Reports</p>

          {researchArticles.map((article, i) => {
            const isLast = i === researchArticles.length - 1
            const isReduced = reduced ?? false

            return (
              // The in-view trigger is on the row — the element with area —
              // and the hairlines follow it by variant. A scaleX(0) span could
              // never trigger its own reveal.
              <motion.a
                key={article.title}
                href="#research"
                onClick={(e) => {
                  e.preventDefault()
                  reader.open(fromArticle(article))
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setHovered(i)
                }}
                onPointerLeave={() => setHovered(null)}
                aria-label={`${article.category}: ${article.title}`}
                initial={isReduced ? false : 'hidden'}
                whileInView={isReduced ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.35 }}
                variants={
                  isReduced
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 18 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.8, delay: i * 0.05, ease: easeOutExpo },
                        },
                      }
                }
                className="group relative grid grid-cols-1 items-center gap-y-3 py-7 sm:grid-cols-12 sm:gap-6 lg:py-9"
              >
                <Hairline edge="top" delay={i * 0.08} reduced={isReduced} />
                {isLast && <Hairline edge="bottom" delay={i * 0.08 + 0.12} reduced={isReduced} />}

                {/* index numeral — decorative, the link name already carries
                    category and title */}
                <span
                  aria-hidden="true"
                  // Emerald, not gold: gold on bone sits near 2:1 and the
                  // numerals are small enough to need real contrast.
                  className="eyebrow hidden tabular-nums text-emerald-deep lg:col-span-1 lg:block"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* category + date */}
                <div className="sm:col-span-3 lg:col-span-2">
                  <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-emerald-deep">
                    {article.category.toUpperCase()}
                  </p>
                  <p className="mt-1.5 text-[0.75rem] text-muted">{article.date}</p>
                </div>

                {/* title + excerpt */}
                <div className="sm:col-span-7 lg:col-span-6">
                  <h3 className="text-[clamp(1.08rem,1.7vw,1.4rem)] font-bold leading-snug tracking-[-0.025em] text-ink-950 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:translate-x-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-[0.88rem] leading-[1.7] text-muted transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:translate-x-2">
                    {article.excerpt}
                  </p>
                </div>

                {/* meta + arrow */}
                <div className="flex items-center justify-between gap-4 sm:col-span-2 sm:justify-end lg:col-span-3">
                  <span className="text-[0.76rem] text-muted">{article.readingTime}</span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-ink-950/30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink-950"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              </motion.a>
            )
          })}

          {/* Cursor-tracked preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                key="preview"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: easeOutExpo }}
                style={{ x: previewX, y: previewY }}
                className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <img
                    src={researchArticles[hovered].image}
                    alt=""
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="h-[190px] w-[270px] rounded-[3px] object-cover shadow-[0_28px_60px_-24px_rgba(7,24,44,0.55)]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
