import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { C } from '@/lib/tokens'

// ─── FadeIn wrapper ──────────────────────────
interface FadeInProps {
  id?: string
  children: ReactNode
  style?: CSSProperties
}
export function FadeIn({ id, children, style }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.05 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      id={id}
      ref={ref}
      style={{
        opacity:   vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Tag / eyebrow ───────────────────────────
export function Tag({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.primary, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.primary }}>
        {children}
      </span>
    </div>
  )
}

// ─── H2 seção ────────────────────────────────
export function H2({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <h2 style={{
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,50px)',
      color: C.white,
      letterSpacing: '-1.5px',
      lineHeight: 1.05,
      marginBottom: 18,
      textAlign: center ? 'center' : undefined,
    }}>
      {children}
    </h2>
  )
}

// ─── Logo SOZO ───────────────────────────────
export function SozoLogo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: size, height: size,
        background: C.primary, borderRadius: 7,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, padding: 3,
        boxShadow: `0 0 16px rgba(196,82,26,0.4)`,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {['S', 'O', 'Z', 'O'].map((l, i) => (
            <span key={i} style={{ fontSize: size * 0.21, fontWeight: 900, color: C.white, lineHeight: 1.15, textAlign: 'center' }}>
              {l}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 900, fontSize: size * 0.42, color: C.white, letterSpacing: '-0.5px', lineHeight: 1 }}>
          SOZO
        </div>
        <div style={{ fontWeight: 400, fontSize: size * 0.24, color: C.gray2, letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1 }}>
          Comunidade Cristã
        </div>
      </div>
    </div>
  )
}

// ─── Botão primário ──────────────────────────
interface BtnPrimaryProps {
  onClick?: () => void
  children: ReactNode
  style?: CSSProperties
}
export function BtnPrimary({ onClick, children, style }: BtnPrimaryProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryL} 100%)`,
        color: C.white,
        padding: '16px 38px',
        borderRadius: 5,
        fontSize: 17,
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        minHeight: 54,
        boxShadow: hovered ? `0 0 52px rgba(196,82,26,0.52)` : `0 0 36px rgba(196,82,26,0.32)`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── Botão ghost ─────────────────────────────
export function BtnGhost({ onClick, children, style }: BtnPrimaryProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'transparent',
        color: hovered ? C.white : C.gray1,
        padding: '15px 36px',
        borderRadius: 5,
        fontSize: 17,
        fontWeight: 600,
        border: `1px solid ${hovered ? C.gray3 : C.lineHi}`,
        cursor: 'pointer',
        minHeight: 54,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
