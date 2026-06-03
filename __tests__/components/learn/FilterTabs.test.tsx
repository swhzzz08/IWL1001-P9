import { render, screen } from '@testing-library/react'
import { FilterTabs } from '@/components/learn/FilterTabs'
import userEvent from '@testing-library/user-event'

const categories = ['All', 'Stocks', 'Options', 'ETFs']

test('renders all tab labels', () => {
    render(<FilterTabs categories={categories} selected="All" onSelect={() => {}} />)
    categories.forEach((c) => expect(screen.getByRole('button', { name: c })).toBeInTheDocument())
})

test('calls onSelect with clicked category', async () => {
    const user = userEvent.setup()
    const onSelect = jest.fn()
    render(<FilterTabs categories = {categories} selected = "All" onSelect = {onSelect} />)
    await user.click(screen.getByRole('button', { name: 'Stocks'}))
    expect(onSelect).toHaveBeenCalledWith('Stocks')
})

test('marks the selected tab as active via aria-pressed', () => {
    render(<FilterTabs categories = {categories} selected = "Options" onSelect = {() => {}} />)
    expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Stocks' })).toHaveAttribute('aria-pressed', 'false')
})