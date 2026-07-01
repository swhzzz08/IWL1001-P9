import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding educational content...')

  await prisma.educationalContent.deleteMany()

  await prisma.educationalContent.createMany({
    data: [
      {
        topic: 'Stocks',
        title: 'What Is a Stock?',
        content: 'A stock represents ownership in a company. When you buy shares, you become a partial owner entitled to a share of the company assets and earnings. Stocks trade on exchanges like NYSE and NASDAQ during market hours. You can profit through capital appreciation or dividends.',
        difficultyLevel: 'Beginner',
      },
      {
        topic: 'Stocks',
        title: 'How to Read a Stock Chart',
        content: 'A stock chart shows price over time. The x-axis is time, the y-axis is price. Line charts plot only closing price. Candlestick charts show open, high, low and close for each period. Green candles mean close was higher than open, red means lower. Volume bars at the bottom show how many shares were traded.',
        difficultyLevel: 'Beginner',
      },
      {
        topic: 'Risk Management',
        title: 'Position Sizing: The Key to Long-Term Survival',
        content: 'Position sizing determines how many shares you buy in a single trade. The 1% Rule says risk no more than 1% of your total account on any single trade. To calculate position size: decide your maximum dollar risk, set your stop loss, then divide risk by stop loss distance to get number of shares.',
        difficultyLevel: 'Intermediate',
      },
      {
        topic: 'Options',
        title: 'What Are Options?',
        content: 'An option is a contract that gives the buyer the right but not obligation to buy or sell 100 shares at a strike price before an expiration date. Call options give you the right to buy. Put options give you the right to sell. You pay a premium upfront which is your maximum loss as a buyer.',
        difficultyLevel: 'Intermediate',
      },
      {
        topic: 'Fundamentals',
        title: 'Reading Financial Statements',
        content: 'Every public company files three core financial statements. The Income Statement shows revenue, expenses and net income. The Balance Sheet shows assets, liabilities and equity at a point in time. The Cash Flow Statement shows actual cash moving in and out. Operating cash flow is more reliable than net income.',
        difficultyLevel: 'Intermediate',
      },
      {
        topic: 'ETFs',
        title: 'Introduction to ETFs',
        content: 'An ETF is a fund that holds many assets and trades on an exchange like a single stock. Buying one share of SPY gives you exposure to all 500 S&P 500 companies. Advantages include instant diversification, low expense ratios, tax efficiency and intraday trading. Types include index ETFs, sector ETFs and bond ETFs.',
        difficultyLevel: 'Beginner',
      },
      {
        topic: 'Technical Analysis',
        title: 'Technical Indicators: An Overview',
        content: 'Technical indicators fall into four categories. Trend indicators like Moving Averages show direction and strength. Momentum indicators like RSI measure speed of price movement. Volatility indicators like Bollinger Bands measure price fluctuation. Volume indicators confirm or challenge price moves. Always combine indicators with price action and risk management.',
        difficultyLevel: 'Intermediate',
      },
    ],
  })

  console.log('Seeded 7 educational articles successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
