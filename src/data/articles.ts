/* =============================================================================
 * READER CONTENT — bodies for the research reports and insights
 * =============================================================================
 *
 * ⚠️  DEMO CONTENT. Every paragraph below is placeholder writing produced for
 * the client demonstration so the reading panel has something to show. None
 * of it is published research, none of it is a view held by any real person,
 * and none of it is investment advice. Replace with the client's own work.
 *
 * Entries are keyed by article title (see src/data/site.ts). An article with no
 * entry falls back to `genericBody`, so the reader never opens empty.
 * ========================================================================== */

import type { MediaItem } from './site'

export type ReaderEntry = {
  body: string[]
  takeaways: string[]
}

/** Placeholder page for a media appearance (podcast, keynote, column…). DEMO. */
export const appearanceEntry = (item: MediaItem): ReaderEntry => ({
  body: [
    `${item.outlet} — ${item.type.toLowerCase()}, ${item.year}. In the finished site this page carries the recording or the published piece, the host’s introduction and the questions that framed the conversation.`,
    'The thread through every appearance is the same one that runs through the research: evidence before narrative, research before reaction, and position size that follows what is actually known rather than what is hoped.',
  ],
  takeaways: [
    'Demo placeholder for a real appearance page — link the recording or article here.',
    'Each appearance keeps its own shareable link once content is in place.',
    'Outlet logos are wordmarks until usage rights are confirmed.',
  ],
})

export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const genericBody: ReaderEntry = {
  body: [
    'This is a demonstration article. In the finished site each report opens here with its full text, charts and sources, formatted for reading rather than skimming.',
    'The reading panel keeps the page underneath it, so a reader can move between reports without losing their place, and every report has its own shareable link.',
  ],
  takeaways: [
    'Reports open in place — no page load, no lost scroll position.',
    'Each report carries a link that opens it directly.',
    'Content shown here is placeholder text for the demo.',
  ],
}

