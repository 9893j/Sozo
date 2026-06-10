import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

const NAV_LINKS = [
  { label: 'Sobre',       href: '#sobre' },
  { label: 'Cultos',      href: '#rotina' },
  { label: 'Eventos',     href: '#eventos' },
  { label: 'Comunidade',  href: '#comunicacao' },
  { label: 'Ao Vivo',     href: '#live' },
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
      className={`fixed top-0 left-0 right-0 z-50 px-[5%] h-[68px] flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? 'bg-stone-950/92 backdrop-blur-md border-b border-gold/10'
          : ''
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-serif font-black text-stone-950 text-base">
          S
        </div>
        <span className="font-serif text-xl font-bold text-gold-light">Sozo Church</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="btn-ghost text-sm"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* CTA */}
      {firebaseUser ? (
        <button
          onClick={() => navigate('/admin')}
          className="btn-gold text-sm py-2 px-5"
        >
          Painel →
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="btn-gold text-sm py-2 px-5"
        >
          Entrar
        </button>
      )}
    </nav>
  )
}
