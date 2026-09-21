/* =============================================================================
 * SITE CONTENT — SINGLE SOURCE OF TRUTH
 * =============================================================================
 *
 * ⚠️  DEMO CONTENT
 *
 * Every date, figure, milestone, article, testimonial and appearance below is
 * PLACEHOLDER content written for a client demonstration. Nothing here has
 * been verified and nothing should be published as fact.
 *
 * Specifically marked for replacement:
 *   • journeyMilestones — biography timeline
 *   • impactStats       — years, counts, community size
 *   • researchArticles  — titles, dates, reading times
 *   • insights          — articles, videos, notes
 *   • testimonials      — names, roles, words
 *   • mediaAppearances  — publications, podcasts, events
 *
 * No regulatory registration, certification, performance figure or return is
 * claimed anywhere on this site, and none should be added without compliance
 * review.
 * ========================================================================== */

import { siteImages } from './images'

/* ----------------------------------------------------------------- IDENTITY */

export const brand = {
  founder: 'Ramsingh Vaghela',
  company: 'Aspire Research Capital',
  shortName: 'ARC',
  role: 'Founder',
  tagline: 'Research before reaction.',
  email: 'connect@aspireresearchcapital.com', // DEMO
  location: 'Mumbai, India', // DEMO
} as const

/* -------------------------------------------------------------- NAVIGATION */

export type NavLink = { id: string; label: string }

export const navLinks: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'research', label: 'Research' },
  { id: 'insights', label: 'Insights' },
  { id: 'media', label: 'Media' },
  { id: 'contact', label: 'Contact' },
]

/* ------------------------------------------------------------- CREDIBILITY */

export const credibilityItems: string[] = [
  'Market Research',
  'Investment Strategy',
  'Financial Education',
  'Capital Markets',
  'Investor Awareness',
  'Equity Analysis',
  'Risk Discipline',
]

/* ------------------------------------------------------- JOURNEY TIMELINE */
/* DEMO MILESTONES — replace year, title, body and image with the client's
   verified biography. The structure stays identical.                        */

export type Milestone = {
  year: string
  title: string
  body: string
  image: string
  imageAlt: string
  marker: string
}

export const journeyMilestones: Milestone[] = [
  {
    year: '2008',
    title: 'The Beginning',
    body: 'First exposure to financial markets and investment research. A period spent reading far more than trading — learning how prices form, why they move, and how little of that movement is actually worth reacting to.',
    image: siteImages.journey2008,
    imageAlt: 'Handwritten study notes beside a coffee cup — demo image',
    marker: 'First principles',
  },
  {
    year: '2012',
    title: 'Building Market Expertise',
    body: 'Developing deeper understanding across equities, technical research and investor psychology. Different market conditions demanded different frameworks, and knowing which one applied became the real skill.',
    image: siteImages.journey2012,
    imageAlt: 'Market chart study on a screen — demo image',
    marker: 'Frameworks',
  },
  {
    year: '2016',
    title: 'Research & Advisory',
    body: 'Working extensively with market participants and building structured research methodologies. Repeatable process replaced instinct, and written research replaced opinion.',
    image: siteImages.journey2016,
    imageAlt: 'Professionals reviewing research documents — demo image',
    marker: 'Process',
  },
  {
    year: '2020',
    title: 'A New Vision',
    body: 'Beginning the foundation for a research-first financial ecosystem. A volatile market cycle made one thing clear: investors did not need more signals, they needed better context.',
    image: siteImages.journey2020,
    imageAlt: 'Quiet architectural office corridor — demo image',
    marker: 'Context',
  },
  {
    year: '2023',
    title: 'Aspire Research Capital',
    body: 'Building Aspire Research Capital around research, education and disciplined market participation — a single place where analysis, perspective and learning reinforce one another.',
    image: siteImages.journey2023,
    imageAlt: 'Aspire Research Capital workspace — demo image',
    marker: 'Foundation',
  },
  {
    year: '2026',
    title: 'The Next Chapter',
    body: 'Expanding research, investor education and market intelligence — widening coverage while keeping the standard that every view published is one worth defending.',
    image: siteImages.journey2026,
    imageAlt: 'City skyline at dusk — demo image',
    marker: 'Scale',
  },
]

/* ------------------------------------------------------------ ARC PILLARS */

export type Pillar = { number: string; title: string; body: string }

export const pillars: Pillar[] = [
  {
    number: '01',
    title: 'Research',
    body: 'Structured market research built around data, context and disciplined analysis — written to be read twice, not skimmed once.',
  },
  {
    number: '02',
    title: 'Perspective',
    body: 'Helping investors understand the forces behind market movement, so a headline becomes information rather than instruction.',
  },
  {
    number: '03',
    title: 'Education',
    body: 'Turning complex financial concepts into practical understanding that holds up when conditions change.',
  },
]

