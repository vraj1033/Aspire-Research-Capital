import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Link, Play, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { genericBody, readerContent, slugify } from '../data/articles'
import type { Article, Insight } from '../data/site'
import { getLenis } from '../hooks/useSmoothScroll'

const ease = [0.16, 1, 0.3, 1] as const
const READ_PARAM = 'read'

/* ---------------------------------------------------------------- model */

export type Readable = {
  title: string
  category: string
  date: string
  duration: string
  excerpt: string
  image: string
  kind: 'Report' | 'Article' | 'Market Note' | 'Video'
}

export const fromArticle = (article: Article, kind: Readable['kind'] = 'Report'): Readable => ({
  title: article.title,
  category: article.category,
  date: article.date,
  duration: article.readingTime,
  excerpt: article.excerpt,
  image: article.image,
  kind,
})

export const fromInsight = (insight: Insight): Readable => ({
  title: insight.title,
  category: insight.category,
  date: insight.date,
  duration: insight.meta,
  excerpt: insight.excerpt,
  image: insight.image,
  kind: insight.kind,
})

/* -------------------------------------------------------------- context */

type ReaderApi = {
  open: (item: Readable) => void
  close: () => void
}

const ReaderContext = createContext<ReaderApi | null>(null)

export function useReader() {
  const api = useContext(ReaderContext)
  if (!api) throw new Error('useReader must be used inside <ReaderProvider>')
  return api
}

type ProviderProps = {
  /** Everything that can be opened, in reading order — drives "Next". */
  items: Readable[]
  /** Deep links (`?read=slug`) are honoured once the page is ready. */
  ready: boolean
  children: ReactNode
}

/**
 * The reading panel.
 *
 * Every research report and insight opens here rather than navigating away:
 * the page stays underneath, scroll position is kept, and the panel carries
 * its own progress line, share link and "next" control. The URL picks up a
 * `?read=` parameter while a piece is open so the link can be shared or
 * reloaded straight into it.
 */
