// __tests__/lib/formatters.ts
import { formatCurrency, formatVolume, formatPercent, formatMarketCap } from '@/lib/formatters'

describe('formatCurrency', () => {
    it('formats a positive number with $ and 2 decimal places', () => {
        expect(formatCurrency(185.5)).toBe('$185.50')
    })
    it('formats zero', () => {
        expect(formatCurrency(0)).toBe('$0.00')
    })
})

describe('formatVolume', () => {
    it('abbreviates millions', () => {
        expect(formatVolume(55_000_000)).toBe('55.0M')
    })
    it('abbreviates billions', () => {
        expect(formatVolume(1_200_000_000)).toBe('1.2B')
    })
    it('shows raw number under 1M', () => {
        expect(formatVolume(500_000)).toBe('500,000')
    })
})

describe('formatPercent', () => {
    it('formats positive with + sign and 2 decimals', () => {
        expect(formatPercent(1.23)).toBe('+1.23%')
    })
    it('formats negative with sign', () => {
        expect(formatPercent(-0.5)).toBe('-0.50%')
    })
})

describe('formatMarketCap', () => {
    it('abbreviates trillions', () => {
        expect(formatMarketCap(2_800_000_000_000)).toBe('$2.80T')
    })
    it('abbreviates billions', () => {
        expect(formatMarketCap(45_000_000_000)).toBe('$45.00B')
    })
})