/* --------------------------------------------------------------- EXPERTISE */

export type Expertise = {
  number: string
  title: string
  summary: string
  detail: string
}

export const expertiseAreas: Expertise[] = [
  {
    number: '01',
    title: 'Equity Markets',
    summary: 'Listed equity research across market capitalisations and cycles.',
    detail: 'Company-level work grounded in business quality, industry position and the price you are asked to pay for both.',
  },
  {
    number: '02',
    title: 'Technical Research',
    summary: 'Price structure, participation and the behaviour behind the chart.',
    detail: 'Technicals treated as a record of collective decision-making rather than a predictive instrument.',
  },
  {
    number: '03',
    title: 'Fundamental Analysis',
    summary: 'Financial statements, capital allocation and durable earnings power.',
    detail: 'Reading the accounts closely enough to separate an improving business from an improving quarter.',
  },
  {
    number: '04',
    title: 'Market Psychology',
    summary: 'How conviction, fear and crowding shape outcomes.',
    detail: 'Most portfolio damage is behavioural. Understanding that is as valuable as any valuation model.',
  },
  {
    number: '05',
    title: 'Investment Strategy',
    summary: 'Building an approach that survives more than one market regime.',
    detail: 'Strategy is what remains once you remove everything that only worked in the last cycle.',
  },
  {
    number: '06',
    title: 'Risk Management',
    summary: 'Position sizing, exposure and the cost of being wrong.',
    detail: 'The first question is never how much this can make — it is what happens if the thesis breaks.',
  },
  {
    number: '07',
    title: 'Investor Education',
    summary: 'Sessions, workshops and written material for serious learners.',
    detail: 'Teaching the reasoning rather than the recommendation, so decisions can be made independently.',
  },
  {
    number: '08',
    title: 'Capital Market Research',
    summary: 'Macro context, liquidity, sector rotation and flows.',
    detail: 'The conditions a thesis has to operate inside, mapped before the thesis is written.',
  },
]

/* -------------------------------------------------------------- PHILOSOPHY */

export type Principle = { label: string; body: string }

export const philosophyPrinciples: Principle[] = [
  {
    label: 'Observe',
    body: 'Start with what the market is actually doing, not with what it should be doing. Evidence first, narrative later.',
  },
  {
    label: 'Understand',
    body: 'Find the mechanism. A price move without an explanation is a coincidence you cannot repeat.',
  },
  {
    label: 'Evaluate',
    body: 'Weigh the thesis against its cost of being wrong. Conviction without downside work is just enthusiasm.',
  },
  {
    label: 'Act',
    body: 'Size the decision to the evidence behind it. Certainty and position size should move together.',
  },
  {
    label: 'Review',
    body: 'Study outcomes honestly, including the ones that worked for the wrong reason. That is where the learning is.',
  },
]

/* ------------------------------------------------------------ IMPACT STATS */
/* DEMO FIGURES — placeholders only. Replace with verified numbers, or remove
   the section entirely, before production.                                  */

export type Stat = { value: number; suffix: string; label: string; note: string }

export const impactStats: Stat[] = [
  { value: 15, suffix: '+', label: 'Years of Market Experience', note: 'Across multiple cycles' },
  { value: 500, suffix: '+', label: 'Research Insights', note: 'Published notes and reports' },
  { value: 10, suffix: 'K+', label: 'Investor Community', note: 'Readers and learners' },
  { value: 100, suffix: '+', label: 'Sessions & Workshops', note: 'Live and online' },
]

/* ---------------------------------------------------------------- RESEARCH */
/* DEMO ARTICLES — titles, dates and reading times are illustrative.         */

export type Article = {
  category: string
  date: string
  title: string
  excerpt: string
  readingTime: string
  image: string
}

export const featuredResearch: Article = {
  category: 'Market Outlook',
  date: 'September 2026',
  title: 'The Quiet Repricing: What Changed Beneath a Flat Index',
  excerpt:
    'The headline index finished the quarter almost exactly where it started. Underneath it, leadership rotated, breadth narrowed and the market repriced risk without ever announcing it. A study of what the index concealed.',
  readingTime: '11 min read',
  image: siteImages.researchFeatured,
}

