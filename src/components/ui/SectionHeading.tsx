import type { ReactNode } from 'react'
import { AnimatedText } from './AnimatedText'
import { Reveal } from './Reveal'

type Tone = 'dark' | 'light'

type SectionHeadingProps = {
  eyebrow?: string
  /** One entry per visual line of the headline. */
  lines: ReactNode[]
  intro?: ReactNode
  tone?: Tone
  align?: 'left' | 'center'
  className?: string
  /** Keeps the headline measure narrow for long titles. */
  size?: 'md' | 'lg'
}

/**
 * The shared section opener: eyebrow, masked headline, optional standfirst.
 * Using one component for all of them is what keeps vertical rhythm identical
 * across eighteen very different sections.
 */
export function SectionHeading({
  eyebrow,
  lines,
  intro,
  tone = 'light',
  align = 'left',
  className = '',
  size = 'lg',
}: SectionHeadingProps) {
  const isDark = tone === 'dark'
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <Reveal y={14}>
          <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
            <span className={`h-px w-8 ${isDark ? 'bg-gold/70' : 'bg-emerald-deep/60'}`} />
            <span className={`eyebrow ${isDark ? 'text-gold-soft' : 'text-emerald-deep'}`}>{eyebrow}</span>
          </div>
        </Reveal>
      )}

      <AnimatedText
        lines={lines}
        as="h2"
        className={`mt-5 ${
          size === 'lg'
            ? 'text-[clamp(2.05rem,5.2vw,4.1rem)]'
            : 'text-[clamp(1.75rem,3.8vw,2.9rem)]'
        } font-bold leading-[1.06] ${isDark ? 'text-bone' : 'text-ink-950'}`}
      />

      {intro && (
        <Reveal delay={0.12}>
          <p
            className={`mt-6 max-w-[54ch] text-[clamp(0.98rem,1.15vw,1.09rem)] leading-[1.75] ${
              centered ? 'mx-auto' : ''
            } ${isDark ? 'text-bone/60' : 'text-muted'}`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  )
}
