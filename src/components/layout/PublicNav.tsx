// PublicNav — usado apenas na LoginPage via PublicLayout
// A LandingPage tem nav próprio inline
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { C } from '@/lib/tokens'
import { SozoLogo } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useAuth } from '@/features/auth/AuthContext'

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const { firebaseUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 6%', height: 70,
      background: scrolled ? 'rgba(13,9,6,0.93)' : 'transparent',
      backdropFilter: scrolled ? 'blur(28px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.lineHi}` : 'none',
      transition: 'all 0.3s ease',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <SozoLogo size={42} />
      </button>
      {firebaseUser ? (
        <button
          onClick={() => navigate('/admin')}
          className="btn-primary"
          style={{ fontSize: 14, padding: '10px 22px', minHeight: 42, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          Painel <Icons.arrowRight size={14} />
        </button>
      ) : (
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.gray2, fontSize: 14, fontWeight: 500,
            fontFamily: '"Inter", system-ui, sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          <Icons.arrowLeftSm size={14} /> Voltar ao site
        </button>
      )}
    </nav>
  )
}
