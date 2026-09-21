import { credibilityItems } from '../data/site'
import { Marquee } from './ui/Marquee'
import { ScrollMarquee } from './ui/ScrollMarquee'

/** The four words the practice is built on. Brand copy, not demo data. */
const practiceWords = ['Research', 'Perspective', 'Education', 'Discipline']

/**
 * A two-layer band that closes the hero.
 *
 * The top layer sets the practice's four words huge and hollow, drifting with
 * the reader's own scroll so the page feels connected to the hand on the wheel.
 * Beneath a hairline, the fine layer states the areas of focus in the same
 * quiet uppercase as before. Both stay on navy so the band belongs to the hero
 * rather than to the light section that follows.
 */
export function CredibilityStrip() {
  return (
    <section
      aria-label="Areas of focus"
      className="relative overflow-hidden border-y border-bone/8 bg-ink-950"
    >
      <div className="py-6 sm:py-8 lg:py-10">
        <ScrollMarquee items={practiceWords} baseSpeed={2.2} tone="dark" outlined />
      </div>

      <div aria-hidden="true" className="h-px w-full bg-bone/8" />

      <div className="py-5 sm:py-6">
        <Marquee duration={52}>
          {credibilityItems.map((item) => (
            <span key={item} className="flex items-center whitespace-nowrap">
              <span className="px-7 text-[0.76rem] font-semibold tracking-[0.2em] text-bone/45 sm:px-9 sm:text-[0.82rem]">
                {item.toUpperCase()}
              </span>
              <span
                aria-hidden="true"
                className="h-[3px] w-[3px] rotate-45 bg-gold/70"
              />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
