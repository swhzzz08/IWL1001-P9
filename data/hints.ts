export interface Hint {
    id: string
    title: string
    body: string
    category: 'Reading Charts' | 'Risk Management' | 'Investing Approach' | 'Investor Mindset' | 'Indicators'
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
        body: 'Support is a price level where buying tends to overpower selling, causing price to bounce up. Resistance is where selling overpowers buying. These levels help you understand a stock\'s recent price history, not predict the future with certainty.',
        category: 'Reading Charts',
    },
    {
        id: 'trend-lines',
        title: 'Reading Trend Direction',
        body: 'A stock is in an uptrend when it makes higher highs and higher lows over time, and a downtrend when it makes lower highs and lower lows. Understanding the broader trend gives useful context before you research a company further — it doesn\'t replace understanding the business itself.',
        category: 'Reading Charts',
    },
    {
        id: 'volume-confirmation',
        title: 'Volume Confirms Moves',
        body: 'A price move on high volume (many shares traded) suggests broad participation and conviction. The same move on low volume may not hold. Volume is useful context alongside price, not a signal on its own.',
        category: 'Reading Charts',
    },
    {
        id: 'moving-average-cross',
        title: 'Moving Average Crossovers',
        body: 'When a shorter moving average (e.g. 50-day) crosses above a longer one (e.g. 200-day), it\'s called a Golden Cross — commonly read as a bullish signal. The opposite (Death Cross) is bearish. These are lagging indicators: they confirm a trend that\'s already underway rather than predicting what comes next.',
        category: 'Indicators',
    },
    {
        id: 'rsi-overbought',
        title: 'RSI Overbought/Oversold',
        body: 'RSI above 70 suggests a stock may be overbought (due for a pullback). RSI below 30 suggests it may be oversold (potential bounce). In a strong trend, RSI can stay overbought or oversold for extended periods — treat it as one data point, not a standalone buy/sell trigger.',
        category: 'Indicators',
    },
    {
        id: 'macd-basics',
        title: 'Understanding MACD',
        body: 'MACD measures momentum by subtracting the 26-period EMA from the 12-period EMA. When the MACD line crosses above the signal line, momentum is turning more positive; below, more negative. The histogram shows the size of that gap. Like RSI, it\'s best combined with other context rather than used alone.',
        category: 'Indicators',
    },
    {
        id: 'bollinger-bands',
        title: 'Bollinger Bands',
        body: 'Bollinger Bands are two standard deviations above and below a 20-period moving average, giving a sense of how volatile a stock has recently been. When the bands narrow, volatility has been unusually low recently — it doesn\'t say which direction a future move will go, only that one may be coming.',
        category: 'Indicators',
    },
    {
        id: 'position-sizing',
        title: 'Position Sizing & Concentration Risk',
        body: 'A common guideline is to avoid putting more than roughly 5-10% of your total portfolio into any single stock, so that one company\'s bad quarter can\'t sink your whole portfolio. If your account is $10,000, a 5% position is $500. This is about managing concentration risk, not predicting which stock will do well.',
        category: 'Risk Management',
    },
    {
        id: 'understanding-downside-risk',
        title: 'Understanding Downside Risk Before You Buy',
        body: 'Before buying any stock, it\'s worth asking: "Am I comfortable holding this through a 30% drop?" If the answer is no, the position may be too large, or it may not fit your risk tolerance. Deciding your comfort level in advance is more useful than reacting emotionally once a decline has already started.',
        category: 'Risk Management',
    },
    {
        id: 'risk-reward',
        title: 'Weighing Risk Against Potential Return',
        body: 'Before buying, it helps to weigh the realistic downside (how far could this reasonably fall) against the realistic upside (what would justify the current price, and what could it be worth). This kind of thinking-it-through is useful whether you plan to hold for months or for years.',
        category: 'Risk Management',
    },
    {
        id: 'diversification',
        title: 'Diversification',
        body: 'Spreading investments across different sectors, asset classes and geographies reduces the risk that any single loss destroys your portfolio. However, over-diversification can dilute returns and make a portfolio hard to track. Many long-term investors are well served by a modest number of well-understood holdings, or a broad index fund.',
        category: 'Risk Management',
    },
    {
        id: 'dollar-cost-averaging',
        title: 'Dollar-Cost Averaging',
        body: 'Instead of trying to time the "perfect" moment to buy, dollar-cost averaging means investing a fixed amount at regular intervals (e.g. monthly), regardless of price. This smooths out your average purchase price over time and removes the pressure of guessing short-term market direction.',
        category: 'Investing Approach',
    },
    {
        id: 'buy-and-hold',
        title: 'Buy and Hold Through Volatility',
        body: 'Rather than trying to jump in and out around short-term price swings, many long-term investors research a company once, decide it fits their goals, and hold through ordinary ups and downs — only reconsidering if the underlying business or their own thesis has genuinely changed.',
        category: 'Investing Approach',
    },
    {
        id: 'rebalancing',
        title: 'Periodic Rebalancing',
        body: 'Over time, winning positions can grow to take up a larger share of your portfolio than you originally intended. Periodically rebalancing — trimming positions back to your target allocation — keeps your risk level in line with your original plan, rather than letting it drift as prices move.',
        category: 'Investing Approach',
    },
    {
        id: 'time-in-market',
        title: 'Time in the Market vs. Timing the Market',
        body: 'Trying to predict short-term tops and bottoms is difficult even for professionals, and missing just a handful of the market\'s best days can meaningfully reduce long-term returns. For most long-term investors, staying invested consistently tends to matter more than trying to perfectly time entries and exits.',
        category: 'Investing Approach',
    },
    {
        id: 'low-cost-diversified-funds',
        title: 'Low-Cost, Diversified Funds as a Foundation',
        body: 'Broad index funds and ETFs (like an S&P 500 fund) offer instant diversification across hundreds of companies for a low fee. For many beginners, building a foundation with a low-cost diversified fund — before picking individual stocks — is a lower-risk way to start investing.',
        category: 'Investing Approach',
    },
    {
        id: 'understand-fees',
        title: 'Fees Compound Too',
        body: 'A 1% annual fee sounds small, but compounded over 20-30 years it can meaningfully reduce your ending balance compared to a lower-fee option with similar returns. Always check the expense ratio of any fund, and any trading commissions, before investing.',
        category: 'Investing Approach',
    },
    {
        id: 'fomo',
        title: 'Avoid Chasing Fear of Missing Out',
        body: 'FOMO (Fear of Missing Out) can push investors to buy a stock only because it has already risen sharply, often right before it cools off. If you missed a big move, there will always be another opportunity to research and decide calmly — chasing a stock after a huge run is rarely a well-thought-out decision.',
        category: 'Investor Mindset',
    },
    {
        id: 'investment-journal',
        title: 'Keep an Investment Journal',
        body: 'Write down why you bought each position: what you expected and what would change your mind. Reviewing this later — especially after both wins and losses — helps you learn from your actual decision-making, rather than just from hindsight.',
        category: 'Investor Mindset',
    },
    {
        id: 'avoid-impulsive-reactions',
        title: 'Avoid Impulsive Reactions After a Loss',
        body: 'After a loss, the urge to immediately "make it back" can lead to rushed decisions that weren\'t part of your original plan. It\'s usually more productive to step away, review what actually happened, and only act again once you\'ve thought it through calmly.',
        category: 'Investor Mindset',
    },
    {
        id: 'have-a-plan',
        title: 'Have a Plan and Stick to It',
        body: 'Before investing, write down your reason for buying, your time horizon and what would make you sell. Referring back to this plan during periods of volatility helps you make decisions based on your original reasoning, rather than in-the-moment emotions.',
        category: 'Investor Mindset',
    },
    {
        id: 'emergency-fund-first',
        title: 'Build an Emergency Fund First',
        body: 'Most personal finance guidance suggests keeping 3-6 months of essential expenses in an easily accessible savings account before investing further. This means a market downturn won\'t force you to sell investments at a bad time just to cover an unexpected bill.',
        category: 'Investor Mindset',
    },
    {
        id: 'timeframe-alignment',
        title: 'Timeframe Alignment',
        body: 'When you\'re researching a stock, it can help to check multiple timeframes: what does the multi-year trend look like, and what does the last few months look like? A stock that looks attractive on a short-term chart but is in a long-term decline (or vice versa) deserves a closer look before you decide.',
        category: 'Reading Charts',
    },
    {
        id: 'pe-ratio',
        title: 'Understanding P/E Ratio',
        body: 'The Price/Earnings ratio compares a stock\'s price to its annual earnings per share. A P/E of 20 means you pay $20 for every $1 of earnings. Compare P/E to industry peers and the stock\'s own historical average — not just the market average.',
        category: 'Indicators',
    },
    {
        id: 'earnings-impact',
        title: 'Earnings Reports Can Move Prices Sharply',
        body: 'Companies report earnings quarterly and stock prices can move sharply afterward — sometimes in the opposite direction of what the headline numbers suggest, since the market reacts to results versus expectations. If you hold through an earnings report, understand that short-term volatility is part of that decision.',
        category: 'Risk Management',
    },
]