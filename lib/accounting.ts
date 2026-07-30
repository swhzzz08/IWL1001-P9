export type AccountingMethod = 'FIFO' | 'LIFO' | 'AVERAGE'

export type Trade = {
  tickerSymbol: string
  transactionType: "BUY" | "SELL"
  quantity: number
  price: number
  transactionDate: string | Date
}

type Lot = {
  quantity: number
  price: number
}

export type AccountingResult = {
  realisedGain: number
  remainingShares: number
  remainingCost: number
  averageCost: number
}

function sortedByDate(transactions: Trade[]): Trade[] {
  return [...transactions].sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime()
  )
}

function buildResult(lots: Lot[], realisedGain: number): AccountingResult {
  const remainingShares = lots.reduce((s, l) => s + l.quantity, 0)
  const remainingCost = lots.reduce((s, l) => s + l.quantity * l.price, 0)
  return {
    realisedGain,
    remainingShares,
    remainingCost,
    averageCost: remainingShares === 0 ? 0 : remainingCost / remainingShares,
  }
}

function calculateLotMethod(
  transactions: Trade[],
  nextLot: (lots: Lot[]) => Lot,
  removeLot: (lots: Lot[]) => void
): AccountingResult {
  const lots: Lot[] = []
  let realisedGain = 0

  for (const trade of sortedByDate(transactions)) {
    if (trade.transactionType === "BUY") {
      lots.push({ quantity: trade.quantity, price: trade.price })
    } else {
      let remaining = trade.quantity
      while (remaining > 0 && lots.length > 0) {
        const lot = nextLot(lots)
        const sold = Math.min(remaining, lot.quantity)
        realisedGain += (trade.price - lot.price) * sold
        lot.quantity -= sold
        remaining -= sold
        if (lot.quantity <= 0) removeLot(lots)
      }
    }
  }

  return buildResult(lots, realisedGain)
}

export function calculateFIFO(transactions: Trade[]): AccountingResult {
  return calculateLotMethod(
    transactions,
    (lots) => lots[0],
    (lots) => { lots.shift() }
  )
}

export function calculateLIFO(transactions: Trade[]): AccountingResult {
  return calculateLotMethod(
    transactions,
    (lots) => lots[lots.length - 1],
    (lots) => { lots.pop() }
  )
}

export function calculateAverageCost(
  transactions: Trade[]
): AccountingResult {
  let shares = 0
  let totalCost = 0
  let realisedGain = 0

  for (const trade of sortedByDate(transactions)) {
    if (trade.transactionType === "BUY") {
      shares += trade.quantity
      totalCost += trade.quantity * trade.price
    } else {
      if (shares <= 0) continue
      const avg = totalCost / shares
      realisedGain += (trade.price - avg) * trade.quantity
      shares -= trade.quantity
      totalCost -= avg * trade.quantity
    }
  }

  return {
    realisedGain,
    remainingShares: shares,
    remainingCost: totalCost,
    averageCost: shares === 0 ? 0 : totalCost / shares,
  }
}

export function calculateByMethod(
  method: AccountingMethod,
  trades: Trade[]
): AccountingResult {
  if (method === 'FIFO') return calculateFIFO(trades)
  if (method === 'LIFO') return calculateLIFO(trades)
  return calculateAverageCost(trades)
}

export function calculateUnrealisedGain(
  result: AccountingResult,
  currentPrice: number
) {
  return (
    currentPrice * result.remainingShares -
    result.remainingCost
  )
}

export function simulateScenario(
  result: AccountingResult,
  futurePrice: number
) {
  const portfolioValue = futurePrice * result.remainingShares
  const unrealisedGain = portfolioValue - result.remainingCost
  return { futurePrice, portfolioValue, unrealisedGain }
}
