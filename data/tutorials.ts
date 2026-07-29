import type { Tutorial } from '@/types/tutorial'

export const tutorials: Tutorial[] = [
    {
        slug: 'how-to-read-a-stock-chart',
        title: 'How to Read a Stock Chart',
        description: 'A guided, click-through walkthrough of candlesticks, timeframes, volume and moving averages — using the exact chart you see on every stock page.',
        category: 'Reading Charts',
        difficulty: 'Beginner',
        estimatedMinutes: 6,
        steps: [
            {
                id: 'axes',
                title: 'Step 1 — The two axes',
                content: `Every stock chart has two axes. The **horizontal axis (x)** is time — days, weeks or months moving left to right. The **vertical axis (y)** is price.\n\nWhen you pick a timeframe like 1M or 1Y on a stock page, you're just changing how much of the x-axis you see. The price scale on the y-axis adjusts automatically to fit what's on screen.`,
                tip: 'A shorter timeframe (1W) shows day-to-day noise. A longer one (1Y, ALL) shows the bigger trend and smooths out daily swings.',
            },
            {
                id: 'candlesticks',
                title: 'Step 2 — Reading a single candle',
                content: `Each candle on the chart summarises one trading period (a day, in most of our charts). It has four numbers baked into it:\n\n**Open** — the first price traded in that period.\n\n**Close** — the last price traded.\n\n**High** — the highest price reached.\n\n**Low** — the lowest price reached.\n\nThe thick part of the candle (the "body") spans open to close. The thin lines above and below (the "wicks") show the high and low.`,
                tip: 'Green body = close was higher than open (price rose that period). Red body = close was lower than open (price fell).',
            },
            {
                id: 'volume',
                title: 'Step 3 — Why volume matters',
                content: `Volume is the number of shares traded in a period, usually shown as bars beneath the price chart.\n\nVolume tells you how much conviction is behind a price move. A big price jump on **low** volume can be noise — a handful of trades pushing price around. The same jump on **high** volume suggests many participants agree, which tends to be more reliable.`,
            },
            {
                id: 'moving-averages',
                title: 'Step 4 — Moving averages (SMA)',
                content: `A Simple Moving Average (SMA) plots the average closing price over the last N periods, updated every day. On the app's stock page you'll see SMA 20 (short-term, reacts fast) and SMA 50 (medium-term, smoother).\n\nWhen the shorter SMA crosses above the longer one, it's nicknamed a "Golden Cross" and is read as a bullish signal. The reverse is a "Death Cross" — a bearish signal. These are lagging indicators: they confirm a trend that has already started rather than predicting one.`,
                quiz: {
                    question: 'A candle is red with a long lower wick and small body. What does that tell you?',
                    options: [
                        { id: 'a', text: 'The close was higher than the open, and price barely moved during the period', correct: false },
                        { id: 'b', text: 'The close was lower than the open, and price dipped much lower intraday before recovering somewhat', correct: true },
                        { id: 'c', text: 'No trades happened that period', correct: false },
                    ],
                    explanation: 'Red means close < open. A long lower wick means price fell sharply at some point in the period but buyers pushed it back up before the period ended — a small clue that selling pressure met resistance.',
                },
            },
            {
                id: 'practice',
                title: 'Step 5 — Try it yourself',
                content: `You now have everything you need to read a real chart. Open any stock page, switch between timeframes, and toggle through the tabs to see RSI and the ARIMA forecast — both build on the same price data you just learned to read.`,
            },
        ],
    },
    {
        slug: 'understanding-key-financial-ratios',
        title: 'Understanding P/E, EPS, ROE and Debt-to-Equity',
        description: 'The four fundamental ratios every beginner investor should know before buying a single share — explained with a worked numeric example.',
        category: 'Fundamentals',
        difficulty: 'Beginner',
        estimatedMinutes: 8,
        steps: [
            {
                id: 'eps',
                title: 'Step 1 — Earnings Per Share (EPS)',
                content: `EPS tells you how much profit a company made per share of stock. The formula is:\n\n**EPS = Net Income ÷ Shares Outstanding**\n\nIf a company earns $100 million and has 50 million shares outstanding, EPS is $2. EPS by itself doesn't tell you if a stock is cheap or expensive — it's a building block for the next ratio.`,
                tip: 'Example: Net income $100M ÷ 50M shares = $2.00 EPS.',
            },
            {
                id: 'pe',
                title: 'Step 2 — Price/Earnings (P/E) ratio',
                content: `P/E compares the share price to EPS:\n\n**P/E = Share Price ÷ EPS**\n\nIf the stock trades at $40 and EPS is $2, the P/E is 20 — you're paying $20 for every $1 of annual earnings. A high P/E often means the market expects fast future growth. A low P/E can mean the stock is undervalued, or that the market expects earnings to decline. Always compare P/E to the company's own history and to similar companies in the same industry — a "good" P/E for a bank looks nothing like a "good" P/E for a software company.`,
                quiz: {
                    question: 'A stock trades at $60 and has EPS of $3. What is its P/E ratio?',
                    options: [
                        { id: 'a', text: '20', correct: true },
                        { id: 'b', text: '3', correct: false },
                        { id: 'c', text: '180', correct: false },
                    ],
                    explanation: 'P/E = Price ÷ EPS = $60 ÷ $3 = 20.',
                },
            },
            {
                id: 'roe',
                title: 'Step 3 — Return on Equity (ROE)',
                content: `ROE measures how efficiently a company turns shareholders' money into profit:\n\n**ROE = Net Income ÷ Shareholder Equity**\n\nIf shareholder equity is $500 million and net income is $100 million, ROE is 20%. That means for every $1 shareholders have invested in the business, the company generated $0.20 in profit that year. Higher ROE generally signals a more efficient, profitable business — but very high ROE can also come from heavy borrowing (debt), which is riskier. That's exactly why the next ratio matters.`,
                tip: 'Example: Net income $100M ÷ shareholder equity $500M = 20% ROE.',
            },
            {
                id: 'debt-to-equity',
                title: 'Step 4 — Debt-to-Equity (D/E) ratio',
                content: `D/E shows how much a company relies on borrowed money versus shareholder money to fund itself:\n\n**D/E = Total Debt ÷ Shareholder Equity**\n\nA D/E of 1.0 means the company has as much debt as equity. A D/E of 0.3 means it's mostly funded by shareholders, with relatively little debt. Higher D/E means higher financial risk which means the company has fixed interest payments that must be made regardless of how business is going, which can hurt during downturns. Capital-intensive industries (utilities, telecoms) typically run higher D/E than software companies, so — like P/E — compare within the same industry.`,
                quiz: {
                    question: 'Company A has ROE of 25% driven mostly by heavy debt. Company B has ROE of 18% with very little debt. Which statement is most accurate?',
                    options: [
                        { id: 'a', text: 'Company A is definitely the better investment because its ROE is higher', correct: false },
                        { id: 'b', text: 'ROE alone doesn\'t tell the full story — check D/E too, since debt can inflate ROE and add risk', correct: true },
                        { id: 'c', text: 'Debt has no effect on ROE', correct: false },
                    ],
                    explanation: 'Debt magnifies ROE because equity (the denominator) shrinks relative to assets. That can make a heavily-indebted company look more "efficient" while actually being riskier. Always view ROE alongside D/E.',
                },
            },
            {
                id: 'putting-together',
                title: 'Step 5 — Putting it all together',
                content: `No single ratio tells the whole story. A quick mental checklist when researching any stock:\n\n1. **EPS** — is the company actually profitable and is EPS growing over time?\n\n2. **P/E** — how much am I paying for that profit relative to peers?\n\n3. **ROE** — how efficiently does the company turn equity into profit?\n\n4. **D/E** — how much of that performance is coming from debt-fuelled risk?\n\nUsed together, these four numbers give you a much fuller picture than any one of them alone.`,
            },
        ],
    },
    {
        slug: 'reading-rsi-and-momentum',
        title: 'Reading RSI and Momentum',
        description: 'Learn what the Relative Strength Index actually measures, how to read overbought/oversold zones and where it can mislead you.',
        category: 'Indicators',
        difficulty: 'Beginner',
        estimatedMinutes: 5,
        steps: [
            {
                id: 'what-is-rsi',
                title: 'Step 1 — What RSI measures',
                content: `The Relative Strength Index (RSI) measures the speed and size of recent price changes, on a scale from 0 to 100. It compares the average size of recent up-moves to the average size of recent down-moves over a set period (usually 14 days).\n\nRSI doesn't tell you the price instead it tells you the **momentum** behind recent price action.`,
            },
            {
                id: 'zones',
                title: 'Step 2 — Overbought and oversold zones',
                content: `**RSI above 70** — the stock has risen quickly. Traders call this "overbought," meaning it may be due for a pause or pullback.\n\n**RSI below 30** — the stock has fallen quickly. This is "oversold," meaning it may be due for a bounce.\n\n**RSI 40–60** — roughly neutral, no strong momentum in either direction.`,
                tip: 'These zones are probabilities, not guarantees. A stock in a strong uptrend can stay "overbought" for weeks.',
            },
            {
                id: 'limitation',
                title: 'Step 3 — The most common RSI mistake',
                content: `The most common beginner mistake is selling the instant RSI touches 70, or buying the instant it touches 30. In a strong trend, RSI can remain in overbought or oversold territory for a long time while price keeps moving in the same direction — acting on RSI alone in that situation would have you fighting the trend.\n\nRSI works best combined with other context: the overall trend direction, support/resistance levels and volume — not used in isolation.`,
                quiz: {
                    question: 'A stock has been in a strong uptrend for three months and RSI has been above 70 for two of those weeks. What is the most reasonable read?',
                    options: [
                        { id: 'a', text: 'Sell immediately — RSI above 70 always means a crash is coming', correct: false },
                        { id: 'b', text: 'RSI can stay elevated during strong trends; treat it as one data point, not a standalone signal', correct: true },
                        { id: 'c', text: 'RSI is broken and should be ignored entirely', correct: false },
                    ],
                    explanation: 'Sustained overbought readings during strong trends are common and expected. RSI is most useful alongside trend and volume context, not as a lone trigger.',
                },
            },
            {
                id: 'practice-rsi',
                title: 'Step 4 — Try it on a real chart',
                content: `Open any stock page and click the "Technical Analysis" tab to see its live RSI panel alongside the plain-language interpretation. Compare what RSI says against the price chart above it to see the relationship for yourself.`,
            },
        ],
    },
    {
        slug: 'making-your-first-simulated-trade',
        title: 'Making Your First Simulated Trade',
        description: 'A hands-on walkthrough of buying and selling in the portfolio simulator — cost basis, cash balance and position tracking, step by step.',
        category: 'Portfolio Simulation',
        difficulty: 'Beginner',
        estimatedMinutes: 6,
        steps: [
            {
                id: 'starting-cash',
                title: 'Step 1 — Your simulated starting balance',
                content: `Every new portfolio starts with simulated cash — no real money is ever involved. You'll see this balance on your Portfolio page. Every buy reduces your cash balance by (price × quantity); every sell increases it by the same formula.`,
            },
            {
                id: 'find-a-stock',
                title: 'Step 2 — Find a stock to buy',
                content: `Browse the market page or search for a symbol, then open its stock page. You'll see the current quote, a price chart, and key statistics like P/E ratio and 52-week range before you commit any simulated cash.`,
                tip: 'Reading the chart and stats before trading is good practice — treat every simulated trade like a real research decision.',
            },
            {
                id: 'place-order',
                title: 'Step 3 — Place the order',
                content: `On the stock page, use the trade ticket to choose Buy or Sell and enter a quantity. When you submit, the app fetches the current market price and executes immediately — this mirrors a real "market order," the simplest and fastest order type.\n\nIf you try to buy more than your cash balance allows, or sell more shares than you hold, the order will be rejected — just like a real brokerage would reject it.`,
            },
            {
                id: 'cost-basis',
                title: 'Step 4 — Understanding cost basis',
                content: `After a buy, your **cost basis** is the average price you paid for your current shares. If you buy 10 shares at $100, then 10 more at $120, your average cost basis becomes $110 per share — not $100 and not $120.\n\nCost basis matters because your profit or loss is always measured against it: **Unrealised gain = (current price − cost basis) × shares held.**`,
                quiz: {
                    question: 'You buy 5 shares at $50, then later buy 5 more shares at $70. What is your new average cost basis?',
                    options: [
                        { id: 'a', text: '$50', correct: false },
                        { id: 'b', text: '$60', correct: true },
                        { id: 'c', text: '$70', correct: false },
                    ],
                    explanation: 'Total cost = (5×$50) + (5×$70) = $600. Total shares = 10. Average cost = $600 ÷ 10 = $60.',
                },
            },
            {
                id: 'track-it',
                title: 'Step 5 — Track your position',
                content: `Your Portfolio page shows every holding with quantity, cost basis, current price, market value and gain/loss updated live — plus your recent trade history so you can review every decision you made and why.`,
            },
        ],
    },
    {
        slug: 'fifo-lifo-average-cost',
        title: 'FIFO vs LIFO vs Average Cost: Which Method Fits?',
        description: 'A worked, step-by-step example showing how the same set of trades produces three different realised gain numbers depending on accounting method.',
        category: 'Accounting Methods',
        difficulty: 'Intermediate',
        estimatedMinutes: 8,
        steps: [
            {
                id: 'why-it-matters',
                title: 'Step 1 — Why accounting method matters',
                content: `When you buy the same stock at different prices over time and then sell only part of your position, you need a rule for which shares you're "selling" — because each purchase (called a "lot") has a different cost. The method you choose changes your realised gain, and can change how much tax you owe in real life.\n\nThere are three common methods: **FIFO**, **LIFO**, and **Average Cost**.`,
            },
            {
                id: 'setup',
                title: 'Step 2 — Our example trades',
                content: `Let's use one consistent example through this whole tutorial:\n\n**Lot 1:** Buy 10 shares at $50\n**Lot 2:** Buy 10 shares at $70\n**Sell:** 10 shares at $90\n\nWe'll calculate the realised gain on that sale three different ways.`,
                tip: 'Total shares before the sale: 20. We are selling half the position (10 shares).',
            },
            {
                id: 'fifo',
                title: 'Step 3 — FIFO (First In, First Out)',
                content: `FIFO assumes the **oldest** shares are sold first. Here, that means the sale is matched against Lot 1 ($50 cost).\n\n**Realised gain = (Sell price − Lot 1 cost) × quantity = ($90 − $50) × 10 = $400**\n\nAfter this sale, you'd still be holding 10 shares from Lot 2 at a $70 cost basis.`,
            },
            {
                id: 'lifo',
                title: 'Step 4 — LIFO (Last In, First Out)',
                content: `LIFO assumes the **newest** shares are sold first. Here, that means the sale is matched against Lot 2 ($70 cost).\n\n**Realised gain = ($90 − $70) × 10 = $200**\n\nAfter this sale, you'd still be holding 10 shares from Lot 1 at a $50 cost basis. Notice this is a smaller realised gain than FIFO gave us, from the exact same trades.`,
                quiz: {
                    question: 'Using our example (Lot 1: 10@$50, Lot 2: 10@$70, Sell 10@$90), why does LIFO produce a smaller realised gain than FIFO here?',
                    options: [
                        { id: 'a', text: 'LIFO matches the sale against the higher-cost lot ($70), leaving less gain per share', correct: true },
                        { id: 'b', text: 'LIFO always produces smaller gains than FIFO, in every situation', correct: false },
                        { id: 'c', text: 'LIFO and FIFO always produce identical results', correct: false },
                    ],
                    explanation: 'LIFO matched the newer, higher-cost lot ($70) against the $90 sale price, versus FIFO matching the older, lower-cost lot ($50). Whether LIFO or FIFO gives the bigger gain depends entirely on whether prices have been rising or falling — this isn\'t a fixed rule.',
                },
            },
            {
                id: 'average',
                title: 'Step 5 — Average Cost',
                content: `Average Cost blends all lots into one weighted average before any sale.\n\n**Average cost = (10×$50 + 10×$70) ÷ 20 = $1,200 ÷ 20 = $60**\n\n**Realised gain = ($90 − $60) × 10 = $300**\n\nAverage Cost lands between FIFO and LIFO in this example — it always smooths out the effect of any single lot.`,
            },
            {
                id: 'compare',
                title: 'Step 6 — Same trades, three different answers',
                content: `From the identical set of trades:\n\n**FIFO realised gain: $400**\n**LIFO realised gain: $200**\n**Average Cost realised gain: $300**\n\nNone of these numbers is "wrong" — they're just different accounting conventions applied consistently. In real brokerage accounts, the method you pick can affect your tax bill, since it changes how much gain is "realised" (and taxable) in a given year versus how much remains unrealised in your remaining position.`,
            },
        ],
    },
    {
        slug: 'multi-currency-investing-basics',
        title: 'Multi-Currency Investing Basics',
        description: 'How exchange rates affect the real value of your investments when you hold cash or stocks priced in a different currency than your home currency.',
        category: 'Multi-Currency',
        difficulty: 'Beginner',
        estimatedMinutes: 5,
        steps: [
            {
                id: 'why-currency-matters',
                title: 'Step 1 — Why currency matters to investors',
                content: `Most U.S. stocks are priced and traded in USD. If your home currency is SGD or EUR, your actual return depends on **two** things: how the stock price moved, and how the exchange rate moved between USD and your home currency.\n\nA stock can go up in USD terms and still be a loss in your home currency if that currency strengthened enough against the dollar — and vice versa.`,
            },
            {
                id: 'reading-a-rate',
                title: 'Step 2 — Reading an exchange rate',
                content: `An exchange rate like "USD/SGD = 1.35" means 1 US dollar buys 1.35 Singapore dollars. If you're converting SGD into USD to buy a U.S. stock, you divide: SGD amount ÷ 1.35 = USD amount.\n\nRates move constantly based on interest rates, economic data and market sentiment between the two countries.`,
                tip: 'The app\'s Currency Exchange page fetches live rates so you can see today\'s actual conversion before moving simulated cash between currencies.',
            },
            {
                id: 'worked-example',
                title: 'Step 3 — A worked example',
                content: `Say you convert 1,350 SGD into USD at a rate of 1.35, giving you $1,000 USD. You buy 10 shares of a stock at $100 each.\n\nA year later, the stock is at $110 (up 10% in USD). But if the exchange rate has moved to 1.30 (USD weakened against SGD), converting your $1,100 back gives you 1,430 SGD — a gain, but a smaller one in SGD terms than the 10% USD gain would suggest.`,
                quiz: {
                    question: 'You hold a U.S. stock that rose 8% in USD over a year. Over the same year, the US dollar weakened significantly against your home currency. What happens to your return measured in your home currency?',
                    options: [
                        { id: 'a', text: 'Your home-currency return will be exactly 8%, currency never affects it', correct: false },
                        { id: 'b', text: 'Your home-currency return will likely be lower than 8%, and could even be negative', correct: true },
                        { id: 'c', text: 'Your home-currency return is always higher than the USD return', correct: false },
                    ],
                    explanation: 'If the dollar weakens against your home currency, each USD converts back to less home currency than before, dragging down your total return — potentially enough to offset or reverse the 8% USD gain.',
                },
            },
            {
                id: 'takeaway',
                title: 'Step 4 — The takeaway',
                content: `You don't need to predict currency moves to invest sensibly — but you should be aware that holding foreign-currency assets adds a second source of volatility on top of the stock's own price moves. Some long-term investors accept this as diversification; others specifically hedge currency exposure. Neither is "correct" — it depends on your goals.`,
            },
        ],
    },
]

export function getTutorial(slug: string): Tutorial | undefined {
    return tutorials.find(t => t.slug === slug)
}