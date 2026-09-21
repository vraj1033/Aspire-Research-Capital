import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Module-scoped instance so the navigation can drive the same scroller that
 * the page is using, without threading context through every component.
 */
let lenisInstance: Lenis | null = null

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Smooth, weighted page scrolling. Deliberately restrained: a slightly long
 * duration and a gentle easing curve so the page feels damped rather than
 * slippery, and a wheel multiplier just under one so each notch of the wheel
 * carries a little less distance than the browser would give it.
 *
 * Disabled entirely under `prefers-reduced-motion`, where the browser's native
 * scrolling is the correct behaviour.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      // A touch heavier than the default. The page should settle, not slide.
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      // Native momentum on touch devices beats anything we simulate.
      syncTouch: false,
    })

    lenisInstance = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}

/**
 * The live scroller, for components that need to read its velocity or listen
 * to its events directly. `null` before mount and under reduced motion, so
 * callers must always fall back to the window.
 */
export function getLenis() {
  return lenisInstance
}

/** Scrolls to a section by id, accounting for the floating navigation. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  const offset = window.innerWidth < 768 ? -72 : -24

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset, duration: 1.25 })
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.4 })
  } else {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}
