import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { scrollToSection, scrollToTop } from '../hooks/useSmoothScroll'
import { Logo } from './ui/Logo'
import { MagneticButton } from './ui/MagneticButton'

const sectionIds = navLinks.map((link) => link.id)
const ease = [0.16, 1, 0.3, 1] as const

/** Within this many pixels of the top the bar is always present. */
const ALWAYS_SHOW_ZONE = 80
/** A change of direction must travel this far before the bar reacts. */
const DIRECTION_THRESHOLD = 8

type MagneticNavLinkProps = {
  label: string
  isActive: boolean
  scrolled: boolean
  onSelect: () => void
}

/**
 * A desktop link that leans a few pixels toward the cursor — the same idea as
 * MagneticButton, capped much lower so a row of eight never looks restless.
 * Pointer-only, mouse-only, and off under reduced motion.
 */
function MagneticNavLink({ label, isActive, scrolled, onSelect }: MagneticNavLinkProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 260, damping: 20, mass: 0.3 })
  const y = useSpring(rawY, { stiffness: 260, damping: 20, mass: 0.3 })

  const handleMove = (event: ReactPointerEvent) => {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    // A nudge, not a pull: four pixels at most.
    rawX.set(Math.max(-4, Math.min(4, relX * 0.14)))
    rawY.set(Math.max(-3, Math.min(3, relY * 0.2)))
  }

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onSelect}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={reduced ? undefined : { x, y }}
      aria-current={isActive ? 'true' : undefined}
      // `isolate` keeps the -z-10 pill inside this button's own stacking
      // context, whether or not the magnetic transform is currently applied.
      className={`relative isolate rounded-full px-3.5 py-2 text-[0.83rem] font-semibold tracking-[-0.01em] transition-colors duration-400 ${
        scrolled
          ? isActive
            ? 'text-ink-950'
            : 'text-muted hover:text-ink-950'
          : isActive
            ? 'text-bone'
            : 'text-bone/55 hover:text-bone'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          aria-hidden="true"
          className={`absolute inset-0 -z-10 rounded-full ${
            scrolled ? 'bg-ink-950/6' : 'bg-bone/12'
          }`}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      {label}
    </motion.button>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [tucked, setTucked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const reduced = useReducedMotion()

  // One rAF-throttled listener owns both scroll states: the blurred "scrolled"
  // treatment past 40px, and the hide-on-down / reveal-on-up behaviour.
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const measure = () => {
      ticking = false
      // Clamped so rubber-band overscroll at either end cannot flip the bar.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const y = Math.min(Math.max(window.scrollY, 0), maxY)

      setScrolled(y > 40)

      if (y <= ALWAYS_SHOW_ZONE) {
        setTucked(false)
        lastY = y
        return
      }

      // Small deltas accumulate until they clear the threshold, so a trembling
      // wheel never toggles the bar, but a deliberate move always does.
      const delta = y - lastY
      if (Math.abs(delta) < DIRECTION_THRESHOLD) return
      setTucked(delta > 0)
      lastY = y
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The overlay owns the viewport while it is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    // Let the overlay release scroll before the scroller takes over.
    window.setTimeout(() => scrollToSection(id), menuOpen ? 220 : 0)
  }

  // The bar always shows near the top, while the menu is open, and under
  // reduced motion, where a vanishing header would be a surprise.
  const hideBar = tucked && !menuOpen && !reduced

  return (
    <>
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault()
          go('about')
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-bone"
      >
        Skip to content
      </a>

      {/* Hide / reveal lives on the outer header; the first-load entrance on an
          inner wrapper. Two elements, two transforms, nothing to fight over. */}
      <motion.header
        initial={false}
        animate={{ y: hideBar ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
      >
        <motion.div
          initial={reduced ? undefined : { y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          <nav
            aria-label="Primary"
            className={`mx-auto flex max-w-[1380px] items-center justify-between gap-6 rounded-full border transition-[background-color,border-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrolled
                ? 'border-ink-950/8 bg-bone/85 px-4 py-2.5 shadow-[0_18px_50px_-24px_rgba(7,24,44,0.4)] backdrop-blur-xl sm:px-5'
                : 'border-transparent bg-transparent px-4 py-3.5 sm:px-5'
            }`}
          >
            <button
              type="button"
              onClick={scrollToTop}
              className="shrink-0 rounded-full"
              aria-label={`${'Aspire Research Capital'} — back to top`}
            >
              <Logo light={!scrolled} animateIn />
            </button>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <MagneticNavLink
                    label={link.label}
                    isActive={active === link.id}
                    scrolled={scrolled}
                    onSelect={() => go(link.id)}
                  />
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              {/* Kept at every width — on mobile it is the only direct CTA
                  outside the menu, and the bar has room for it. */}
              <MagneticButton
                variant={scrolled ? 'solid' : 'light'}
                onClick={() => go('contact')}
                className="!px-5 !py-2.5 !text-[0.83rem] sm:!px-6"
              >
                Connect
              </MagneticButton>

              {/* Mobile trigger */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 lg:hidden ${
                  scrolled || menuOpen ? 'text-ink-950' : 'text-bone'
                }`}
              >
                <span className="relative block h-3.5 w-5">
                  <span
                    className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      menuOpen ? 'top-[6px] rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      menuOpen ? 'top-[6px] w-full -rotate-45' : 'top-[12px] w-3/4'
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </motion.div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-ink-950 lg:hidden"
          >
            <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
            <div
              className="absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-emerald-deep/15 blur-[110px]"
              aria-hidden="true"
            />

            <div className="relative flex flex-1 flex-col justify-center px-6 pb-16 pt-24 sm:px-10">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.16 + i * 0.055,
                      ease,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => go(link.id)}
                      className="group flex w-full items-baseline gap-4 border-b border-bone/8 py-4 text-left"
                    >
                      <span className="w-6 text-[0.65rem] font-semibold tracking-[0.2em] text-gold/60">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-[clamp(1.75rem,8vw,2.5rem)] font-bold leading-none tracking-[-0.035em] transition-colors duration-300 ${
                          active === link.id ? 'text-bone' : 'text-bone/45 group-hover:text-bone'
                        }`}
                      >
                        {link.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62, ease }}
                className="mt-10"
              >
                <MagneticButton variant="light" onClick={() => go('contact')} withArrow className="w-full">
                  Connect with Ramsingh
                </MagneticButton>
                <p className="mt-6 text-[0.7rem] leading-relaxed tracking-[0.02em] text-bone/35">
                  Aspire Research Capital — research, perspective and financial education.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
