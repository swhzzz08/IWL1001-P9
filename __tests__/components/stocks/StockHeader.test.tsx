import { render, screen } from '@testing-library/react'
import { StockHeader } from '@/components/stocks/StockHeader'

const mockQuote = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.50,
    change: 1.23,
    changePercent: 0.67,
    volume: 55000000,
    marketCap: 2900000000000,
    peRatio: 28.5,
    weekHigh52: 199.62,
    weekLow52: 164.08,
    open: 184.30,
    previousClose: 184.27,
}

test('renders symbol and price', () => {
    render(<StockHeader quote={mockQuote} isLoading={false} />)
    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('$185.50')).toBeInTheDocument()
})

test('shows loading state', () => {
    render(<StockHeader quote={null} isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
})