/* =============================================================================
 * IMAGE CONFIGURATION — SINGLE SOURCE OF TRUTH
 * =============================================================================
 *
 * DEMO IMAGES — every photograph below is a temporary visual placeholder
 * sourced from Unsplash (free to use under the Unsplash License).
 *
 * The person shown in `founderPortrait` / `founderStory` is a stock model and
 * is NOT Ramsingh Vaghela. Replace before production.
 *
 * HOW TO REPLACE
 * --------------
 * Drop the client's photography into `public/images/` and swap the value only:
 *
 *   founderPortrait: "/images/founder.jpg",
 *
 * Every consumer reads from this object, so no layout, crop or component
 * change is required. Aspect ratios are enforced in CSS, not by the file.
 *
 * See IMAGE_SOURCES.md for per-image attribution.
 * ========================================================================== */

/** Builds an optimised Unsplash delivery URL (WebP, cropped, quality-tuned). */
const u = (id: string, w: number, h: number, q = 74) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&fm=webp&w=${w}&h=${h}&q=${q}`

export const siteImages = {
  // ---------------------------------------------------------------- FOUNDER
  // DEMO IMAGE — Replace with Ramsingh Vaghela's actual professional photograph
  // before production. Stock model, not the founder.
  founderPortrait: u('1778692258270-bc0e80e975c0', 1000, 1300),
  // DEMO IMAGE — Replace with Ramsingh Vaghela's actual photograph.
  founderStory: u('1771244688590-1e481dba1b5a', 900, 1150),
  founderStoryDetail: u('1630487656049-6db93a53a7e9', 700, 500),

  // ---------------------------------------------------------------- JOURNEY
  journey2008: u('1434030216411-0b793f4b4173', 900, 1100),
  journey2012: u('1611974789855-9c2a0a7236a3', 900, 1100),
  journey2016: u('1551135049-8a33b5883817', 900, 1100),
  journey2020: u('1497366216548-37526070297c', 900, 1100),
  journey2023: u('1706074793638-da28b90ea8ae', 900, 1100),
  journey2026: u('1643756173714-5b492591768c', 900, 1100),

  // ------------------------------------------------------- HERO BACKDROPS
  // Market-screen photography, used heavily darkened behind the hero copy.
  heroBackdrop: u('1649003515353-c58a239cf662', 1900, 1200, 62), // candlesticks + index symbols
  heroBackdropAlt: u('1643962578277-0e7e2f7b7c63', 1900, 1200, 62), // glowing chart lines on black
  heroPriceLadder: u('1640458240527-6f27eabe8368', 1600, 1000, 60), // price ladder on black
  tickerBoard: u('1648275913341-7973ae7bc9b3', 1600, 1000, 60), // LED ticker board

  // ----------------------------------------------------------------- VISION
  visionBackdrop: u('1574565087163-11e46ca637a6', 1800, 1100, 60), // Mumbai high-rises, night
  visionBackdropWide: u('1645202324256-b3125d382f26', 1800, 1100, 60),

  // ------------------------------------------------------ SECTION TEXTURES
  philosophyBackdrop: u('1707730376818-a7a02fe896d5', 1800, 1100, 60), // abstract dark curves
  contactBackdrop: u('1639572682072-31c862b37cc8', 1800, 1100, 60), // Mumbai light trails
  architectureMono: u('1510507024924-fc3847d49ae2', 1400, 900, 60), // b&w low-angle towers
  momentSkylineNight: u('1715678907084-6245f67e8124', 800, 1000), // Mumbai aerial, night

  // --------------------------------------------------------------- RESEARCH
  researchFeatured: u('1707762890671-52ef6d6f51e7', 1200, 800),
  researchOutlook: u('1560221328-12fe60f83ab8', 800, 600),
  researchEquity: u('1691643158804-d3f02eb456a3', 800, 600),
  researchSector: u('1573164574572-cb89e39749b4', 800, 600),
  researchPsychology: u('1640451859877-1374a1155215', 800, 600),
  researchRisk: u('1711097383282-28097ae16b1d', 800, 600),

  // --------------------------------------------------------------- INSIGHTS
  insightMarketStructure: u('1517048676732-d65bc937f952', 800, 560),
  insightCompounding: u('1450101499163-c8848c66ca85', 800, 560),
  insightVolatility: u('1689732888407-310424e3a372', 800, 560),
  insightWorkshop: u('1540575467063-178a50c2df87', 800, 560),
  insightPodcast: u('1559523161-0fc0d8b38a7a', 800, 560),
  insightFundamentals: u('1553877522-43269d4ea984', 800, 560),
  insightPositionSizing: u('1551288049-bebda4e38f71', 800, 560),
  insightBehaviour: u('1524178232363-1fb2b075b655', 800, 560),

  // ------------------------------------------------------------------ VIDEO
  videoFeatured: u('1544531586-fde5298cdd40', 1400, 900, 68),
  videoClipOne: u('1559523161-0fc0d8b38a7a', 600, 400),
  videoClipTwo: u('1587825140708-dfaf72ae4b04', 600, 400),
  videoClipThree: u('1523580494863-6f3031224c94', 600, 400),

  // ---------------------------------------------------------------- MOMENTS
  momentKeynote: u('1594122230689-45899d9e6f69', 800, 1000),
  momentPanel: u('1573167507387-6b4b98cb7c13', 800, 600),
  momentWorkshop: u('1557804506-669a67965ba0', 800, 620),
  momentDesk: u('1707761918029-1295034aa31e', 800, 1000),
  momentBoardroom: u('1706074793638-da28b90ea8ae', 800, 600),
  momentCity: u('1653299311171-31939b3b84b0', 800, 1000),
  momentStudio: u('1581547848545-a75a2634ba23', 800, 620),
  momentTeam: u('1541746972996-4e0b0f43e02a', 800, 600),
  momentSkyline: u('1623668864555-4bb967176e6c', 800, 620),
} as const

export type SiteImageKey = keyof typeof siteImages
