# Ramsingh Vaghela — Aspire Research Capital

A premium single-page site for **Ramsingh Vaghela**, Founder of **Aspire Research Capital**.

> ⚠️ **This is a client demo.** Every biography detail, figure, article, testimonial,
> media appearance, market value and photograph is placeholder content. Nothing here is
> a verified fact about any person or organisation. See
> [Replacing the demo content](#replacing-the-demo-content).

## Run it

```bash
npm install
npm run dev      # development
npm run build    # production build -> dist/
npm run preview  # serve the production build
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Lenis · Lucide

## What the page does

- **Opening sequence** — on every load a short (~2.2 s) preloader: an animated candlestick
  mark, the ARC wordmark rising out of a mask, a hairline progress bar, then the plane lifts
  as a curtain and the hero builds in beneath it. Scroll is locked for the duration and
  released under cover. `history.scrollRestoration` is pinned to `manual` so a refresh always
  reveals the hero. Under `prefers-reduced-motion` the preloader never mounts.
- **Hero** — a dark market-screen photograph graded into the palette, cross-faded with a
  second glowing-chart layer, both on slow Ken Burns and scroll parallax; a generative
  candlestick canvas (random walk, no real data, no numbers) dissolving into the lower
  half; per-word headline reveal that sharpens from a blur; the arch-cropped portrait with a
  rotating hairline orbit, a research-first chip with a sparkline and a live Mumbai clock;
  copy that lifts away and a portrait that settles back as you scroll out; and a slim
  ticker strip of Indian market symbols labelled **ILLUSTRATIVE · NOT LIVE DATA**.
- **Scroll choreography** — a 2 px reading line across the top, a back-to-top ring that
  appears after 12 % scroll, a nav that hides on scroll-down and returns on scroll-up, a
  velocity-reactive outlined text band under the hero, a word-by-word scroll-linked
  reveal on the founder quote, per-column parallax in the photo wall, and a scrubbed ghost
  numeral behind the impact figures.
- **Dark sections** carry rounded "curtain" top edges overlapping the light section above,
  photographic backdrops with parallax (Mumbai night skylines, abstract dark curves, light
  trails), cursor spotlights on the pillar and contact grids, a ghost numeral behind the
  pinned philosophy step, a scan-line sweep on the featured video, a live
  Mumbai-time / market-session chip on the contact section, and a giant outlined ASPIRE
  wordmark rising behind the footer.
- **Reading panel** — every research report and insight opens in a slide-in reader
  (body, key takeaways, reading progress, copy-link share, "next") without leaving the
  page. While a piece is open the URL carries `?read=<slug>`, so a link opens straight
  into it. Bodies live in `src/data/articles.ts`.
- **Contact form** — topic chips plus name, email and message with inline validation.
  With no backend, a valid submission opens the reader's email app with everything
  prefilled and says so; swap `deliver()` in `ContactForm.tsx` for a POST before launch.
- **Light sections** get tactile detail: a 3D tilt on the founder portrait and a
  self-drawing signature, Ken Burns and a ghost year on the timeline's sticky panel, a
  cursor spotlight and rotating border beam on the expertise ledger, numbered research rows
  with hairlines that draw in, filter counts on the insights pills, outlet monograms on the
  media rail, and an animated focus line on the newsletter field.

## Replacing the demo content

Everything the client needs to change lives in three files — no component edits required.

| What | Where |
| --- | --- |
| Copy, milestones, stats, articles, testimonials, media, contact | `src/data/site.ts` |
| Article bodies and key takeaways for the reading panel | `src/data/articles.ts` |
| Ticker symbols and values (illustrative) | `src/data/ticker.ts` |
| Every photograph | `src/data/images.ts` |

All three are annotated with which values are placeholders. Image licensing and a
per-image manifest are in [`IMAGE_SOURCES.md`](IMAGE_SOURCES.md).

**The founder photograph is a stock model, not Ramsingh Vaghela.** Replace
`founderPortrait` and `founderStory` in `src/data/images.ts` before launch:

```ts
founderPortrait: "/images/founder.jpg",   // drop the file in public/images/
```

Crops and aspect ratios are enforced in CSS, so swapping a file never breaks a layout.

### Placeholders that need a decision before launch

- **`impactStats`** — years of experience, research count, community size, sessions.
  Replace with verified numbers or delete the section.
- **Ticker** (`src/data/ticker.ts`) — values are illustrative and the strip says so. Either
  wire it to a licensed market-data feed (and keep the disclaimer discipline) or remove
  `TickerTape` from `Hero.tsx`. Never show static numbers as if live.
- **Preloader on every load** — by design for the demo ("on refresh"). If it feels
  repetitive for returning visitors, gate it with `sessionStorage` in `App.tsx` and keep
  the `ready` flip when skipped.
- **Market-session chip** (`ContactCTA.tsx`) — the clock is real; the open/closed flag is a
  simple Mon–Fri 09:15–15:30 IST rule that ignores exchange holidays. Keep, refine, or drop.
- **Newsletter forms** (`Newsletter.tsx`, `Footer.tsx`) — validate and show a confirmation,
  but POST nowhere. Wire `handleSubmit` to the client's email platform.
- **Contact form** (`ContactForm.tsx`) — hands off to the visitor's email app via
  `mailto:`. Replace `deliver()` with a form endpoint (Formspree, Netlify Forms, a small
  function) so submissions are captured server-side.
- **Article bodies** (`src/data/articles.ts`) — placeholder writing so the reader has
  content; replace with the client's actual research.
- **Social and article links** — all `#` placeholders.
- **`brand.email` / `brand.location`** in `src/data/site.ts`.
- **Media logos** — currently styled wordmarks; swap for real SVG logos once rights are
  confirmed.
- **SEO URLs** — `index.html` uses `aspireresearchcapital.com` and references
  `/og-image.jpg`, which still needs to be produced (1200×630).

No regulatory registration, certification, performance figure or return is claimed
anywhere on the site, and none should be added without compliance review. The footer
carries a financial disclaimer.

## Architecture

```
src/
  App.tsx                 section order = the page's light/dark rhythm; preloader → ready → hero
  main.tsx                mounts the app; pins scrollRestoration to manual
  data/
    site.ts               all copy and structured content
    ticker.ts             illustrative index values for the hero strip
    images.ts             all image URLs, one swappable object
  hooks/
    useSmoothScroll.ts    Lenis setup, getLenis(), programmatic anchor scrolling
    useActiveSection.ts   nav scroll-spy
  components/
    Preloader, Navbar, ScrollProgress, Hero, TickerTape, CredibilityStrip,
    FounderStory, JourneyTimeline, AspireVision, Expertise, Philosophy, Stats,
    Research, Insights, VideoSection, Quote, Media, Testimonials, Gallery,
    Newsletter, ContactCTA, Footer, CustomCursor
    ui/
      Container, SectionHeading, AnimatedText, Reveal, RevealImage,
      MagneticButton, Counter, Marquee, ScrollMarquee, MarketCurve,
      MarketCanvas, CandlestickMark, Logo, SocialIcon
```

### Design system

Tokens are defined once in `src/index.css` under `@theme` — colours, the three type
families, and the shared easing curves. Sections alternate light and dark deliberately
so the scroll has a pulse; `App.tsx` documents the intended order.

Type pairing: **Manrope** (display/UI), **Inter** (body), **Instrument Serif** italic as
an editorial accent inside headlines. All sizes use `clamp()`.

### Motion

The vocabulary stays small: `Reveal` for arrival, `AnimatedText` for masked headline
lines, `RevealImage` for clip-wipe plus parallax, and the scroll-linked pieces above.
The hero, the timeline's sticky panel and the pinned philosophy section get bespoke
treatment; philosophy is the only section that pins.

Everything degrades under `prefers-reduced-motion`: Lenis never initialises, the
preloader never mounts, continuous animations (canvas, Ken Burns, orbit, marquee) stop,
entrance animations resolve to their final state, and the pinned section becomes a
stacked list. Every RAF loop cancels on unmount and pauses when the tab is hidden or the
element is off-screen.

## Accessibility

Semantic landmarks, a skip link, keyboard-operable carousels and lightbox (Escape and
arrow keys, focus restored on close), visible focus rings, `aria-live` on the filter and
form regions and on the preloader (`role="status"`), 44 px minimum touch targets, and alt
text that marks demo photography as such. The custom cursor is a pointer-only enhancement
and never replaces the native one.

## Verified

Built and checked in a real browser at 1440 / 1280 / 1024 / 768 / 430 / 390 px, plus a
reduced-motion pass: no horizontal overflow at any width, no console errors, no broken
images, preloader removed from the DOM and scroll unlocked after the curtain lifts.

The production bundle is ~163 KB gzipped JavaScript, most of it Framer Motion; the
canvas, ticker and preloader added roughly 16 KB. Fine for a demo; if Lighthouse
performance becomes a hard gate, code-split `MarketCanvas` and the gallery lightbox.
