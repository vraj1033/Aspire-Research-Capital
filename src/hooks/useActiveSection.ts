import { useEffect, useState } from 'react'

/**
 * Tracks which section currently owns the viewport.
 *
 * Uses a scroll listener rather than IntersectionObserver because sections here
 * differ wildly in height — a 300vh pinned timeline and a 60vh quote can never
 * share a sensible threshold. Measuring against a fixed read-line a third of
 * the way down the viewport gives a stable, predictable result.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    let ticking = false

    const measure = () => {
      ticking = false
      const readLine = window.scrollY + window.innerHeight * 0.34

      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.offsetTop <= readLine) current = id
      }

      // The final section can be unreachable by the read-line on short pages.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80
      if (atBottom) current = ids[ids.length - 1] ?? current

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
