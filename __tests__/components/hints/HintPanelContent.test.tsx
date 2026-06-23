import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HintPanelContent } from '@/components/hints/HintPanelContent'

describe('HintPanelContent', () => {
    it('renders all category filter buttons', () => {
        render(<HintPanelContent />)
        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Charts' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Risk' })).toBeInTheDocument()
    })

    it('renders all hints by default', () => {
        render(<HintPanelContent />)
        expect(screen.getByText('Reading Candlesticks')).toBeInTheDocument()
        expect(screen.getByText('Support & Resistance')).toBeInTheDocument()
    })

    it('filters hints when a category is selected', async () => {
        const user = userEvent.setup()
        render(<HintPanelContent />)
        await user.click(screen.getByRole('button', { name: 'Risk' }))
        expect(screen.queryByText('Reading Candlesticks')).not.toBeInTheDocument()
    })

    it('expands a hint row to show its body on click', async () => {
        const user = userEvent.setup()
        render(<HintPanelContent />)
        expect(screen.queryByText(/Each candle shows open, high, low, and close/)).not.toBeInTheDocument()
        await user.click(screen.getByText('Reading Candlesticks'))
        expect(screen.getByText(/Each candle shows open, high, low, and close/)).toBeInTheDocument()
    })
})
