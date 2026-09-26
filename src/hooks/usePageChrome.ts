import { useEffect } from 'react'
import { useActiveSection } from './useActiveSection'
import { scrollToSection } from './useSmoothScroll'

/** Section ids in page order, with the ones that sit on navy marked. */
const sectionOrder = [
  'home',
  'about',
  'journey',
  'vision',
  'expertise',
  'philosophy',
  'research',
  'insights',
  'knowledge',
  'media',
  'contact',
]
const darkSections = new Set(['home', 'vision', 'philosophy', 'knowledge', 'contact'])

const NAVY = '#07182c'
const BONE = '#f7f8f4'

/**
 * Keeps the browser chrome in step with the page on mobile: the address bar
 * and status area tint navy over dark sections and bone over light ones,
 * instead of staying navy while the reader is on a white section.
 */
export function useThemeColor() {
  const active = useActiveSection(sectionOrder)

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!meta) return
    meta.content = darkSections.has(active) ? NAVY : BONE
  }, [active])
}

/**
 * Stamps `data-loaded` on every lazy image once it has decoded, so the CSS in
 * index.css can fade it in rather than let it pop. Images that were already
 * complete when this mounted (cache hits) are stamped straight away — nothing
 * is ever left waiting on an event that already fired.
 */
export function useImageArrival() {
  useEffect(() => {
    const stamp = (img: HTMLImageElement) => {
      img.dataset.loaded = 'true'
    }

    for (const img of document.images) {
      if (img.complete) stamp(img)
    }

    // `load` does not bubble, so listen in the capture phase at the document.
    const onLoad = (event: Event) => {
      const target = event.target
      if (target instanceof HTMLImageElement) stamp(target)
    }
    const onError = (event: Event) => {
      // A broken image still gets its alt text; keep it visible.
      const target = event.target
      if (target instanceof HTMLImageElement) stamp(target)
    }

    document.addEventListener('load', onLoad, true)
    document.addEventListener('error', onError, true)
    return () => {
      document.removeEventListener('load', onLoad, true)
      document.removeEventListener('error', onError, true)
    }
  }, [])
}

/**
 * Honours a section hash in the URL once the page is ready.
 *
 * Scroll restoration is pinned to `manual` and the preloader locks scrolling
 * while it plays, so a link like `/#research` would otherwise land on the
 * hero. Called with `ready` once the curtain starts to lift.
 */
export function useHashDeepLink(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const id = window.location.hash.replace(/^#/, '')
    if (!id || !document.getElementById(id)) return
    // Let the curtain clear the target before the scroller moves.
    const timer = window.setTimeout(() => scrollToSection(id), 450)
    return () => window.clearTimeout(timer)
  }, [ready])
}
