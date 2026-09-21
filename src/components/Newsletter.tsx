import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { brand } from '../data/site'
import { AnimatedText } from './ui/AnimatedText'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

/**
 * A checkmark that is drawn rather than dropped in: the ring first, then the
 * tick. Both are plain strokes at full length under reduced motion.
 */
function CheckDraw({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className="h-[18px] w-[18px] shrink-0"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="1.5"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 0.6, ease: easeOutExpo }, opacity: { duration: 0.2 } }}
      />
      <motion.path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.45, delay: 0.35, ease: easeOutExpo },
          opacity: { duration: 0.15, delay: 0.35 },
        }}
      />
    </svg>
  )
}

/**
 * Newsletter capture.
 *
 * DEMO BEHAVIOUR — the form does not submit anywhere. It validates, shows a
 * confirmation state and resets. Wire `handleSubmit` to the client's email
 * provider before launch.
 */
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const reduced = useReducedMotion() ?? false

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim()) return
    // TODO: POST to the client's email platform.
    setSubmitted(true)
    setEmail('')
    window.setTimeout(() => setSubmitted(false), 5200)
  }

  return (
    <section aria-label="Newsletter" className="relative overflow-hidden bg-bone py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid items-end gap-12 border-t border-ink-950/15 pt-14 lg:grid-cols-12 lg:gap-16 lg:pt-20">
          {/* Left — the pitch */}
          <div className="lg:col-span-6">
            <Reveal y={14}>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-emerald-deep/60" />
                <span className="eyebrow text-emerald-deep">Newsletter</span>
              </div>
            </Reveal>

            <AnimatedText
              lines={[
                'Better market thinking,',
                <>
                  delivered to your <span className="editorial text-emerald-deep">inbox.</span>
                </>,
              ]}
              className="mt-6 text-[clamp(1.75rem,3.6vw,2.8rem)] font-bold leading-[1.1] text-ink-950"
            />

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[46ch] text-[0.98rem] leading-[1.8] text-muted">
                Research notes, market observations and ideas from {brand.founder}.
              </p>
            </Reveal>
          </div>

          {/* Right — the form */}
          <div className="lg:col-span-6 lg:pl-8">
            <Reveal delay={0.08}>
              <form onSubmit={handleSubmit} noValidate={false}>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                {/* The underline is two stacked rules: a resting hairline so
                    the field always has an edge, and a 2px emerald line that
                    draws in from the left while the field has focus. */}
                <div className="group relative flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:gap-4">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className="min-h-[48px] w-full bg-transparent text-[1.05rem] text-ink-950 placeholder:text-muted/60 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="group/btn relative flex min-h-[48px] shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink-950 px-7 text-[0.88rem] font-semibold text-bone transition-colors duration-400 hover:bg-emerald-deep sm:justify-start"
                  >
                    {/* Gold dot — surfaces in the left padding on hover, so
                        the label never moves. */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-3.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 scale-0 rounded-full bg-gold opacity-0 group-hover/btn:scale-100 group-hover/btn:opacity-100 ${
                        reduced
                          ? ''
                          : 'transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
                      }`}
                    />
                    Subscribe
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>

                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ink-950/25" />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-emerald-deep group-focus-within:scale-x-100 ${
                      reduced
                        ? ''
                        : 'transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
                    }`}
                  />
                </div>

                <div className="mt-5 flex min-h-[1.5rem] items-center" aria-live="polite">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.p
                        key="done"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: easeOutExpo }}
                        className="flex items-center gap-2 text-[0.82rem] font-medium text-emerald-deep"
                      >
                        <CheckDraw reduced={reduced} />
                        You&rsquo;re on the list. (Demo — no email was actually sent.)
                      </motion.p>
                    ) : (
                      <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2.5 text-[0.82rem] text-muted"
                      >
                        <span className="h-[3px] w-[3px] rounded-full bg-gold" aria-hidden="true" />
                        No noise. Just perspective.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
