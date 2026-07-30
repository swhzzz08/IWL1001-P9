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

function cloneLots(lots: Lot[]) {
  return lots.map((lot) => ({ ...lot }))
}

/* FIFO */

export function calculateFIFO(transactions: Trade[]): AccountingResult {
  const lots: Lot[] = []
  let realisedGain = 0

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime()
  )

  for (const trade of sorted) {
    if (trade.transactionType === "BUY") {
      lots.push({
        quantity: trade.quantity,
        price: trade.price,
      })
    } else {
      let remaining = trade.quantity

      while (remaining > 0 && lots.length > 0) {
        const lot = lots[0]

        const sold = Math.min(remaining, lot.quantity)

        realisedGain += (trade.price - lot.price) * sold

        lot.quantity -= sold
        remaining -= sold

        if (lot.quantity <= 0) {
          lots.shift()
        }
      }
    }
  }

  const remainingShares = lots.reduce((s, l) => s + l.quantity, 0)

  const remainingCost = lots.reduce(
    (s, l) => s + l.quantity * l.price,
    0
  )

  return {
    realisedGain,
    remainingShares,
    remainingCost,
    averageCost:
      remainingShares === 0
        ? 0
        : remainingCost / remainingShares,
  }
}

/* LIFO */

export function calculateLIFO(transactions: Trade[]): AccountingResult {
  const lots: Lot[] = []

  let realisedGain = 0

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime()
  )

  for (const trade of sorted) {
    if (trade.transactionType === "BUY") {
      lots.push({
        quantity: trade.quantity,
        price: trade.price,
      })
    } else {
      let remaining = trade.quantity

      while (remaining > 0 && lots.length > 0) {
        const lot = lots[lots.length - 1]

        const sold = Math.min(remaining, lot.quantity)

        realisedGain += (trade.price - lot.price) * sold

        lot.quantity -= sold
        remaining -= sold

        if (lot.quantity <= 0) {
          lots.pop()
        }
      }
    }
  }

  const remainingShares = lots.reduce((s, l) => s + l.quantity, 0)

  const remainingCost = lots.reduce(
    (s, l) => s + l.quantity * l.price,
    0
  )

  return {
    realisedGain,
    remainingShares,
    remainingCost,
    averageCost:
      remainingShares === 0
        ? 0
        : remainingCost / remainingShares,
  }
}

/* Average Cost */

export function calculateAverageCost(
  transactions: Trade[]
): AccountingResult {
  let shares = 0

  let totalCost = 0

  let realisedGain = 0

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime()
  )

  for (const trade of sorted) {
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
    averageCost:
      shares === 0
        ? 0
        : totalCost / shares,
  }
}

/* Unrealised Gain */

export function calculateUnrealisedGain(
  result: AccountingResult,
  currentPrice: number
) {
  return (
    currentPrice * result.remainingShares -
    result.remainingCost
  )
}

/* Scenario Explorer */

export function simulateScenario(
  result: AccountingResult,
  futurePrice: number
) {
  const portfolioValue =
    futurePrice * result.remainingShares

  const unrealisedGain =
    portfolioValue - result.remainingCost

  return {
    futurePrice,
    portfolioValue,
    unrealisedGain,
  }
}