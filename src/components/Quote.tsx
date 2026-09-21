import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { brand } from '../data/site'
import { Container } from './ui/Container'
import { MarketCurve } from './ui/MarketCurve'
import { Reveal } from './ui/Reveal'

type Word = { text: string; editorial?: boolean }

/** The statement, one array per visual line. Editorial words carry the colour. */
const lines: Word[][] = [
  [
    { text: 'The' },
    { text: 'goal' },
    { text: 'isn\u2019t' },
    { text: 'to' },
    { text: 'predict', editorial: true },
    { text: 'every' },
    { text: 'move.' },
  ],
  [{ text: 'It\u2019s' }, { text: 'to' }, { text: 'understand', editorial: true }, { text: 'enough' }],
  [{ text: 'to' }, { text: 'make' }, { text: 'better' }, { text: 'decisions.' }],
]

const wordCount = lines.reduce((count, line) => count + line.length, 0)

/** Resting opacity of an unread word. */
const DIM = 0.14
/** An editorial word rests as ink at 20% and arrives as emerald. */
const REST_INK = 'rgba(7, 24, 44, 0.2)'
const EMERALD = '#087f5b'

type ScrubWordProps = {
  word: Word
  index: number
  progress: MotionValue<number>
  reduced: boolean
}

/**
 * One word of the statement, lit by the scroll.
 *
 * Each word owns a slice of the pass and overlaps its neighbour by more than
 * half, so the reveal reads as light moving across the line rather than a
 * typewriter. Editorial words shift colour instead of fading from the same
 * floor — their 20% ink is already as quiet as the others' 14% opacity, so
 * both arrive together without one starting invisible.
 */
function ScrubWord({ word, index, progress, reduced }: ScrubWordProps) {
  const start = index / wordCount
  const end = Math.min(1, start + 1.6 / wordCount)
  const opacity = useTransform(progress, [start, end], [word.editorial ? 0.6 : DIM, 1])
  const color = useTransform(progress, [start, end], [REST_INK, EMERALD])

  const style = reduced
    ? word.editorial
      ? { color: EMERALD }
      : undefined
    : word.editorial
      ? { opacity, color }
      : { opacity }

  return (
    <motion.span style={style} className={`inline-block ${word.editorial ? 'editorial' : ''}`}>
      {word.text}
    </motion.span>
  )
}

/**
 * A full-width pause.
 *
 * No image, no card, no call to action — just the sentence and the space
 * around it. The page needs one moment that asks for nothing, so the words are
 * not animated in; they are lit by the reader's own scroll and wait otherwise.
 */
export function Quote() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(pass, [0, 1], ['-8%', '8%'])

  // The reveal runs from the section entering the lower fifth of the viewport
  // to its foot reaching just past the middle — the whole line is lit while
  // the eye is still on it.
  const { scrollYProgress: reveal } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })

  let wordIndex = 0

  return (
    <section
      ref={ref}
      aria-label="Founder quote"
      className="relative overflow-hidden bg-bone py-28 sm:py-36 lg:py-48"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          style={reduced ? undefined : { x: drift }}
          className="absolute left-1/2 top-1/2 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-mist/70 blur-[120px]"
        />
        <MarketCurve
          className="absolute inset-x-0 bottom-0 h-[42%] w-full opacity-[0.35]"
          stroke="rgba(8, 127, 91, 0.22)"
          strokeWidth={1}
          delay={0.2}
        />
      </div>

      <Container className="relative">
        <figure className="mx-auto max-w-5xl text-center">
          <Reveal y={12}>
            <span
              aria-hidden="true"
              className="editorial mx-auto block text-[3.5rem] leading-none text-gold/50"
            >
              &ldquo;
            </span>
          </Reveal>

          <blockquote>
            <p className="mt-2 text-[clamp(1.6rem,4.4vw,3.35rem)] font-bold leading-[1.22] tracking-[-0.035em] text-ink-950">
              {lines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.map((word, i) => {
                    const index = wordIndex++
                    return (
                      <span key={`${word.text}-${i}`}>
                        <ScrubWord word={word} index={index} progress={reveal} reduced={Boolean(reduced)} />
                        {i < line.length - 1 ? ' ' : ''}
                      </span>
                    )
                  })}
                </span>
              ))}
            </p>
          </blockquote>

          <Reveal delay={0.35}>
            <figcaption className="mt-12 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-ink-950/20" aria-hidden="true" />
              <span className="text-[0.8rem] font-semibold tracking-[0.1em] text-ink-950">
                {brand.founder}
              </span>
              <span className="h-[3px] w-[3px] rounded-full bg-gold" aria-hidden="true" />
              <span className="text-[0.78rem] text-muted">{brand.role}, {brand.company}</span>
              <span className="h-px w-10 bg-ink-950/20" aria-hidden="true" />
            </figcaption>
          </Reveal>
        </figure>
      </Container>
    </section>
  )
}
