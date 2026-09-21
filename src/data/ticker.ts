/* =============================================================================
 * TICKER TAPE — DEMO DATA
 * =============================================================================
 *
 * ⚠️  Every value, change and direction below is an ILLUSTRATIVE PLACEHOLDER.
 * Nothing is fetched, nothing is live, and none of these numbers should be
 * read as a quote. The strip that renders them carries a permanent
 * "ILLUSTRATIVE · NOT LIVE DATA" label for exactly this reason. Replace with a
 * real feed (and drop the label) only after compliance review.
 * ========================================================================== */

export type TickerDirection = 'up' | 'down'

export type TickerItem = {
  symbol: string
  /** Pre-formatted display string; rendered with tabular figures. */
  value: string
  /** Signed percentage exactly as displayed. */
  change: string
  direction: TickerDirection
}

export const tickerItems: TickerItem[] = [
  { symbol: 'NIFTY 50', value: '24,812.40', change: '+0.62%', direction: 'up' }, // DEMO
  { symbol: 'SENSEX', value: '81,406.15', change: '+0.54%', direction: 'up' }, // DEMO
  { symbol: 'BANK NIFTY', value: '52,118.70', change: '-0.21%', direction: 'down' }, // DEMO
  { symbol: 'NIFTY IT', value: '38,940.25', change: '+1.08%', direction: 'up' }, // DEMO
  { symbol: 'NIFTY MIDCAP 100', value: '57,203.90', change: '-0.34%', direction: 'down' }, // DEMO
  { symbol: 'INDIA VIX', value: '13.42', change: '-2.15%', direction: 'down' }, // DEMO
  { symbol: 'USD/INR', value: '83.62', change: '+0.07%', direction: 'up' }, // DEMO
  { symbol: 'GOLD', value: '72,480', change: '+0.41%', direction: 'up' }, // DEMO
  { symbol: 'BRENT', value: '78.14', change: '-0.88%', direction: 'down' }, // DEMO
]

/** Mandatory label — the strip must never read as a live feed. */
export const tickerDisclaimer = 'Illustrative · Not live data'
export const tickerDisclaimerShort = 'Not live data'
