import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { brand, navLinks, socialLinks } from '../data/site'
import { scrollToSection, scrollToTop } from '../hooks/useSmoothScroll'
import { Container } from './ui/Container'
import { Logo } from './ui/Logo'
import { socialIcons } from './ui/SocialIcon'

const ease = [0.16, 1, 0.3, 1] as const

const exploreLinks = navLinks.filter((link) =>
  ['home', 'about', 'journey', 'research', 'insights'].includes(link.id),
)

const companyLinks = [
  { id: 'vision', label: brand.company },
  { id: 'media', label: 'Media' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'contact', label: 'Contact' },
]

/* The ghost wordmark rises into place once the foot of the page is reached.
   The in-view trigger lives on the unclipped wrapper; the clipped child only
   ever follows variants (see RevealImage for why). */
const wordmarkVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.3, ease } },
}

export function Footer() {
  const reduced = useReducedMotion()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [topEngaged, setTopEngaged] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim()) return
    // DEMO — wire to the client's email platform before launch.
    setDone(true)
    setEmail('')
    window.setTimeout(() => setDone(false), 4200)
  }

  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-ink-950 pt-20 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="grain-layer absolute inset-0 opacity-[0.1] mix-blend-overlay" />
      </div>

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-7 max-w-[34ch] text-[0.92rem] leading-[1.8] text-bone/45">
              A research-first financial ecosystem built around market research, investor
              perspective and financial education.
            </p>

            <p className="mt-7 flex items-center gap-2.5 text-[0.8rem] text-bone/40">
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
              {brand.location}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="lg:col-span-2">
            <h2 className="eyebrow text-bone/35">Explore</h2>
            <ul className="mt-6 space-y-3.5">
              {exploreLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="link-underline text-[0.9rem] text-bone/60 transition-colors duration-400 hover:text-bone"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="lg:col-span-3">
            <h2 className="eyebrow text-bone/35">Company</h2>
            <ul className="mt-6 space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="link-underline text-left text-[0.9rem] text-bone/60 transition-colors duration-400 hover:text-bone"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect + mini newsletter */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-bone/35">Connect</h2>

            <ul className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.label]
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${brand.founder} on ${social.label} (demo link)`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/12 text-bone/55 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-bone hover:bg-bone hover:text-ink-950"
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </a>
                  </li>
                )
              })}
            </ul>

            <form onSubmit={handleSubmit} className="mt-8">
              <label htmlFor="footer-email" className="sr-only">
                Email address for the newsletter
              </label>
              <div className="flex items-center gap-2 border-b border-bone/20 pb-2.5 transition-colors duration-500 focus-within:border-bone/50">
                <input
                  id="footer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Join the newsletter"
                  className="min-h-[44px] w-full bg-transparent text-[0.88rem] text-bone placeholder:text-bone/35 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to the newsletter"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-bone/60 transition-colors duration-400 hover:bg-bone hover:text-ink-950"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-3 min-h-[1.1rem] text-[0.74rem] text-bone/40" aria-live="polite">
                {done ? 'Thank you — demo form, nothing was sent.' : 'No noise. Just perspective.'}
              </p>
            </form>
          </div>
        </div>

        {/* ------------------------------------------------------ disclaimer */}
        <div className="mt-16 border-t border-bone/10 pt-8">
          <p className="max-w-[92ch] text-[0.74rem] leading-[1.75] text-bone/35">
            <span className="font-semibold text-bone/55">Disclaimer:</span> Content presented on
            this website is intended for informational and educational purposes only and should not
            be construed as investment advice, a recommendation, or an offer to buy or sell any
            security. Markets carry risk, and past performance is not indicative of future results.
            Readers should carry out their own assessment and consult a qualified, appropriately
            registered financial professional before making any investment decision.
          </p>
          <p className="mt-4 max-w-[92ch] text-[0.72rem] leading-[1.7] text-bone/25">
            This site is a design demonstration. All biography details, figures, research titles,
            testimonials, media appearances and photography shown are placeholder content and do not
            represent verified facts about any individual or organisation.
          </p>
          <p className="mt-4 flex items-center gap-2.5 text-[0.72rem] text-bone/35">
            <span className="h-[3px] w-[3px] rounded-full bg-emerald-soft" aria-hidden="true" />
            This site sets no cookies and runs no analytics or trackers.
          </p>
        </div>

        {/* ------------------------------------------- wordmark + bottom bar */}
        <motion.div
          className="relative mt-8 max-w-full overflow-hidden"
          initial={reduced ? undefined : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Giant outlined wordmark. Clipped along its base by the wrapper so
              the bottom bar reads as sitting on top of it. */}
          <motion.div
            aria-hidden="true"
            variants={reduced ? undefined : wordmarkVariants}
            className="pointer-events-none -mb-[0.2em] max-w-full select-none whitespace-nowrap font-display text-[18vw] font-extrabold leading-none tracking-[-0.06em] text-transparent"
            style={{ WebkitTextStroke: '1px rgba(247, 248, 244, 0.08)' }}
          >
            ASPIRE
          </motion.div>

          <div className="relative flex flex-col gap-6 border-t border-bone/10 py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.78rem] text-bone/40">
              © {new Date().getFullYear()} {brand.company}. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {['Privacy', 'Terms', 'Disclaimer'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="link-underline text-[0.78rem] text-bone/40 transition-colors duration-400 hover:text-bone/80"
                >
                  {item}
                </a>
              ))}

              <button
                type="button"
                onClick={scrollToTop}
                onPointerEnter={() => setTopEngaged(true)}
                onPointerLeave={() => setTopEngaged(false)}
                onFocus={() => setTopEngaged(true)}
                onBlur={() => setTopEngaged(false)}
                aria-label="Back to top"
                className="group flex min-h-[44px] items-center gap-2 text-[0.78rem] font-semibold text-bone/55 transition-colors duration-400 hover:text-bone"
              >
                Back to top
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 transition-colors duration-500 group-hover:border-bone/30">
                  {/* Ring draws itself around the control while engaged */}
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 36 36"
                    fill="none"
                    className="absolute inset-0 h-full w-full -rotate-90"
                  >
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="17.5"
                      stroke="#f7f8f4"
                      strokeWidth="1"
                      strokeLinecap="round"
                      initial={false}
                      animate={{ pathLength: topEngaged ? 1 : 0, opacity: topEngaged ? 0.9 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.8, ease }}
                    />
                  </svg>
                  <ArrowUp
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  )
}