export const readerContent: Record<string, ReaderEntry> = {
  /* ------------------------------------------------------------ RESEARCH */

  'The Quiet Repricing: What Changed Beneath a Flat Index': {
    body: [
      'A flat quarter is rarely a quiet one. The index closed within a few points of where it opened, and the temptation is to read that as a market waiting. Underneath, leadership rotated twice, the number of stocks above their own 200-day average fell by a third, and the dispersion between the best and worst sectors was the widest in two years.',
      'That combination — a steady headline and a narrowing base — is what a repricing looks like while it is still happening. Capital was not leaving the market; it was leaving the middle of it, moving from businesses priced for growth they had not yet delivered towards businesses whose cash flows had already arrived.',
      'The useful question is not whether the index will move next quarter but whether the businesses now carrying it can hold the weight. The report walks through the breadth data, the sector rotation and the earnings revisions that sit behind the flat line, and sets out what would need to change for the base to widen again.',
    ],
    takeaways: [
      'A flat index concealed a full rotation in leadership and a sharp fall in breadth.',
      'Capital moved from promised growth to delivered cash flow, not out of the market.',
      'Watch the number of stocks above their 200-day average before the index level itself.',
    ],
  },

  'Margin Durability in a Slower Demand Cycle': {
    body: [
      'When demand slows, every company reports on margins and most of them report well. The difference between a business that protected its margin and one that postponed its costs only shows up two or three quarters later, which is exactly when investors have stopped looking.',
      'The report separates the two by reading the cash flow statement against the income statement. Pricing power shows up as stable gross margin with stable receivable days. Deferred cost shows up as improving operating margin alongside rising working capital, lower maintenance capex and a growing gap between reported and cash earnings.',
      'Across the coverage set, roughly a third of the businesses that reported margin expansion did so on the second pattern. That is not an accusation — it is a normal response to a slow cycle — but it does mean the expansion is borrowed rather than earned, and borrowed margin comes due.',
    ],
    takeaways: [
      'Read margin against working capital and capex, never on its own.',
      'Pricing power and deferred cost look identical on the income statement for a while.',
      'Borrowed margin tends to reverse within two to three quarters.',
    ],
  },

  'Financials: Reading the Credit Cycle Early': {
    body: [
      'Asset quality rarely deteriorates suddenly. The reported number moves late, because it can only recognise what has already failed. The signals that lead it are quieter: restructured exposure ticking up, provision coverage drifting down while growth accelerates, and the share of new lending going to segments the lender entered recently.',
      'The report tracks those three signals across the listed lenders and finds them moving together in the fastest-growing part of the book. None of it is alarming on its own. Together, it is the shape that preceded the last two credit cycles by roughly four to six quarters.',
      'The practical conclusion is about position, not prediction: this is the point in the cycle where the difference between lenders becomes worth paying for, and where the cheapest name in the sector is cheap for a reason.',
    ],
    takeaways: [
      'Reported asset quality is a lagging number; watch restructuring and coverage first.',
      'Fast growth in new segments with falling coverage is the pattern that precedes trouble.',
      'Late in the cycle, the premium for underwriting quality is worth paying.',
    ],
  },

  'Why Conviction Peaks at the Wrong Moment': {
    body: [
      'Confidence in an investment idea tends to be highest just after everyone else has arrived at it. That is not a character flaw; it is how evidence works. The more people who hold a view, the more supporting evidence circulates, and the more obviously correct the view appears — right up to the point where the last buyer has bought.',
      'The report looks at conviction from the outside, through positioning data and commentary volume, and from the inside, through the way a thesis gets described over time. A thesis that started as "the market is missing this" and has become "everyone knows this" has not become safer; it has become crowded.',
      'The framework offered is deliberately simple: write down, at the time of the decision, what would make you wrong. If nothing on that list has happened but your conviction has grown anyway, the growth came from the crowd, not from the evidence.',
    ],
    takeaways: [
      'Conviction rises with consensus, and consensus is what makes a position crowded.',
      'Track how you describe a thesis — "the market is missing this" and "everyone knows this" are different risks.',
      'Write the disconfirming evidence down before you need it.',
    ],
  },

  'Position Sizing as a Statement of Uncertainty': {
    body: [
      'Most investors size positions by how much they want to make. The report argues for sizing them by how much you know, which produces smaller positions in exciting ideas and larger ones in boring ones — and, over a cycle, a portfolio that survives its own mistakes.',
      'The mechanism is simple. A position size is a claim about the odds. A ten-percent position says the thesis is more likely to be right than a three-percent one. If the evidence behind both is the same, the difference in size is not conviction; it is appetite.',
      'The practical rule is to let size follow evidence in both directions: add as the thesis is confirmed by things you did not control, and reduce when the reasons you bought are no longer the reasons you hold.',
    ],
    takeaways: [
      'A position size is a probability statement — make it an honest one.',
      'Size follows evidence, not enthusiasm, in both directions.',
      'Reducing a position is a decision, not an admission.',
    ],
  },

  'Liquidity, Flows and the Illusion of Momentum': {
    body: [
      'When participation narrows, trend strength and trend quality stop meaning the same thing. A handful of large names can carry an index higher on their own, and the resulting chart looks like momentum. It is momentum in the price; it is not momentum in the market.',
      'The report separates the two using breadth, volume concentration and the behaviour of the equal-weight index against the cap-weight one. Where they diverge, the trend is being financed by fewer and fewer participants, and the question becomes who is left to buy.',
      'This is not an argument against following trends. It is an argument for knowing which kind of trend you are following, because they end differently: broad trends fade, narrow ones break.',
    ],
    takeaways: [
      'Price momentum and market momentum diverge when participation narrows.',
      'Compare the equal-weight index to the cap-weight one before trusting a trend.',
      'Narrow trends do not fade; they break.',
    ],
  },

  /* ------------------------------------------------------------ INSIGHTS */

  'Breadth Is Narrowing Again — Here Is Why It Matters': {
    body: [
      'Fewer stocks are carrying the index this month than last, and fewer last month than the one before. The level has barely moved, which is why nobody is talking about it — but the risk in the index has changed even though its price has not.',
      'Narrow breadth means your index exposure is really exposure to a few names. If those names stumble, there is no depth beneath them. The note sets out the current reading, how it compares to previous episodes and what tends to follow.',
    ],
    takeaways: [
      'The index level and the index risk are different things.',
      'Narrow breadth concentrates exposure without changing the ticker.',
      'Previous episodes resolved with either a broadening or a break — rarely a drift.',
    ],
  },

  'Compounding Is Boring by Design': {
    body: [
      'The part of investing that works best is the part that gives you the least to do. Compounding asks for very little except that you leave it alone, and that is exactly what most people find impossible.',
      'The note is a short argument for boredom as a discipline: why activity feels like progress, why it usually is not, and how to build a process that makes doing nothing the default rather than the exception.',
    ],
    takeaways: [
      'Activity is not the same as progress; often it is the opposite.',
      'Compounding rewards the investor who can tolerate being uninteresting.',
      'Make inaction the default and action the thing that needs a reason.',
    ],
  },

  'Reading Volatility as Information, Not Noise': {
    body: [
      'Volatility is usually described as noise, something to be endured on the way to a return. It is better understood as information: a measure of how confidently the market holds its own view, updated every day.',
      'When volatility rises without new facts, the market is telling you that its previous confidence was not well founded. When it falls while facts are changing, it is telling you something else. The note works through both cases with recent examples.',
    ],
    takeaways: [
      'Volatility measures the market’s confidence in its own view.',
      'Rising volatility without new facts means the old confidence was misplaced.',
      'Treat it as a signal to re-examine, not a cost to endure.',
    ],
  },

  'A Beginner Framework for Evaluating Any Business': {
    body: [
      'Six questions that work whether you are looking at a bank, a manufacturer or a software company: what does it sell, who pays for it, why do they keep paying, what does it cost to deliver, what would make them stop, and what does the business do with the cash?',
      'The note walks through each question with a worked example and shows how the answers connect. Most bad investments fail on a question that was never asked, not on one that was answered wrongly.',
    ],
    takeaways: [
      'Six questions, in order, before any valuation work.',
      'Most failures come from questions never asked.',
      'The last question — what happens to the cash — decides the rest.',
    ],
  },

  'Understanding Market Cycles — Full Conversation': {
    body: [
      'A long-form conversation on how cycles repeat in structure even when they never repeat in detail: how optimism builds, how leadership rotates and how quickly conviction becomes crowding.',
      'The discussion covers what to watch while you are still inside a cycle, why the end of one is only obvious afterwards, and how a research process can be built to survive the parts of the cycle that punish confidence.',
    ],
    takeaways: [
      'Cycles rhyme in structure, not in detail.',
      'The transition from conviction to crowding is the part worth watching.',
      'Build the process for the phase that punishes confidence.',
    ],
  },

  'What the Cash Flow Statement Says First': {
    body: [
      'Earnings are an opinion in a way that cash is not. The income statement records what management believes happened; the cash flow statement records what the bank saw. When they disagree for long enough, the bank is usually right.',
      'The note shows where to look before the headline number — operating cash against reported profit, working capital against revenue growth, and capex against depreciation — and what each gap tends to mean.',
    ],
    takeaways: [
      'Cash is a fact; earnings are an interpretation.',
      'Three gaps to check: cash vs profit, working capital vs growth, capex vs depreciation.',
      'Persistent disagreement between the two statements resolves in cash’s favour.',
    ],
  },

  'Sizing Down Is Also a Decision': {
    body: [
      'Reducing exposure gets read as indecision, as if the only real choices were all-in or all-out. More often, sizing down is the most informed thing in the portfolio: it says the thesis still holds but the odds have moved.',
      'The note argues for treating a reduction with the same seriousness as a purchase — a written reason, a written trigger for adding back — so that it is a decision with a record rather than a flinch.',
    ],
    takeaways: [
      'A reduction is a decision about odds, not a loss of nerve.',
      'Write the reason and the re-entry trigger down, as you would for a purchase.',
      'The portfolio that survives is the one that can change size without changing its mind.',
    ],
  },

  'Investor Behaviour Workshop — Session Highlights': {
    body: [
      'Selected moments from a live session on the decisions investors regret most — and why they keep making them. The pattern is consistent: the regretted decisions were almost never analytical mistakes; they were behavioural ones made under time pressure.',
      'The highlights cover the three most common — selling a winner to feel safe, holding a loser to avoid admitting the loss, and buying late because everyone else already had — and the simple rules participants built to counter each.',
    ],
    takeaways: [
      'Regretted decisions are usually behavioural, not analytical.',
      'Three patterns account for most of the damage.',
      'A written rule beats a good intention every time.',
    ],
  },
}
