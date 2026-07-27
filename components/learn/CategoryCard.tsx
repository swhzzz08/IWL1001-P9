"use client"

import Link from 'next/link'
import {
    TrendingUp, Layers, PieChart, BarChart2,
    Shield, BookOpen, Coins, Landmark,
} from 'lucide-react'
import type { Category } from '@/types/education'
import { articles } from '@/data/education'

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    TrendingUp, Layers, PieChart, BarChart2,
    Shield, BookOpen, Coins, Landmark,
}

const COLORS = [
    { bg: '#eff6ff', icon: '#2563eb' },
    { bg: '#f0fdf4', icon: '#16a34a' },
    { bg: '#fdf4ff', icon: '#9333ea' },
    { bg: '#fff7ed', icon: '#ea580c' },
    { bg: '#fef2f2', icon: '#dc2626' },
    { bg: '#f0fdfa', icon: '#0d9488' },
    { bg: '#fefce8', icon: '#ca8a04' },
    { bg: '#f8fafc', icon: '#475569' },
]

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
    const Icon = ICONS[category.iconName] ?? BookOpen
    const color = COLORS[index % COLORS.length]

    const actualCount = articles.filter(a => a.category === category.name).length

    return (
        <Link href={`/learn/${category.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
                display: 'flex', flexDirection: 'column', gap: 12,
                borderRadius: 16, border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)', padding: '20px',
                transition: 'all 0.2s', cursor: 'pointer', height: '100%',
            }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = color.icon + '60'
                    el.style.boxShadow = `0 4px 20px ${color.icon}18`
                    el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--color-border)'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'none'
                }}
            >
                <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: color.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={20} color={color.icon} />
                </div>
                <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
                        {category.name}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65 }}>
                        {category.description}
                    </p>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                    {actualCount} {actualCount === 1 ? 'article' : 'articles'}
                </p>
            </div>
        </Link>
    )
}