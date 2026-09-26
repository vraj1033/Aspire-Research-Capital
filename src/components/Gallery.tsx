import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { galleryItems, type GalleryItem } from '../data/site'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

/** Round-robin split into three columns for the desktop parallax layout. */
const desktopColumns = [0, 1, 2].map((column) =>
  galleryItems
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index % 3 === column),
)

/** Tracks a media query without a render on every scroll or resize. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Beyond the Charts — a masonry of moments.
 *
 * On desktop the wall is three explicit columns, each drifting at its own rate
 * as the reader scrolls — the middle one against the outer two — so the photos
 * settle into place rather than sitting in a grid. Below `lg` it falls back to
 * two CSS columns with no parallax, which keeps the images at their own
 * proportions instead of a uniform crop. Clicking opens a proper modal: focus
 * moves in, Escape and the arrow keys work, and focus returns to the
 * thumbnail on close.
 */
export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const wallRef = useRef<HTMLDivElement>(null)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const parallax = isDesktop && !reduced

  // Per-column drift, measured against the wall itself so the offsets are
  // symmetrical about the moment the wall is centred in the viewport.
  const { scrollYProgress } = useScroll({ target: wallRef, offset: ['start end', 'end start'] })
  const leadY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const middleY = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const trailY = useTransform(scrollYProgress, [0, 1], [24, -24])
  const columnY = [leadY, middleY, trailY]

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback((delta: number) => {
    setOpenIndex((current) =>
      current === null ? current : (current + delta + galleryItems.length) % galleryItems.length,
    )
  }, [])

  // Keyboard control + scroll lock while the lightbox owns the screen.
  useEffect(() => {
    if (openIndex === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(focusTimer)
    }
  }, [openIndex, close, step])

  // Return focus to whatever opened the lightbox.
  useEffect(() => {
    if (openIndex === null && triggerRef.current) {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [openIndex])

  const active = openIndex === null ? null : galleryItems[openIndex]

  // Touch swipe inside the lightbox: a horizontal drag past the threshold
  // steps to the neighbouring photograph. Vertical intent is left to the
  // browser via touch-action so the page can still be scrolled to dismiss.
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const SWIPE_PX = 48

  const onSwipeStart = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse') return
    swipeStart.current = { x: event.clientX, y: event.clientY }
  }

  const onSwipeEnd = (event: React.PointerEvent) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.2) return
    step(dx < 0 ? 1 : -1)
  }

  const renderTile = (item: GalleryItem, index: number, className: string) => (
    <Reveal key={item.caption} delay={(index % 3) * 0.06} y={20} className={className}>
      <button
        type="button"
        onClick={(event) => {
          triggerRef.current = event.currentTarget
          setOpenIndex(index)
        }}
        aria-label={`View photograph: ${item.caption}`}
        data-cursor="View"
        className="group relative block w-full overflow-hidden rounded-[3px] bg-bone-deep"
      >
        <img
          src={item.image}
          alt={`${item.caption} — demo placeholder photograph`}
          width={800}
          height={item.tall ? 1000 : 600}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${
            item.tall ? 'aspect-[4/5]' : 'aspect-[4/3]'
          }`}
        />

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2.5 p-4 text-left opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <span className="h-px w-4 bg-gold" aria-hidden="true" />
          <span className="text-[0.78rem] font-medium text-bone">{item.caption}</span>
        </span>
      </button>
    </Reveal>
  )

  return (
    <section aria-label="Photography" className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          eyebrow="Moments"
          lines={[
            'Beyond the',
            <span key="c" className="editorial text-emerald-deep">
              Charts.
            </span>,
          ]}
          intro="Sessions, conversations, conferences and the ordinary working days in between."
          className="max-w-xl"
        />

        <div ref={wallRef} className="mt-14 lg:mt-20">
          {isDesktop ? (
            <div className="grid grid-cols-3 items-start gap-6">
              {desktopColumns.map((column, c) => (
                <motion.div
                  key={c}
                  style={parallax ? { y: columnY[c] } : undefined}
                  className="flex flex-col gap-6"
                >
                  {column.map(({ item, index }) => renderTile(item, index, ''))}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="columns-2 gap-4 sm:gap-5">
              {galleryItems.map((item, index) =>
                renderTile(item, index, 'mb-4 break-inside-avoid sm:mb-5'),
              )}
            </div>
          )}
        </div>
      </Container>

      {/* ----------------------------------------------------- lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${active.caption} — enlarged photograph`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/94 p-4 backdrop-blur-lg sm:p-8"
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink-950 sm:right-8 sm:top-8"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>

            <motion.figure
              key={active.image}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-full w-full max-w-4xl touch-pan-y select-none"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={onSwipeStart}
              onPointerUp={onSwipeEnd}
              onPointerCancel={() => {
                swipeStart.current = null
              }}
            >
              <img
                src={active.image}
                alt={`${active.caption} — demo placeholder photograph`}
                className="mx-auto max-h-[72vh] w-auto max-w-full rounded-[4px] object-contain"
              />

              <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold" aria-hidden="true" />
                  <span className="text-[0.88rem] text-bone">{active.caption}</span>
                </span>

                <span className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photograph"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink-950"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photograph"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink-950"
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
