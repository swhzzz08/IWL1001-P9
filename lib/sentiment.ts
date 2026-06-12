// Simple lexicon-based sentiment analysis for financial news
// No external library needed - works client and server side

const POSITIVE_WORDS = new Set([
  'surge', 'surges', 'surging', 'soar', 'soars', 'soaring', 'rally', 'rallies', 'rallying',
  'gain', 'gains', 'gaining', 'rise', 'rises', 'rising', 'rose', 'jump', 'jumps', 'jumped',
  'beat', 'beats', 'record', 'high', 'growth', 'grow', 'grows', 'profit', 'profits',
  'strong', 'stronger', 'strongest', 'exceed', 'exceeds', 'exceeded', 'outperform',
  'upgrade', 'upgrades', 'upgraded', 'buy', 'bullish', 'positive', 'optimistic',
  'opportunity', 'opportunities', 'innovation', 'breakthrough', 'success', 'successful',
  'revenue', 'earnings', 'dividend', 'dividends', 'acquisition', 'partnership',
  'expand', 'expands', 'expansion', 'launch', 'launches', 'launched', 'approve', 'approved',
  'recover', 'recovery', 'recovers', 'rebound', 'rebounds', 'stabilize', 'stabilizes',
  'confidence', 'optimism', 'momentum', 'boost', 'boosts', 'boosted',
])

const NEGATIVE_WORDS = new Set([
  'fall', 'falls', 'falling', 'fell', 'drop', 'drops', 'dropping', 'dropped',
  'decline', 'declines', 'declining', 'declined', 'plunge', 'plunges', 'plunging',
  'crash', 'crashes', 'crashing', 'loss', 'losses', 'lose', 'losing', 'lost',
  'miss', 'misses', 'missed', 'weak', 'weaker', 'weakest', 'disappoint', 'disappoints',
  'sell', 'bearish', 'negative', 'concern', 'concerns', 'risk', 'risks', 'risky',
  'lawsuit', 'investigation', 'probe', 'fine', 'penalty', 'penalties', 'fraud',
  'cut', 'cuts', 'cutting', 'layoff', 'layoffs', 'fired', 'bankrupt', 'bankruptcy',
  'downgrade', 'downgrades', 'downgraded', 'warning', 'warns', 'warned',
  'volatile', 'volatility', 'uncertainty', 'uncertain', 'recession', 'inflation',
  'deficit', 'debt', 'shortage', 'delay', 'delays', 'delayed', 'cancel', 'cancelled',
  'crisis', 'collapse', 'collapses', 'collapsing', 'slump', 'slumps',
])

const NEGATORS = new Set(['not', 'no', "n't", 'never', 'neither', 'nor', 'barely', 'hardly'])

export function analyzeSentiment(text: string): { score: number; label: 'positive' | 'neutral' | 'negative' } {
  const words = text.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/)
  let score = 0
  let count = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const prevWord = i > 0 ? words[i - 1] : ''
    const negated = NEGATORS.has(prevWord)

    if (POSITIVE_WORDS.has(word)) {
      score += negated ? -0.6 : 1
      count++
    } else if (NEGATIVE_WORDS.has(word)) {
      score += negated ? 0.6 : -1
      count++
    }
  }

  if (count === 0) return { score: 0, label: 'neutral' }

  const normalized = Math.max(-1, Math.min(1, score / Math.max(count, 3)))

  return {
    score: normalized,
    label: normalized > 0.1 ? 'positive' : normalized < -0.1 ? 'negative' : 'neutral',
  }
}

export function aggregateSentiment(scores: number[]): { score: number; label: 'Positive' | 'Neutral' | 'Negative' } {
  if (scores.length === 0) return { score: 0, label: 'Neutral' }
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return {
    score: avg,
    label: avg > 0.1 ? 'Positive' : avg < -0.1 ? 'Negative' : 'Neutral',
  }
}