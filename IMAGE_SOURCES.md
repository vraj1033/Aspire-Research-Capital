# Demo Image Sources & Attribution

Every photograph on this site is a **temporary visual placeholder** for the
client demo. All images are delivered from [Unsplash](https://unsplash.com) and
used under the [Unsplash License](https://unsplash.com/license) (free for
commercial and non-commercial use, no permission needed, attribution
appreciated but not required).

## ⚠️ Important

The person appearing in the hero portrait and founder story section is a
**stock model, not Ramsingh Vaghela**. These images exist only so the demo
reads as a finished product. They must be replaced with the client's own
photography before the site goes live.

## Replacing images

All image references live in a single file: [`src/data/images.ts`](src/data/images.ts).

1. Place production photography in `public/images/`.
2. Change the value in `siteImages` — nothing else:

```ts
founderPortrait: "/images/founder.jpg",
```

Crops, aspect ratios and art direction are handled in CSS, so swapping a file
never breaks a layout.

## Image manifest

| Key | Unsplash photo ID | Used in | Intended replacement |
| --- | --- | --- | --- |
| `founderPortrait` | `1778692258270-bc0e80e975c0` | Hero | Founder portrait, vertical, dark background |
| `founderStory` | `1771244688590-1e481dba1b5a` | Founder introduction | Founder at work, vertical |
| `founderStoryDetail` | `1630487656049-6db93a53a7e9` | Founder introduction (inset) | Research/discussion candid |
| `journey2008` | `1434030216411-0b793f4b4173` | Journey — 2008 | Early career |
| `journey2012` | `1611974789855-9c2a0a7236a3` | Journey — 2012 | Market study |
| `journey2016` | `1551135049-8a33b5883817` | Journey — 2016 | Advisory work |
| `journey2020` | `1497366216548-37526070297c` | Journey — 2020 | Transition/vision |
| `journey2023` | `1706074793638-da28b90ea8ae` | Journey — 2023 | ARC office |
| `journey2026` | `1643756173714-5b492591768c` | Journey — 2026 | Forward-looking |
| `heroBackdrop` | `1649003515353-c58a239cf662` | Hero (primary backdrop) | Dark market-screen photograph — graded to near-monochrome navy in CSS |
| `heroBackdropAlt` | `1643962578277-0e7e2f7b7c63` | Hero (cross-fade layer) | Glowing chart lines on black |
| `heroPriceLadder` | `1640458240527-6f27eabe8368` | Reserved | Price ladder on black |
| `tickerBoard` | `1648275913341-7973ae7bc9b3` | Video section (faint band) | LED ticker board |
| `visionBackdrop` | `1574565087163-11e46ca637a6` | Aspire Research Capital | Mumbai high-rises at night |
| `visionBackdropWide` | `1645202324256-b3125d382f26` | Reserved | City at night from a high floor |
| `philosophyBackdrop` | `1707730376818-a7a02fe896d5` | Market Philosophy | Abstract dark curves (luminosity blend) |
| `contactBackdrop` | `1639572682072-31c862b37cc8` | Connect | Mumbai light trails |
| `architectureMono` | `1510507024924-fc3847d49ae2` | Reserved | Black-and-white low-angle towers |
| `momentSkylineNight` | `1715678907084-6245f67e8124` | Reserved | Mumbai aerial at night |
| `researchFeatured` | `1707762890671-52ef6d6f51e7` | Featured research | Research desk |
| `researchOutlook` | `1560221328-12fe60f83ab8` | Research card | — |
| `researchEquity` | `1691643158804-d3f02eb456a3` | Research card | — |
| `researchSector` | `1573164574572-cb89e39749b4` | Research card | — |
| `researchPsychology` | `1640451859877-1374a1155215` | Research card | — |
| `researchRisk` | `1711097383282-28097ae16b1d` | Research card | — |
| `insight*` | various | Insights grid | Article thumbnails |
| `videoFeatured` | `1544531586-fde5298cdd40` | Video section | Keynote still |
| `videoClip*` | various | Video section | Episode stills |
| `moment*` | various | Beyond the Charts gallery | Client event photography |

## Delivery

Images are requested through Unsplash's imgix pipeline with `fm=webp`,
`auto=format`, explicit `w`/`h` crops and tuned quality, so the browser
receives correctly sized modern-format files. Everything below the fold uses
`loading="lazy"` and `decoding="async"`, and every `<img>` carries explicit
`width`/`height` to prevent layout shift.

When production images land locally, keep the same discipline: export WebP or
AVIF at roughly 2× the largest rendered size.
