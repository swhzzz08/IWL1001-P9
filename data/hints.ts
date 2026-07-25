

export interface Hint {
    id: string
    title: string
    body: string
    category: 'Reading Charts' | 'Risk Management' | 'Entry & Exit' | 'Psychology' | 'Indicators'
}

export const hints: Hint[] = [
    {
        id: 'candlestick-basics',
        title: 'Reading Candlesticks',
        body: 'Each candle shows open, high, low and close. A green candle means the close was higher than the open. A red candle means the close was lower. The wicks show the full price range for that period.',
        category: 'Reading Charts',
    },
    {
        id: 'support-resistance',
        title: 'Support & Resistance',
        body: 'Support is a price level where buying tends to overpower selling, causing price to bounce up. Resistance is where selling overpowers buying. Watch for price to test these levels repeatedly before breaking through.',
        category: 'Reading Charts',
    },
    {
        id: 'trend-lines',
        title: 'Drawing Trend Lines',
        body: 'Connect at least two higher lows to form an uptrend line. Connect two lower highs to form a downtrend line. A valid trend line touches at least three points. Break of a trend line is an early signal of reversal.',
        category: 'Reading Charts',
    },
    {
        id: 'volume-confirmation',
        title: 'Volume Confirms Moves',
        body: 'A price breakout on high volume is more reliable than one on low volume. If price breaks resistance but volume is weak, the move may fail. Always check volume when evaluating breakouts.',
        category: 'Reading Charts',
    },
    {
        id: 'moving-average-cross',
        title: 'Moving Average Crossovers',
        body: 'When a shorter MA (e.g. 50-day) crosses above a longer MA (e.g. 200-day), it is called a Golden Cross — a bullish signal. The opposite (Death Cross) is bearish. These are lagging indicators, best used to confirm trends.',
        category: 'Indicators',
    },
    {
        id: 'rsi-overbought',
        title: 'RSI Overbought/Oversold',
        body: 'RSI above 70 suggests a stock.ts may be overbought (due for a pullback). RSI below 30 suggests it may be oversold (potential bounce). In a strong trend, RSI can stay overbought or oversold for extended periods.',
        category: 'Indicators',
    },
    {
        id: 'macd-basics',
        title: 'Understanding MACD',
        body: 'MACD measures momentum by subtracting the 26-period EMA from the 12-period EMA. When the MACD line crosses above the signal line, it is a buy signal. Below is a sell signal. The histogram shows the difference between the two lines.',
        category: 'Indicators',
    },
    {
        id: 'bollinger-bands',
        title: 'Bollinger Bands',
        body: 'Bollinger Bands are two standard deviations above and below a 20-period moving average. When price touches the upper band in an uptrend, it shows strength. When bands narrow (squeeze), a large move is often imminent.',
        category: 'Indicators',
    },
    {
        id: 'risk-per-trade',
        title: 'Risk Per Trade',
        body: 'Most professional traders risk no more than 1-2% of their total portfolio on any single trade. If your account is $10,000 and you risk 1%, your maximum loss per trade is $100. Consistent position sizing protects you from catastrophic drawdowns.',
        category: 'Risk Management',
    },
    {
        id: 'stop-loss',
        title: 'Always Use a Stop Loss',
        body: 'A stop loss is a predefined price where you exit a losing trade. Place it below a recent swing low for long trades, or above a swing high for shorts. Never move a stop loss in the direction of the loss — it defeats its purpose.',
        category: 'Risk Management',
    },
    {
        id: 'risk-reward',
        title: 'Risk/Reward Ratio',
        body: 'Before entering a trade, calculate your risk (entry minus stop) vs. your reward (entry to target). Aim for at least a 1:2 risk/reward. This means even if you are right only 40% of the time, you can still be profitable.',
        category: 'Risk Management',
    },
    {
        id: 'diversification',
        title: 'Diversification',
        body: 'Spreading investments across different sectors, asset classes and geographies reduces the risk that any single loss destroys your portfolio. However, over-diversification can dilute returns. Most retail investors benefit from 10-20 holdings.',
        category: 'Risk Management',
    },
    {
        id: 'entry-breakout',
        title: 'Breakout Entry',
        body: 'A breakout entry is buying when price moves above a key resistance level with volume confirmation. The old resistance often becomes new support. Wait for the candle to close above resistance before entering to avoid false breakouts.',
        category: 'Entry & Exit',
    },
    {
        id: 'pullback-entry',
        title: 'Pullback Entry',
        body: 'Instead of chasing a breakout, wait for price to pull back to a previous support level (often the breakout point). This gives you a lower-risk entry with a tighter stop and better risk/reward.',
        category: 'Entry & Exit',
    },
    {
        id: 'scaling-out',
        title: 'Scaling Out of Positions',
        body: 'Rather than selling your entire position at once, consider selling in thirds: one-third at the first target, one-third at the second and letting the last third run with a trailing stop. This locks in profit while staying in winning trades.',
        category: 'Entry & Exit',
    },
    {
        id: 'trailing-stop',
        title: 'Trailing Stops',
        body: 'A trailing stop moves up (for long trades) as price rises, locking in profits while leaving room for the trend to continue. Common methods: a fixed dollar amount, a percentage or below a moving average.',
        category: 'Entry & Exit',
    },
    {
        id: 'fomo',
        title: 'Avoid FOMO',
        body: 'Fear of Missing Out drives traders to chase parabolic moves near the top. If a stock.ts has already moved 30-50% and you have no position, the risk/reward is poor. There will always be another opportunity. Wait for a proper setup.',
        category: 'Psychology',
    },
    {
        id: 'trading-journal',
        title: 'Keep a Trading Journal',
        body: 'Record every trade: entry, exit, size, reason and outcome. Reviewing your journal regularly reveals patterns in your mistakes. Most traders improve dramatically simply by tracking what they actually did vs. what they planned.',
        category: 'Psychology',
    },
    {
        id: 'revenge-trading',
        title: 'Avoid Revenge Trading',
        body: 'After a loss, the urge to immediately make it back leads to impulsive trades with poor setups. The best action after a loss is to step away, review what happened and only re-enter when a clean setup appears.',
        category: 'Psychology',
    },
    {
        id: 'plan-the-trade',
        title: 'Plan the Trade, Trade the Plan',
        body: 'Write down your entry, stop loss and target before entering any trade. Once in the trade, do not change the plan based on emotions. If your rules say exit, exit. If they say stay, stay.',
        category: 'Psychology',
    },
    {
        id: 'timeframe-alignment',
        title: 'Timeframe Alignment',
        body: 'The most reliable trades occur when multiple timeframes agree. If the weekly chart shows an uptrend and the daily chart gives a buy signal, the probability is higher than a signal on the daily alone. Start with the higher timeframe.',
        category: 'Reading Charts',
    },
    {
        id: 'pe-ratio',
        title: 'Understanding P/E Ratio',
        body: 'The Price/Earnings ratio compares a stock.ts\'s price to its annual earnings per share. A P/E of 20 means you pay $20 for every $1 of earnings. Compare P/E to industry peers and the stock.ts\'s own historical average — not just the market average.',
        category: 'Indicators',
    },
    {
        id: 'earnings-impact',
        title: 'Earnings Reports',
        body: 'Companies report earnings quarterly. Stock prices often move sharply after earnings — sometimes the opposite of expectations ("buy the rumor, sell the news"). Holding through earnings is speculative. Know the report date before entering a trade.',
        category: 'Entry & Exit',
    },
    {
        id: 'short-selling',
        title: 'Short Selling Basics',
        body: 'Shorting means borrowing shares to sell at today\'s price, hoping to buy them back cheaper later. Risk is theoretically unlimited because price can rise indefinitely. Shorts require a margin account and have additional costs (borrow fee).',
        category: 'Entry & Exit',
    },
    {
        id: 'market-open-volatility',
        title: 'First 30 Minutes Volatility',
        body: 'The first 30 minutes after market open (9:30–10:00 AM ET) are often the most volatile. Many professional traders wait for the initial chaos to settle before entering positions. The opening range can set the tone for the day.',
        category: 'Reading Charts',
    },
]