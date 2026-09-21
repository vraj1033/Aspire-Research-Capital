import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

type AnimatedTextProps = {
  /** One entry per visual line. Lines rise out of a mask in sequence. */
  lines: ReactNode[]
  as?: ElementType
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** Play immediately (hero) instead of waiting for the viewport. */
  immediate?: boolean
}

/**
 * Line-by-line masked reveal for display headlines.
 *
 * Each line sits inside its own overflow-hidden block so the text appears to
 * rise out of the page rather than fade onto it. Reserved for headlines — body
 * copy uses `Reveal`, because masking paragraphs looks fussy.
 */
export function AnimatedText({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.11,
  immediate = false,
}: AnimatedTextProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  const animation = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: { once: true, amount: 0.4 } }

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial="hidden"
        {...animation}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={`block ${lineClassName}`}
              variants={{
                hidden: { y: '110%' },
                visible: {
                  y: '0%',
                  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
