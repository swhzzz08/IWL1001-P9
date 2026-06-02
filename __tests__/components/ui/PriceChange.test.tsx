import { render, screen } from '@testing-library/react'
import { PriceChange } from '@/components/ui/PriceChange'

describe('PriceChange', () => {
    it('shows + prefix and green class for positive change', () => {
        render(<PriceChange change={1.23} changePercent={0.66} />)
        const el = screen.getByTestId('price-change')
        expect(el).toHaveTextContent('+1.23')
        expect(el).toHaveTextContent('+0.66%')
        expect(el.className).toMatch(/text-green/)
    })

    it('shows red class for negative change', () => {
        render(<PriceChange change={-2.50} changePercent={-1.34} />)
        const el = screen.getByTestId('price-change')
        expect(el.className).toMatch(/text-red/)
    })
})