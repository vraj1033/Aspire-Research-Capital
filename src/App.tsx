import { useMemo, useState, type ReactNode } from 'react'
import { fromArticle, fromInsight, ReaderProvider } from './components/ArticleReader'
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
import { SectionBoundary } from './components/ui/SectionBoundary'
import { VideoSection } from './components/VideoSection'
import { featuredResearch, insights, researchArticles } from './data/site'
import { useHashDeepLink, useImageArrival, useThemeColor } from './hooks/usePageChrome'
import { useSmoothScroll } from './hooks/useSmoothScroll'

/** Each section fails alone: one runtime error must never blank the page. */
const Guard = ({ name, children }: { name: string; children: ReactNode }) => (
  <SectionBoundary name={name}>{children}</SectionBoundary>
)

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
  useThemeColor()
  useImageArrival()

  // Flipped once the curtain begins to lift (or immediately under reduced
  // motion, where the preloader never mounts). setState is idempotent, so the
  // belt-and-braces onComplete call is harmless.
  const [ready, setReady] = useState(false)
  useHashDeepLink(ready)

  // Everything the reading panel can open, in page order, so "Next" walks
  // the research desk and then the insights.
  const readables = useMemo(
    () => [
      fromArticle(featuredResearch),
      ...researchArticles.map((article) => fromArticle(article)),
      ...insights.map(fromInsight),
    ],
    [],
  )

  return (
    <ReaderProvider items={readables} ready={ready}>
      {/* If the preloader itself fails, release the hero rather than leave the
          page held in its pre-curtain state. */}
      <SectionBoundary name="Preloader" onError={() => setReady(true)}>
        <Preloader onCurtainStart={() => setReady(true)} onComplete={() => setReady(true)} />
      </SectionBoundary>
      <Guard name="CustomCursor">
        <CustomCursor />
      </Guard>
      <Guard name="ScrollProgress">
        <ScrollProgress />
      </Guard>
      <Guard name="Navbar">
        <Navbar />
      </Guard>

      <main id="main">
        <Guard name="Hero">
          <Hero ready={ready} />
        </Guard>
        <Guard name="CredibilityStrip">
          <CredibilityStrip />
        </Guard>
        <Guard name="FounderStory">
          <FounderStory />
        </Guard>
        <Guard name="JourneyTimeline">
          <JourneyTimeline />
        </Guard>
        <Guard name="AspireVision">
          <AspireVision />
        </Guard>
        <Guard name="Expertise">
          <Expertise />
        </Guard>
        <Guard name="Philosophy">
          <Philosophy />
        </Guard>
        <Guard name="Stats">
          <Stats />
        </Guard>
        <Guard name="Research">
          <Research />
        </Guard>
        <Guard name="Insights">
          <Insights />
        </Guard>
        <Guard name="VideoSection">
          <VideoSection />
        </Guard>
        <Guard name="Quote">
          <Quote />
        </Guard>
        <Guard name="Media">
          <Media />
        </Guard>
        <Guard name="Testimonials">
          <Testimonials />
        </Guard>
        <Guard name="Gallery">
          <Gallery />
        </Guard>
        <Guard name="Newsletter">
          <Newsletter />
        </Guard>
        <Guard name="ContactCTA">
          <ContactCTA />
        </Guard>
      </main>

      <Guard name="Footer">
        <Footer />
      </Guard>
    </ReaderProvider>
  )
}