export const researchArticles: Article[] = [
  {
    category: 'Equity Research',
    date: 'August 2026',
    title: 'Margin Durability in a Slower Demand Cycle',
    excerpt: 'Separating businesses that protected margin through pricing power from those that simply postponed costs.',
    readingTime: '8 min read',
    image: siteImages.researchEquity,
  },
  {
    category: 'Sector Insights',
    date: 'August 2026',
    title: 'Financials: Reading the Credit Cycle Early',
    excerpt: 'Asset quality rarely deteriorates suddenly. The signals that tend to appear several quarters ahead.',
    readingTime: '9 min read',
    image: siteImages.researchSector,
  },
  {
    category: 'Investor Psychology',
    date: 'July 2026',
    title: 'Why Conviction Peaks at the Wrong Moment',
    excerpt: 'Confidence runs highest when evidence is most crowded. A framework for noticing it in your own decisions.',
    readingTime: '6 min read',
    image: siteImages.researchPsychology,
  },
  {
    category: 'Risk & Strategy',
    date: 'July 2026',
    title: 'Position Sizing as a Statement of Uncertainty',
    excerpt: 'Treating size as an expression of how much you know, rather than how much you want.',
    readingTime: '7 min read',
    image: siteImages.researchRisk,
  },
  {
    category: 'Market Outlook',
    date: 'June 2026',
    title: 'Liquidity, Flows and the Illusion of Momentum',
    excerpt: 'When participation narrows, trend strength and trend quality stop meaning the same thing.',
    readingTime: '10 min read',
    image: siteImages.researchOutlook,
  },
]

/* ---------------------------------------------------------------- INSIGHTS */
/* DEMO CONTENT — articles, notes and videos for the filterable grid.        */

export const insightFilters = ['All', 'Research', 'Markets', 'Investing', 'Education', 'Videos'] as const
export type InsightFilter = (typeof insightFilters)[number]

export type Insight = {
  category: Exclude<InsightFilter, 'All'>
  kind: 'Article' | 'Video' | 'Market Note'
  title: string
  excerpt: string
  date: string
  meta: string
  image: string
}

export const insights: Insight[] = [
  {
    category: 'Markets',
    kind: 'Market Note',
    title: 'Breadth Is Narrowing Again — Here Is Why It Matters',
    excerpt: 'Fewer names carrying the index changes the risk you are taking, even when the level looks unchanged.',
    date: '12 Sep 2026',
    meta: '5 min read',
    image: siteImages.insightMarketStructure,
  },
  {
    category: 'Investing',
    kind: 'Article',
    title: 'Compounding Is Boring by Design',
    excerpt: 'The part of investing that works best is the part that gives you the least to do.',
    date: '04 Sep 2026',
    meta: '7 min read',
    image: siteImages.insightCompounding,
  },
  {
    category: 'Research',
    kind: 'Article',
    title: 'Reading Volatility as Information, Not Noise',
    excerpt: 'Volatility tells you how confidently the market holds its own view. That is worth listening to.',
    date: '27 Aug 2026',
    meta: '8 min read',
    image: siteImages.insightVolatility,
  },
  {
    category: 'Education',
    kind: 'Article',
    title: 'A Beginner Framework for Evaluating Any Business',
    excerpt: 'Six questions that work whether you are looking at a bank, a manufacturer or a software company.',
    date: '19 Aug 2026',
    meta: '9 min read',
    image: siteImages.insightWorkshop,
  },
  {
    category: 'Videos',
    kind: 'Video',
    title: 'Understanding Market Cycles — Full Conversation',
    excerpt: 'A long-form discussion on how cycles repeat in structure even when they never repeat in detail.',
    date: '11 Aug 2026',
    meta: '42 min watch',
    image: siteImages.insightPodcast,
  },
  {
    category: 'Research',
    kind: 'Article',
    title: 'What the Cash Flow Statement Says First',
    excerpt: 'Earnings are an opinion in a way cash is not. Where to look before the headline number.',
    date: '02 Aug 2026',
    meta: '6 min read',
    image: siteImages.insightFundamentals,
  },
  {
    category: 'Investing',
    kind: 'Market Note',
    title: 'Sizing Down Is Also a Decision',
    excerpt: 'Reducing exposure gets read as indecision. More often it is the most informed thing in the portfolio.',
    date: '24 Jul 2026',
    meta: '4 min read',
    image: siteImages.insightPositionSizing,
  },
  {
    category: 'Education',
    kind: 'Video',
    title: 'Investor Behaviour Workshop — Session Highlights',
    excerpt: 'Selected moments from a live session on the decisions investors regret most, and why.',
    date: '15 Jul 2026',
    meta: '18 min watch',
    image: siteImages.insightBehaviour,
  },
]

/* ------------------------------------------------------------------ VIDEOS */

export type Video = { title: string; duration: string; label: string; image: string }

