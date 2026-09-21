import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef } from 'react'

type Variant = 'solid' | 'outline' | 'light' | 'ghost'

type MagneticButtonProps = {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: Variant
  className?: string
  withArrow?: boolean
  ariaLabel?: string
}

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-[0.9rem] font-semibold tracking-[-0.01em] min-h-[48px] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform'

const variants: Record<Variant, string> = {
  // Navy fill that washes to emerald on hover
  solid: 'bg-ink-950 text-bone hover:text-white',
  // Hairline on light backgrounds
  outline: 'border border-ink-950/20 text-ink-950 hover:border-ink-950/45',
  // For dark sections
  light: 'bg-bone text-ink-950 hover:text-ink-950',
  ghost: 'text-ink-950/70 hover:text-ink-950 px-0',
}

const fills: Partial<Record<Variant, string>> = {
  solid: 'bg-emerald-deep',
  outline: 'bg-ink-950',
  light: 'bg-gold-soft',
}

/**
 * Primary call to action.
 *
 * Three interactions layered deliberately: the button drifts a few pixels
 * toward the cursor, a colour fill rises from the bottom edge, and the arrow
 * slides. All of it is pointer-only and all of it switches off under
 * `prefers-reduced-motion` — the button stays perfectly usable without any.
 */
export function MagneticButton({
  children,
  onClick,
  href,
  variant = 'solid',
  className = '',
  withArrow = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.35 })
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.35 })

  const handleMove = (event: React.PointerEvent) => {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    // Capped so it reads as a subtle pull, never as the button running away.
    rawX.set(Math.max(-10, Math.min(10, relX * 0.28)))
    rawY.set(Math.max(-8, Math.min(8, relY * 0.3)))
  }

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const isOutline = variant === 'outline'
  const isGhost = variant === 'ghost'

  const content = (
    <>
      {!isGhost && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 ${fills[variant] ?? ''}`}
        />
      )}
      <span className={`relative z-10 ${isOutline ? 'transition-colors duration-500 group-hover:text-bone' : ''}`}>
        {children}
      </span>
      {withArrow && (
        <ArrowRight
          aria-hidden="true"
          className={`relative z-10 h-[1.05em] w-[1.05em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 ${
            isOutline ? 'group-hover:text-bone' : ''
          }`}
          strokeWidth={1.75}
        />
      )}
    </>
  )

  const motionProps = {
    style: reduced ? undefined : { x, y },
    onPointerMove: handleMove,
    onPointerLeave: reset,
    className: `${base} ${variants[variant]} ${className}`,
    'aria-label': ariaLabel,
  }

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...motionProps}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
}
