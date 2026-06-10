import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

const NAV_LINKS = [
  { label: 'Sobre',      href: '#sobre' },
  { label: 'Cultos',     href: '#rotina' },
  { label: 'Eventos',    href: '#eventos' },
  { label: 'Comunidade', href: '#comunicacao' },
  { label: 'Ao Vivo',    href: '#live' },
]

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const { firebaseUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
      style={{
        padding: '0 5%',
        height: '68px',
        background: scrolled ? 'rgba(12,11,9,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(200,169,110,0.12)' : 'none',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #C8A96E, #9A7D4A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 900,
            color: '#0C0B09',
          }}
        >
          S
        </div>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: '#E2C898' }}>
          Sozo Church
        </span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <button key={link.href} onClick={() => scrollTo(link.href)} className="btn-ghost">
            {link.label}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(firebaseUser ? '/admin' : '/login')}
        className="btn-gold"
        style={{ padding: '8px 20px', fontSize: 14 }}
      >
        {firebaseUser ? 'Painel →' : 'Entrar'}
      </button>
    </nav>
  )
}