export function ReaderProvider({ items, ready, children }: ProviderProps) {
  const [current, setCurrent] = useState<Readable | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  // The URL is only written after the first open, so a deep link is never
  // stripped by the initial "nothing open" state.
  const touched = useRef(false)

  const isOpen = useRef(false)

  const open = useCallback((item: Readable) => {
    // Only the element that first opened the panel gets focus back. "Next"
    // is pressed from inside the panel, which unmounts on close.
    if (!isOpen.current) triggerRef.current = document.activeElement as HTMLElement | null
    isOpen.current = true
    touched.current = true
    setCurrent(item)
  }, [])

  const close = useCallback(() => setCurrent(null), [])

  useEffect(() => {
    if (!touched.current) return
    const url = new URL(window.location.href)
    if (current) url.searchParams.set(READ_PARAM, slugify(current.title))
    else url.searchParams.delete(READ_PARAM)
    window.history.replaceState(null, '', url)
  }, [current])

  useEffect(() => {
    if (!ready) return
    const slug = new URL(window.location.href).searchParams.get(READ_PARAM)
    if (!slug) return
    const match = items.find((item) => slugify(item.title) === slug)
    if (!match) return
    const timer = window.setTimeout(() => open(match), 700)
    return () => window.clearTimeout(timer)
  }, [ready, items, open])

  // The panel owns the viewport while open: the page beneath stops scrolling
  // (Lenis paused, html overflow hidden), Escape closes, and focus returns to
  // whatever opened it.
  useEffect(() => {
    if (!current) return
    const lenis = getLenis()
    lenis?.stop()
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.documentElement.style.overflow = previous
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [current, close])

  // Focus goes back to the opener only once the panel has actually closed —
  // not on every article change inside it.
  useEffect(() => {
    if (current) return
    if (!isOpen.current) return
    isOpen.current = false
    triggerRef.current?.focus?.()
    triggerRef.current = null
  }, [current])

  const api = useMemo(() => ({ open, close }), [open, close])

  const index = current ? items.findIndex((item) => item.title === current.title) : -1
  const next = index >= 0 && items.length > 1 ? items[(index + 1) % items.length] : null

  return (
    <ReaderContext.Provider value={api}>
      {children}
      <ReaderPanel item={current} next={next} onClose={close} onOpen={open} />
    </ReaderContext.Provider>
  )
}

/* ---------------------------------------------------------------- panel */

type PanelProps = {
  item: Readable | null
  next: Readable | null
  onClose: () => void
  onOpen: (item: Readable) => void
}

function ReaderPanel({ item, next, onClose, onOpen }: PanelProps) {
  const reduced = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  // New piece: back to the top, focus on the close control.
  useEffect(() => {
    if (!item) return
    setProgress(0)
    setCopied(false)
    scrollRef.current?.scrollTo({ top: 0 })
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [item])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1)
  }

  // Keep Tab inside the dialog while it is open.
  const trapTab = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard unavailable (insecure context / permission) — the link is
      // already in the address bar, so there is nothing further to do.
    }
  }

  const entry = item ? (readerContent[item.title] ?? genericBody) : genericBody

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="reader"
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Close reader"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/70 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-title"
            onKeyDown={trapTab}
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-y-0 right-0 flex w-full flex-col bg-bone text-ink-950 shadow-[-40px_0_80px_-30px_rgba(7,24,44,0.6)] sm:w-[min(760px,92vw)]"
          >
            {/* Reading progress */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[2px] bg-ink-950/8">
              <span
                className="block h-full origin-left bg-gradient-to-r from-emerald-deep to-gold"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 border-b border-ink-950/10 px-5 py-3.5 sm:px-8">
              <span className="eyebrow text-emerald-deep">{item.kind}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="flex min-h-[44px] items-center gap-2 rounded-full border border-ink-950/15 px-4 text-[0.78rem] font-semibold text-ink-950 transition-colors duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-bone"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Link className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  )}
                  <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-950/15 text-ink-950 transition-colors duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-bone"
                >
                  <X className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body — its own scroller; data-lenis-prevent keeps the wheel here */}
            <div
              ref={scrollRef}
              onScroll={onScroll}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              <article className="px-5 pb-16 pt-8 sm:px-10 sm:pt-12">
                <div className="flex flex-wrap items-center gap-3 text-[0.75rem] text-muted">
                  <span className="font-semibold tracking-[0.14em] text-emerald-deep">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                  <span>{item.date}</span>
                  <span className="h-[3px] w-[3px] rounded-full bg-muted/50" aria-hidden="true" />
                  <span>{item.duration}</span>
                </div>

                <h2
                  id="reader-title"
                  className="mt-5 text-[clamp(1.7rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.035em] text-ink-950"
                >
                  {item.title}
                </h2>

                <p className="editorial mt-5 max-w-[46ch] text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.45] text-ink-950/75">
                  {item.excerpt}
                </p>

                <div className="mt-8 overflow-hidden rounded-[4px] bg-bone-deep">
                  {item.kind === 'Video' ? (
                    <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-ink-950">
                      <img
                        src={item.image}
                        alt=""
                        width={1200}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                      />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-bone/40 bg-bone/10 backdrop-blur-md">
                        <Play className="ml-0.5 h-5 w-5 fill-bone text-bone" strokeWidth={0} aria-hidden="true" />
                      </span>
                      <span className="absolute bottom-4 left-4 rounded-full bg-ink-950/70 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.14em] text-bone/80">
                        VIDEO EMBED PLACEHOLDER · DEMO
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt=""
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                </div>

                <div className="mt-9 max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.85] text-ink-950/85">
                  {entry.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-10 border-t border-ink-950/10 pt-7">
                  <p className="eyebrow text-muted">Key takeaways</p>
                  <ol className="mt-4 space-y-3.5">
                    {entry.takeaways.map((takeaway, i) => (
                      <li key={takeaway} className="flex gap-4">
                        <span className="pt-1 font-display text-[0.68rem] font-bold tracking-[0.2em] text-gold">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[0.95rem] leading-[1.7] text-ink-950/85">{takeaway}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <p className="mt-10 text-[0.72rem] leading-relaxed text-muted/80">
                  Demo article — placeholder text written for this presentation. Not published
                  research and not investment advice.
                </p>

                {next && (
                  <button
                    type="button"
                    onClick={() => onOpen(next)}
                    className="group mt-8 flex w-full items-center justify-between gap-6 border-t border-ink-950/10 pt-6 text-left"
                  >
                    <span>
                      <span className="eyebrow text-muted">Next</span>
                      <span className="mt-1.5 block font-display text-[1.05rem] font-bold tracking-[-0.02em] text-ink-950 transition-colors duration-300 group-hover:text-emerald-deep">
                        {next.title}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-ink-950/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-emerald-deep"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </article>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
