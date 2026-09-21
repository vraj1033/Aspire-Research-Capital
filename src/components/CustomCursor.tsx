import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * A restrained custom cursor: a small dot that trails the pointer and opens
 * into a ring over anything interactive.
 *
 * Strictly an enhancement — it renders only for fine pointers (never touch),
 * never under `prefers-reduced-motion`, and is `pointer-events-none`, so the
 * real cursor behaviour is untouched. The native cursor stays visible
 * underneath rather than being hidden, which keeps text selection and resize
 * affordances intact.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 620, damping: 42, mass: 0.28 })
  const springY = useSpring(y, { stiffness: 620, damping: 42, mass: 0.28 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)

    const interactive = 'a, button, input, [role="tab"], [role="dialog"] img, summary, label'

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      const target = event.target as Element | null
      setActive(Boolean(target?.closest?.(interactive)))
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block"
    >
      <motion.span
        className="block rounded-full border border-emerald-soft"
        animate={{
          width: active ? 34 : 7,
          height: active ? 34 : 7,
          x: active ? -17 : -3.5,
          y: active ? -17 : -3.5,
          opacity: visible ? (active ? 0.75 : 0.5) : 0,
          backgroundColor: active ? 'rgba(18,168,121,0)' : 'rgba(18,168,121,0.9)',
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  )
}
