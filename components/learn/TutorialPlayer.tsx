'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Check, CheckCircle2, ChevronLeft, ChevronRight, Circle,
    Lightbulb, PartyPopper, RotateCcw,
} from 'lucide-react'
import type { Tutorial, TutorialQuizOption } from '@/types/tutorial'
import { useTutorialProgress } from '@/hooks/useTutorialProgress'

function renderContent(content: string) {
    return content.split('\n\n').map((paragraph, i) => {
        const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
        return (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--color-text)', margin: '0 0 16px' }}>
                {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                        : part
                )}
            </p>
        )
    })
}

function QuizBlock({
    quiz, onCorrect,
}: {
    quiz: NonNullable<Tutorial['steps'][number]['quiz']>
    onCorrect: () => void
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const selected: TutorialQuizOption | undefined = quiz.options.find(o => o.id === selectedId)
    const isCorrect = submitted && selected?.correct === true

    function handleSubmit() {
        if (!selectedId) return
        setSubmitted(true)
        if (quiz.options.find(o => o.id === selectedId)?.correct) {
            onCorrect()
        }
    }

    function handleRetry() {
        setSubmitted(false)
        setSelectedId(null)
    }

    return (
        <div style={{ background: '#fefce8', border: '1.5px solid #fde68a', borderRadius: 14, padding: '18px 20px', marginTop: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a16207', margin: '0 0 10px' }}>
                Quick check
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 14px', lineHeight: 1.5 }}>
                {quiz.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {quiz.options.map(option => {
                    const isSelected = selectedId === option.id
                    const showCorrectness = submitted && (isSelected || option.correct)
                    let borderColor = 'var(--color-border)'
                    let bg = 'var(--color-surface)'
                    if (showCorrectness) {
                        if (option.correct) { borderColor = '#16a34a'; bg = '#f0fdf4' }
                        else if (isSelected) { borderColor = '#dc2626'; bg = '#fef2f2' }
                    } else if (isSelected) {
                        borderColor = '#ca8a04'
                    }

                    return (
                        <button
                            key={option.id}
                            onClick={() => !submitted && setSelectedId(option.id)}
                            disabled={submitted}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                textAlign: 'left', padding: '11px 14px', borderRadius: 10,
                                border: `1.5px solid ${borderColor}`, background: bg,
                                cursor: submitted ? 'default' : 'pointer', fontSize: 13,
                                color: 'var(--color-text)', width: '100%',
                            }}
                        >
                            <span style={{
                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                border: `1.5px solid ${isSelected ? '#ca8a04' : 'var(--color-border)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {isSelected && !submitted && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ca8a04' }} />}
                                {submitted && option.correct && <Check size={11} color="#16a34a" />}
                            </span>
                            {option.text}
                        </button>
                    )
                })}
            </div>

            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={!selectedId}
                    style={{
                        padding: '9px 18px', borderRadius: 9, border: 'none',
                        background: selectedId ? '#ca8a04' : '#e7e5e4',
                        color: selectedId ? 'white' : 'var(--color-text-subtle)',
                        fontSize: 13, fontWeight: 700, cursor: selectedId ? 'pointer' : 'not-allowed',
                    }}
                >
                    Check answer
                </button>
            ) : (
                <div>
                    <div style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        background: isCorrect ? '#f0fdf4' : '#fef2f2', borderRadius: 10, padding: '12px 14px', marginBottom: 10,
                    }}>
                        <Lightbulb size={15} color={isCorrect ? '#16a34a' : '#dc2626'} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? '#15803d' : '#b91c1c', margin: '0 0 4px' }}>
                                {isCorrect ? 'Correct!' : 'Not quite'}
                            </p>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65 }}>
                                {quiz.explanation}
                            </p>
                        </div>
                    </div>
                    {!isCorrect && (
                        <button
                            onClick={handleRetry}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px', borderRadius: 9, border: '1.5px solid var(--color-border)',
                                background: 'var(--color-surface)', fontSize: 12.5, fontWeight: 700,
                                color: 'var(--color-text-muted)', cursor: 'pointer',
                            }}
                        >
                            <RotateCcw size={12} /> Try again
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export function TutorialPlayer({ tutorial }: { tutorial: Tutorial }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showSummary, setShowSummary] = useState(false)
    const totalSteps = tutorial.steps.length
    const { completedStepIds, markStepComplete, resetProgress } = useTutorialProgress(tutorial.slug, totalSteps)

    const step = tutorial.steps[currentIndex]
    const stepQuizAnsweredCorrectly = completedStepIds.includes(step.id) || !step.quiz
    const progressPct = Math.round((completedStepIds.length / totalSteps) * 100)
    const canGoNext = stepQuizAnsweredCorrectly

    const isLastStep = currentIndex === totalSteps - 1

    function goNext() {
        if (!step.quiz) markStepComplete(step.id)
        if (isLastStep) {
            setShowSummary(true)
            return
        }
        setCurrentIndex(i => Math.min(i + 1, totalSteps - 1))
    }

    function goToStep(index: number) {
        setShowSummary(false)
        setCurrentIndex(index)
    }

    function goBack() {
        setCurrentIndex(i => Math.max(i - 1, 0))
    }

    if (showSummary) {
        return (
            <div style={{
                background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
                borderRadius: 20, padding: '48px 32px', textAlign: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
                }}>
                    <PartyPopper size={26} color="#16a34a" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
                    Tutorial complete!
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: '0 0 28px', maxWidth: 420, marginInline: 'auto' }}>
                    You finished all {totalSteps} steps of &ldquo;{tutorial.title}&rdquo;. Head back to the tutorial list to keep going, or put it into practice right away.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/learn" style={{
                        padding: '11px 22px', borderRadius: 10, background: '#0f766e', color: 'white',
                        fontSize: 13, fontWeight: 700, textDecoration: 'none',
                    }}>
                        Browse more tutorials
                    </Link>
                    <Link href="/stocks" style={{
                        padding: '11px 22px', borderRadius: 10, border: '1.5px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                    }}>
                        Practise on a real chart
                    </Link>
                    <button onClick={() => { resetProgress(); setShowSummary(false); setCurrentIndex(0) }} style={{
                        padding: '11px 22px', borderRadius: 10, border: '1.5px solid var(--color-border)',
                        background: 'none', color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>
                        Restart tutorial
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,220px) 1fr', gap: 24 }}>
            {/* Stepper sidebar */}
            <aside className="tutorial-stepper" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: '0 0 10px' }}>
                    {completedStepIds.length}/{totalSteps} steps complete
                </p>
                <div style={{ height: 6, borderRadius: 999, background: 'var(--color-surface-2)', overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ height: '100%', width: `${progressPct}%`, background: '#16a34a', transition: 'width 0.3s ease', borderRadius: 999 }} />
                </div>
                {tutorial.steps.map((s, i) => {
                    const done = completedStepIds.includes(s.id)
                    const active = i === currentIndex
                    return (
                        <button
                            key={s.id}
                            onClick={() => goToStep(i)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                                padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                background: active ? '#f0fdfa' : 'transparent',
                                color: active ? '#0f766e' : 'var(--color-text-muted)',
                                fontSize: 12.5, fontWeight: active ? 700 : 600,
                            }}
                        >
                            {done ? <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0 }} /> : <Circle size={15} color="var(--color-text-subtle)" style={{ flexShrink: 0 }} />}
                            <span>{s.title.replace(/^Step \d+\s*—\s*/, '')}</span>
                        </button>
                    )
                })}
            </aside>

            {/* Main content */}
            <div style={{
                background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
                borderRadius: 18, padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e', margin: '0 0 8px' }}>
                    Step {currentIndex + 1} of {totalSteps}
                </p>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, margin: '0 0 18px', lineHeight: 1.25 }}>
                    {step.title}
                </h2>

                {renderContent(step.content)}

                {step.tip && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '14px 16px', margin: '4px 0 20px' }}>
                        <Lightbulb size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
                        <p style={{ fontSize: 12.5, color: '#1e40af', margin: 0, lineHeight: 1.7 }}>{step.tip}</p>
                    </div>
                )}

                {step.quiz && (
                    <QuizBlock quiz={step.quiz} onCorrect={() => markStepComplete(step.id)} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={goBack}
                        disabled={currentIndex === 0}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '10px 16px', borderRadius: 10, border: '1.5px solid var(--color-border)',
                            background: 'none', fontSize: 13, fontWeight: 700,
                            color: currentIndex === 0 ? 'var(--color-text-subtle)' : 'var(--color-text-muted)',
                            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <ChevronLeft size={14} /> Back
                    </button>
                    <button
                        onClick={goNext}
                        disabled={Boolean(step.quiz) && !canGoNext}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '10px 20px', borderRadius: 10, border: 'none',
                            background: (Boolean(step.quiz) && !canGoNext) ? '#e7e5e4' : '#0f766e',
                            color: (Boolean(step.quiz) && !canGoNext) ? 'var(--color-text-subtle)' : 'white',
                            fontSize: 13, fontWeight: 700,
                            cursor: (Boolean(step.quiz) && !canGoNext) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLastStep ? 'Finish tutorial' : 'Continue'} <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <style>{`
                @media (max-width: 720px) {
                    .tutorial-stepper { display: none !important; }
                }
            `}</style>
        </div>
    )
}