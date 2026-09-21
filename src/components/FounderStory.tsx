import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { siteImages } from '../data/images'
import { brand } from '../data/site'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { MagneticButton } from './ui/MagneticButton'
import { Reveal } from './ui/Reveal'
import { RevealImage } from './ui/RevealImage'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

/**
 * The founder, introduced the way a research house would: a graded portrait,
 * a measured biography and a signed pull quote — no badges, no stat tiles.
 *
 * Motion is limited to three quiet gestures. The portrait tilts a few degrees
 * toward the cursor, the gold rule beside the quote grows in, and the
 * signature underline is drawn rather than shown. Pointer-only or once-only,
 * and all of it switches off under `prefers-reduced-motion`.
 */
export function FounderStory() {
  const reduced = useReducedMotion()

  /* ---------------------------------------------------- portrait tilt */
  // Spring-damped so the frame settles after the cursor rather than snapping
  // to it. ±4° is the ceiling — past that a photograph starts to look like a
  // card trick, which is the opposite of the register this section wants.
  const tiltRef = useRef<HTMLDivElement>(null)
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 22, mass: 0.6 })
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 22, mass: 0.6 })

  const handleTilt = (event: React.PointerEvent) => {
    if (reduced || event.pointerType !== 'mouse' || !tiltRef.current) return
    const rect = tiltRef.current.getBoundingClientRect()
    // Normalised to -0.5…0.5 from the centre of the frame.
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rawRotateY.set(px * 8)
    rawRotateX.set(-py * 8)
  }

  const resetTilt = () => {
    rawRotateX.set(0)
    rawRotateY.set(0)
  }

  return (
    <section id="about" className="relative overflow-hidden bg-bone py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* LEFT — editorial image composition */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[440px] lg:mx-0 lg:max-w-none">
              {/* DEMO IMAGE — replace via src/data/images.ts */}
              {/* The tilt lives on this wrapper only: the detail frame and the
                  marginalia stay planted so the composition keeps its anchor. */}
              <motion.div
                ref={tiltRef}
                onPointerMove={handleTilt}
                onPointerLeave={resetTilt}
                style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
                className="relative will-change-transform"
              >
                <RevealImage
                  src={siteImages.founderStory}
                  alt="The founder at work — demo placeholder photograph"
                  className="aspect-[4/5] w-full rounded-[4px]"
                  imgClassName="saturate-[0.88] contrast-[1.04]"
                  parallax={22}
                  width={900}
                  height={1150}
                />
                {/* Grades the photograph into the palette: the stock frame runs
                    bright and flat, which reads as clip-art beside warm bone. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[4px] bg-gradient-to-t from-ink-950/35 via-ink-950/5 to-ink-950/10"
                />
              </motion.div>

              {/* Detail frame, tucked into the column gutter */}
              <div className="absolute -bottom-9 -right-3 w-[42%] max-w-[196px] sm:-right-7">
                <RevealImage
                  src={siteImages.founderStoryDetail}
                  alt="Research discussion — demo placeholder photograph"
                  className="aspect-[7/5] w-full rounded-[3px] border-[7px] border-bone shadow-[0_22px_45px_-26px_rgba(7,24,44,0.55)]"
                  width={700}
                  height={500}
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute -left-6 -top-6 hidden h-24 w-24 border-l border-t border-ink-950/12 lg:block"
              />

              {/* Marginalia along the outer edge, the way a monograph dates its
                  plates. Vertical writing-mode plus a half turn reads bottom-to-
                  top, i.e. rotated -90°, without any width/height juggling.
                  DEMO — founding year and city are placeholder copy; confirm
                  with the client before production. */}
              <motion.span
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1, delay: 0.6, ease: easeOutExpo }}
                className="eyebrow pointer-events-none absolute -left-10 bottom-16 hidden select-none text-muted/70 [writing-mode:vertical-rl] rotate-180 lg:block"
              >
                EST. 2023 — MUMBAI
              </motion.span>
            </div>
          </div>

          {/* RIGHT — the story */}
          <div className="lg:col-span-7 lg:pl-4 xl:pl-10">
            <Reveal y={14}>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-emerald-deep/60" />
                <span className="eyebrow text-emerald-deep">The Founder</span>
              </div>
            </Reveal>

            <AnimatedText
              lines={[
                'Experience shaped by markets.',
                <>
                  Perspective shaped by <span className="editorial text-emerald-deep">research.</span>
                </>,
              ]}
              className="mt-6 text-[clamp(1.85rem,4.2vw,3.25rem)] font-bold leading-[1.08] text-ink-950"
            />

            <div className="mt-8 space-y-5 text-[clamp(0.98rem,1.1vw,1.08rem)] leading-[1.8] text-muted">
              <Reveal delay={0.05}>
                <p>
                  {brand.founder} has spent his career in one place — close to the market, and close
                  to the question of why it does what it does. The work began with equities and
                  technical research, and widened over time into fundamentals, investor behaviour and
                  the structure of capital markets themselves.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  What he found across those years is that most investors are not short of
                  information. They are short of context — the frame that turns a number into a
                  judgement. {brand.company} was built to supply exactly that: research written to be
                  understood, not merely followed.
                </p>
              </Reveal>
            </div>

            {/* Pull quote */}
            <Reveal delay={0.12}>
              <motion.blockquote
                className="relative mt-10 pl-6 sm:pl-8"
                initial={reduced ? false : 'hidden'}
                whileInView={reduced ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.6 }}
              >
                {/* The gold rule is its own element so it can grow in. The
                    in-view trigger sits on the blockquote: a scaleY(0) span has
                    no intersection area and could never trigger itself. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-[2px] origin-top bg-gold"
                  variants={
                    reduced
                      ? undefined
                      : {
                          hidden: { scaleY: 0 },
                          visible: {
                            scaleY: 1,
                            transition: { duration: 1, delay: 0.15, ease: easeOutExpo },
                          },
                        }
                  }
                />
                <p className="editorial text-[clamp(1.3rem,2.4vw,1.85rem)] leading-[1.35] text-ink-950">
                  “Markets reward preparation long before they reward prediction.”
                </p>
              </motion.blockquote>
            </Reveal>

            {/* Signature */}
            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
                <div>
                  <p className="editorial text-[1.7rem] leading-none text-ink-950">{brand.founder}</p>
                  {/* Drawn in like a pen stroke. The trigger is on the svg —
                      the frame that has area — and the path follows by variant. */}
                  <motion.svg
                    width="164"
                    height="10"
                    viewBox="0 0 164 10"
                    fill="none"
                    aria-hidden="true"
                    className="mt-1.5"
                    initial={reduced ? false : 'hidden'}
                    whileInView={reduced ? undefined : 'visible'}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    <motion.path
                      d="M1 6.5C26 2.5 58 1.5 96 3.5C120 4.8 142 6.2 163 4"
                      stroke="#D6A928"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      variants={
                        reduced
                          ? undefined
                          : {
                              hidden: { pathLength: 0, opacity: 0 },
                              visible: {
                                pathLength: 1,
                                opacity: 1,
                                transition: {
                                  pathLength: { duration: 1.2, delay: 0.3, ease: easeOutExpo },
                                  opacity: { duration: 0.25, delay: 0.3 },
                                },
                              },
                            }
                      }
                    />
                  </motion.svg>
                  <p className="mt-2.5 text-[0.7rem] font-semibold tracking-[0.16em] text-muted">
                    {brand.role.toUpperCase()}, {brand.company.toUpperCase()}
                  </p>
                </div>

                <MagneticButton variant="outline" withArrow onClick={() => scrollToSection('journey')}>
                  Read My Story
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
