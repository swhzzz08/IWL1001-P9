'use client'

import { useState } from 'react'
import { Lightbulb, X, ChevronRight, BookOpen } from 'lucide-react'
import { useHints } from '@/hooks/useHints'
import { HintPanelContent } from './HintPanelContent'

export function HintWidget() {
  const { isOpen, toggle } = useHints()
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 40 }}>
      {/* Expanded panel */}
      {isOpen && (
        <div style={{
          width: 320, marginBottom: 12,
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 20,
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          animation: 'fadeUp 0.25s ease forwards',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#0f766e,#0d9488)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lightbulb size={14} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'white', margin: 0, fontFamily: 'var(--font-heading)' }}>Learning Tips</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Educational hints for beginners</p>
              </div>
            </div>
            <button onClick={toggle} style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}>
              <X size={14} />
            </button>
          </div>

          <HintPanelContent />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 20px',
          background: isOpen ? '#f0fdfa' : hovered ? '#0d9488' : 'linear-gradient(135deg,#0f766e,#0d9488)',
          border: isOpen ? '1.5px solid #99f6e4' : 'none',
          borderRadius: 999,
          cursor: 'pointer',
          boxShadow: isOpen ? 'none' : '0 4px 20px #0f766e40',
          transition: 'all 0.2s',
          color: isOpen ? '#0f766e' : 'white',
        }}
      >
        <Lightbulb size={15} />
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
          {isOpen ? 'Close Tips' : 'Learning Tips'}
        </span>
        {!isOpen && <ChevronRight size={13} style={{ transform: 'rotate(-90deg)' }} />}
      </button>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}