import { useState } from 'react'
import { AspireVision } from './components/AspireVision'
import { ContactCTA } from './components/ContactCTA'
import { CredibilityStrip } from './components/CredibilityStrip'
import { CustomCursor } from './components/CustomCursor'
import { Expertise } from './components/Expertise'
import { Footer } from './components/Footer'
import { FounderStory } from './components/FounderStory'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Insights } from './components/Insights'
import { JourneyTimeline } from './components/JourneyTimeline'
import { Media } from './components/Media'
import { Navbar } from './components/Navbar'
import { Newsletter } from './components/Newsletter'
import { Philosophy } from './components/Philosophy'
import { Preloader } from './components/Preloader'
import { Quote } from './components/Quote'
import { Research } from './components/Research'
import { ScrollProgress } from './components/ScrollProgress'
import { Stats } from './components/Stats'
import { Testimonials } from './components/Testimonials'
import { VideoSection } from './components/VideoSection'
import { useSmoothScroll } from './hooks/useSmoothScroll'

/**
 * Section order is also the tonal rhythm of the page. Dark and light blocks
 * alternate deliberately so the scroll has a pulse:
 *
 *   hero (dark) → founder (light) → journey (white) → vision (dark) →
 *   expertise (light) → philosophy (dark, pinned) → stats (white) →
 *   research (light) → insights (white) → video (dark) → quote (light) →
 *   media (white) → testimonials (light) → gallery (white) →
 *   newsletter (light) → contact (dark) → footer (dark)
 *
 * The hero holds its entrance until the preloader curtain starts to lift, so
 * the headline rises into an already-uncovered frame rather than playing
 * unseen beneath the overlay.
 */
export default function App() {
  useSmoothScroll()

  // Flipped once the curtain begins to lift (or immediately under reduced
  // motion, where the preloader never mounts). setState is idempotent, so the
  // belt-and-braces onComplete call is harmless.
  const [ready, setReady] = useState(false)

  return (
    <>
      <Preloader onCurtainStart={() => setReady(true)} onComplete={() => setReady(true)} />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero ready={ready} />
        <CredibilityStrip />
        <FounderStory />
        <JourneyTimeline />
        <AspireVision />
        <Expertise />
        <Philosophy />
        <Stats />
        <Research />
        <Insights />
        <VideoSection />
        <Quote />
        <Media />
        <Testimonials />
        <Gallery />
        <Newsletter />
        <ContactCTA />
      </main>

      <Footer />
    </>
  )
}
