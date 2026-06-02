import { renderHook, act } from '@testing-library/react'
import { useHints } from '@/hooks/useHints'

describe('useHints', () => {
    it('starts with the panel closed', () => {
        const { result } = renderHook(() => useHints())
        expect(result.current.isOpen).toBe(false)
    })

    it('opens the panel when toggle is called', () => {
        const { result } = renderHook(() => useHints())
        act(() => result.current.toggle())
        expect(result.current.isOpen).toBe(true)
    })

    it('closes the panel on second toggle', () => {
        const { result } = renderHook(() => useHints())
        act(() => result.current.toggle())
        act(() => result.current.toggle())
        expect(result.current.isOpen).toBe(false)
    })

    it('returns hints filtered by category', () => {
        const { result } = renderHook(() => useHints())
        act(() => result.current.setCategory('Risk Management'))
        expect(result.current.activeHints.every(h => h.category === 'Risk Management')).toBe(true)
        expect(result.current.activeHints.length).toBeGreaterThan(0)
    })

    it('returns all hints when category is null', () => {
        const { result } = renderHook(() => useHints())
        act(() => result.current.setCategory(null))
        expect(result.current.activeHints.length).toBe(25)
    })
})