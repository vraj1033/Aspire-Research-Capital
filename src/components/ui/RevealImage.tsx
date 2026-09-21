import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type RevealImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Vertical drift in px across the full scroll pass. 0 disables parallax. */
  parallax?: number
  /** Scale the image up on hover. */
  hoverZoom?: boolean
  priority?: boolean
  width?: number
  height?: number
  /** Desaturate until hovered — used in the media strip. */
  monochrome?: boolean
}

/**
 * An image that uncovers itself: a mask wipes upward while the photograph
 * settles from a slight over-scale. Optional parallax drift is applied to the
 * inner image only, so the frame stays exactly where the layout put it.
 *
 * The in-view trigger deliberately sits on the OUTER wrapper and drives the
 * clip through variants. A fully clipped element reports zero intersection
 * area, so putting `whileInView` on the clipped node itself would deadlock —
 * it could never become visible enough to start the animation that reveals it.
 */
export function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  parallax = 0,
  hoverZoom = false,
  priority = false,
  width = 1000,
  height = 1250,
  monochrome = false,
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax])
  const restingScale = parallax ? 1.12 : 1

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={reduced ? undefined : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
          visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      >
        {/* Hover zoom lives on its own wrapper: the image's transform is owned
            by the reveal variants, and inline styles would beat the class. */}
        <div
          className={`h-full w-full ${
            hoverZoom
              ? 'transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]'
              : ''
          }`}
        >
          <motion.img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            // Parallax drives `y` only; scale is animated separately so the two
            // never fight over the same transform channel.
            style={reduced || !parallax ? undefined : { y }}
            variants={{
              hidden: { scale: 1.14 },
              visible: {
                scale: restingScale,
                transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className={`h-full w-full object-cover ${
              monochrome ? 'grayscale transition-[filter] duration-700 group-hover:grayscale-0' : ''
            } ${imgClassName}`}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
