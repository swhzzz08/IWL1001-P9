import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HintWidget } from '@/components/hints/HintWidget'

describe('HintWidget', () => {
    it('renders the collapsed pill by default', () => {
        render(<HintWidget />)
        expect(screen.getByRole('button', { name: 'Open trading hints' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Minimize trading hints' })).not.toBeInTheDocument()
    })

    it('expands into the panel when the pill is clicked', async () => {
        const user = userEvent.setup()
        render(<HintWidget />)
        await user.click(screen.getByRole('button', { name: 'Open trading hints' }))
        expect(screen.getByRole('button', { name: 'Minimize trading hints' })).toBeInTheDocument()
        expect(screen.getByText('Trading Hints')).toBeInTheDocument()
        expect(screen.getByText('Reading Candlesticks')).toBeInTheDocument()
    })

    it('collapses back to the pill when minimize is clicked', async () => {
        const user = userEvent.setup()
        render(<HintWidget />)
        await user.click(screen.getByRole('button', { name: 'Open trading hints' }))
        await user.click(screen.getByRole('button', { name: 'Minimize trading hints' }))
        expect(screen.getByRole('button', { name: 'Open trading hints' })).toBeInTheDocument()
        expect(screen.queryByText('Reading Candlesticks')).not.toBeInTheDocument()
    })
})
