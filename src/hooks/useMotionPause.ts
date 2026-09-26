import { useCallback, useEffect, useState } from 'react'

const ATTR = 'data-motion-paused'
const STORAGE_KEY = 'arc-motion-paused'

/** True while the reader has asked for moving content to stop. */
export const isMotionPaused = () => document.documentElement.hasAttribute(ATTR)

const apply = (paused: boolean) => {
  if (paused) document.documentElement.setAttribute(ATTR, 'true')
  else document.documentElement.removeAttribute(ATTR)
}

/**
 * A single switch for everything that moves on its own — the ticker, the
 * marquees, the hero canvas. WCAG 2.2.2 asks that any auto-playing motion
 * lasting more than five seconds can be paused; hover-to-pause does not
 * count for keyboard or touch users, so this is a real control.
 *
 * CSS animations read the `data-motion-paused` attribute on <html>
 * (see index.css); RAF loops call `isMotionPaused()` each frame. The choice
 * persists for the session so it survives the preloader on a refresh.
 */
export function useMotionPause(): [boolean, () => void] {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let stored = false
    try {
      stored = sessionStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      // Storage unavailable — default to motion on.
    }
    setPaused(stored)
    apply(stored)
  }, [])

  const toggle = useCallback(() => {
    setPaused((current) => {
      const next = !current
      apply(next)
      try {
        sessionStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // Fine — the choice just will not persist.
      }
      return next
    })
  }, [])

  return [paused, toggle]
}
