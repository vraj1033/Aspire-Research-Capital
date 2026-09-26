import { motion, useReducedMotion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { siteImages } from '../data/images'
import { featuredVideo, videoClips } from '../data/site'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { MagneticButton } from './ui/MagneticButton'
import { Reveal, RevealGroup, revealItem } from './ui/Reveal'

/**
 * The cinematic beat of the page.
 *
 * Dark, wide, and image-led — a deliberate change of pace after two light
 * editorial sections. The play control is the only element allowed to move on
 * its own, and only faintly; everything else waits for the pointer.
 */
export function VideoSection() {
  const reduced = useReducedMotion()
  // Hover and keyboard focus share one state so the scan line and the second
  // ring answer the keyboard exactly as they answer the mouse.
  const [engaged, setEngaged] = useState(false)

  return (
    <section
      id="knowledge"
      // Curtain edge over the light section above.
      className="relative z-[1] -mt-8 overflow-hidden rounded-t-[2.5rem] bg-ink-950 py-24 shadow-[0_-30px_60px_-40px_rgba(7,24,44,0.5)] sm:py-32 lg:-mt-12 lg:rounded-t-[3.5rem] lg:py-40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="absolute -right-[8%] top-0 h-[520px] w-[520px] rounded-full bg-ink-600/28 blur-[150px]" />
        <div className="grain-layer absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      </div>

      <Container className="relative">
        <div className="max-w-2xl">
          <Reveal y={14}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/70" />
              <span className="eyebrow text-gold-soft">Knowledge</span>
            </div>
          </Reveal>
          <AnimatedText
            lines={[
              <>
                Knowledge <span className="editorial text-gold-soft">compounds</span> too.
              </>,
            ]}
            className="mt-6 text-[clamp(2.1rem,5.4vw,4rem)] font-bold leading-[1.04] tracking-[-0.04em] text-bone"
          />
        </div>

        {/* ------------------------------------------------ featured video */}
        <div className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Ticker-board band: sits behind the featured card only, screened
              into the navy so just the lit segments survive. Kept outside the
              Reveal so it blends against the section, not a transformed box. */}
          <div
            aria-hidden="true"
            // The screen blend sits on the masked wrapper (the mask makes it a
            // stacking context), so the band blends against the section navy.
            className="pointer-events-none absolute -inset-y-[10%] -left-[5%] w-[110%] mix-blend-screen lg:w-[72%]"
            style={{
              maskImage: 'radial-gradient(ellipse at center, #000 28%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, #000 28%, transparent 72%)',
            }}
          >
            <img
              src={siteImages.tickerBoard}
              alt=""
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-[0.14] blur-[2px]"
            />
          </div>

          <Reveal className="relative lg:col-span-8">
            <a
              href="#knowledge"
              onClick={(e) => e.preventDefault()}
              onPointerEnter={() => setEngaged(true)}
              onPointerLeave={() => setEngaged(false)}
              onFocus={() => setEngaged(true)}
              onBlur={() => setEngaged(false)}
              aria-label={`Play: ${featuredVideo.title}`}
              data-cursor="Play"
              className="group relative block overflow-hidden rounded-[6px] bg-ink-900"
            >
              <img
                src={featuredVideo.image}
                alt=""
                width={1400}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full object-cover opacity-75 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-90"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-ink-950/35"
              />

              {/* Scan: a single hairline sweeps the poster top to bottom while
                  engaged. The wrapper is card-height and travels -100% → 0%,
                  so the line at its base crosses the full frame on transform
                  alone. */}
              {!reduced && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-full"
                  initial={false}
                  animate={engaged ? { y: ['-100%', '0%'], opacity: 1 } : { y: '-100%', opacity: 0 }}
                  transition={
                    engaged
                      ? { y: { duration: 2.4, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.4 } }
                      : { duration: 0.3 }
                  }
                >
                  <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-soft/8 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 h-px bg-emerald-soft/30" />
                </motion.span>
              )}

              {/* Play control */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                  {!reduced && (
                    <>
                      {/* Resting pulse — always on, faint */}
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-bone/35"
                        animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                      />
                      {/* Second ring — only while engaged, emerald, wider throw */}
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-emerald-soft/45"
                        initial={false}
                        animate={engaged ? { scale: [1, 1.95], opacity: [0.7, 0] } : { scale: 1, opacity: 0 }}
                        transition={
                          engaged
                            ? { duration: 1.5, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.25 }
                            : { duration: 0.25 }
                        }
                      />
                    </>
                  )}
                  <span className="relative flex h-full w-full items-center justify-center rounded-full border border-bone/30 bg-bone/10 backdrop-blur-md transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-bone group-hover:bg-bone">
                    <Play
                      className="ml-1 h-6 w-6 fill-bone text-bone transition-colors duration-500 group-hover:fill-ink-950 group-hover:text-ink-950 sm:h-7 sm:w-7"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </span>

              <span className="absolute bottom-5 left-5 flex items-center gap-3 sm:bottom-7 sm:left-7">
                <span className="rounded-full border border-bone/20 bg-ink-950/60 px-3.5 py-1.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bone/85 backdrop-blur-md">
                  {featuredVideo.duration.toUpperCase()}
                </span>
              </span>
            </a>
          </Reveal>

          {/* Side panel */}
          <Reveal delay={0.1} className="relative lg:col-span-4">
            <div className="flex h-full flex-col justify-center lg:pl-2">
              <span className="eyebrow text-emerald-soft">{featuredVideo.label}</span>

              <h3 className="mt-5 text-[clamp(1.6rem,2.6vw,2.15rem)] font-bold leading-[1.1] tracking-[-0.035em] text-bone">
                {featuredVideo.title}
              </h3>

              <p className="mt-5 text-[0.96rem] leading-[1.8] text-bone/55">
                {featuredVideo.description}
              </p>

              <dl className="mt-8 flex items-center gap-8 border-t border-bone/12 pt-6">
                <div>
                  <dt className="text-[0.66rem] font-semibold tracking-[0.16em] text-bone/35">
                    DURATION
                  </dt>
                  <dd className="mt-1.5 text-[0.95rem] font-semibold text-bone">
                    {featuredVideo.duration}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.66rem] font-semibold tracking-[0.16em] text-bone/35">
                    FORMAT
                  </dt>
                  <dd className="mt-1.5 text-[0.95rem] font-semibold text-bone">Long-form</dd>
                </div>
              </dl>

              <div className="mt-8">
                <MagneticButton variant="light" withArrow>
                  Watch Now
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------------------------------- clips */}
        <RevealGroup stagger={0.07} className="mt-14 grid gap-8 sm:grid-cols-3 lg:mt-20">
          {videoClips.map((clip) => (
            <motion.a
              key={clip.title}
              href="#knowledge"
              onClick={(e) => e.preventDefault()}
              variants={reduced ? undefined : revealItem}
              aria-label={`Play: ${clip.title} (${clip.duration})`}
              data-cursor="Play"
              className="group"
            >
              <div className="relative overflow-hidden rounded-[4px] bg-ink-900">
                <img
                  src={clip.image}
                  alt=""
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover opacity-70 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-95"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent"
                />

                {/* Duration chip */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-3.5 left-3.5 rounded-full border border-bone/20 bg-ink-950/60 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-bone/85 backdrop-blur-md"
                >
                  {clip.duration.toUpperCase()}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute bottom-3.5 right-3.5 flex h-10 w-10 items-center justify-center rounded-full border border-bone/25 bg-ink-950/50 backdrop-blur-md transition-all duration-500 group-hover:border-bone group-hover:bg-bone"
                >
                  <Play
                    className="ml-0.5 h-3.5 w-3.5 fill-bone text-bone transition-colors duration-500 group-hover:fill-ink-950 group-hover:text-ink-950"
                    strokeWidth={0}
                  />
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 text-[0.7rem]">
                <span className="font-semibold tracking-[0.14em] text-emerald-soft">
                  {clip.label.toUpperCase()}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-bone/25" aria-hidden="true" />
                <span className="text-bone/45 transition-colors duration-500 group-hover:text-bone/70">
                  Watch
                </span>
              </div>

              <h4 className="mt-2 text-[1.02rem] font-semibold leading-snug tracking-[-0.02em] text-bone/85 transition-colors duration-400 group-hover:text-bone">
                {clip.title}
              </h4>
              {/* Gold underline draws in beneath the title on hover */}
              <span
                aria-hidden="true"
                className="mt-2 block h-px w-full origin-left scale-x-0 bg-gold/80 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </motion.a>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