export const featuredVideo = {
  label: 'Featured Conversation',
  title: 'Understanding Market Cycles',
  description:
    'Cycles rarely repeat in detail, but they repeat in structure — in how optimism builds, how leadership rotates and how quickly conviction becomes crowding. A long-form conversation on reading that structure while you are still inside it.',
  duration: '42 minutes',
  image: siteImages.videoFeatured,
}

export const videoClips: Video[] = [
  {
    title: 'What Research Actually Protects You From',
    duration: '14 min',
    label: 'Conversation',
    image: siteImages.videoClipOne,
  },
  {
    title: 'Risk Before Return: A Working Framework',
    duration: '22 min',
    label: 'Workshop',
    image: siteImages.videoClipTwo,
  },
  {
    title: 'Questions Worth Asking Before You Invest',
    duration: '09 min',
    label: 'Session',
    image: siteImages.videoClipThree,
  },
]

/* ------------------------------------------------------------------- MEDIA */
/* DEMO APPEARANCES — placeholder names. Do not publish as fact.             */

export type MediaItem = { outlet: string; type: string; title: string; year: string }

export const mediaAppearances: MediaItem[] = [
  { outlet: 'The Market Desk', type: 'Podcast', title: 'Research-first investing in a headline-driven market', year: '2026' },
  { outlet: 'Capital Quarterly', type: 'Interview', title: 'Why perspective outperforms prediction', year: '2026' },
  { outlet: 'India Investor Summit', type: 'Keynote', title: 'Building conviction without certainty', year: '2025' },
  { outlet: 'Frontline Finance', type: 'Column', title: 'The cost of reacting to every move', year: '2025' },
  { outlet: 'Equity Forum', type: 'Panel', title: 'Risk discipline across market cycles', year: '2025' },
  { outlet: 'Learn Markets Live', type: 'Masterclass', title: 'Reading a business before reading a chart', year: '2024' },
]

export const mediaLogos: string[] = [
  'THE MARKET DESK',
  'CAPITAL QUARTERLY',
  'FRONTLINE FINANCE',
  'EQUITY FORUM',
  'INVESTOR SUMMIT',
  'LEARN MARKETS',
]

/* ------------------------------------------------------------ TESTIMONIALS */
/* DEMO TESTIMONIALS — fictional. Replace with consented client quotes.      */

export type Testimonial = { quote: string; name: string; role: string }

export const testimonials: Testimonial[] = [
  {
    quote:
      'His approach makes complex market ideas remarkably easy to understand. Nothing is dumbed down — it is just explained by someone who genuinely understands it.',
    name: 'A. Mehta',
    role: 'Investor',
  },
  {
    quote:
      'I stopped chasing every move after one session. The research is calm, structured and refreshingly honest about what it does not know.',
    name: 'S. Krishnan',
    role: 'Entrepreneur',
  },
  {
    quote:
      'What stands out is the discipline. Every view comes with the reasoning attached, so you learn how to think rather than what to buy.',
    name: 'R. Desai',
    role: 'Portfolio Analyst',
  },
  {
    quote:
      'As a student, this was the first time markets felt learnable instead of intimidating. The teaching starts from first principles and stays there.',
    name: 'N. Iyer',
    role: 'Finance Student',
  },
]

/* ----------------------------------------------------------------- MOMENTS */

export type GalleryItem = { image: string; caption: string; tall?: boolean }

export const galleryItems: GalleryItem[] = [
  { image: siteImages.momentKeynote, caption: 'Investor summit keynote', tall: true },
  { image: siteImages.momentPanel, caption: 'Research panel discussion' },
  { image: siteImages.momentWorkshop, caption: 'Strategy workshop' },
  { image: siteImages.momentDesk, caption: 'Research desk', tall: true },
  { image: siteImages.momentBoardroom, caption: 'Aspire Research Capital' },
  { image: siteImages.momentCity, caption: 'Between sessions', tall: true },
  { image: siteImages.momentStudio, caption: 'Recording a conversation' },
  { image: siteImages.momentTeam, caption: 'Team review' },
  { image: siteImages.momentSkyline, caption: 'Financial district' },
]

/* ----------------------------------------------------------------- CONTACT */

export type ContactOption = { title: string; body: string }

export const contactOptions: ContactOption[] = [
  { title: 'Business Enquiries', body: 'Partnerships, research mandates and long-term collaboration.' },
  { title: 'Speaking & Events', body: 'Keynotes, panels, workshops and investor sessions.' },
  { title: 'Research Collaboration', body: 'Joint research, data partnerships and contributed analysis.' },
  { title: 'Media Requests', body: 'Interviews, commentary, podcasts and editorial features.' },
]

export const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'X', href: '#' },
] as const
