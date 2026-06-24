import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '@/firebase/auth'
import { C, GRAIN } from '@/lib/tokens'
import { SozoLogo } from '@/components/ui'
import { Icons } from '@/components/ui/icons'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode]         = useState<Mode>('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  async function handleGoogle() {
    setError(''); setLoading(true)
    try {
      await signInWithGoogle()
      navigate('/admin')
    } catch {
      setError('Erro ao entrar com Google. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
      } else {
        if (!name.trim()) { setError('Informe seu nome.'); setLoading(false); return }
        await registerWithEmail(email, password, name)
      }
      navigate('/admin')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Email ou senha incorretos.')
      } else if (msg.includes('email-already-in-use')) {
        setError('Este email já está cadastrado. Faça login.')
      } else if (msg.includes('weak-password')) {
        setError('Senha fraca. Use pelo menos 6 caracteres.')
      } else if (msg.includes('invalid-email')) {
        setError('Email inválido.')
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 16px 32px',
      fontFamily: '"Inter", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Grain */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '300px', opacity: 0.038, mixBlendMode: 'overlay' }} />

      {/* Orb de fundo */}
      <div aria-hidden="true" style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,82,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
        background: `linear-gradient(150deg, ${C.bg2} 0%, ${C.bg3} 100%)`,
        border: `1px solid ${C.lineHi}`,
        borderRadius: 12,
        padding: '44px 40px',
        boxShadow: `0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}>

        {/* Barra de gradiente top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.primary}, ${C.gold}, transparent)`, borderRadius: '12px 12px 0 0' }} />

        {/* Logo centralizada */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', marginBottom: 16 }}>
            <SozoLogo size={56} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 24, color: C.white, letterSpacing: '-0.5px', marginBottom: 6 }}>
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p style={{ fontSize: 14, color: C.gray2, lineHeight: 1.6 }}>
            {mode === 'login' ? 'Entre na sua conta da Sozo' : 'Faça parte da comunidade Sozo'}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: C.surface, border: `1px solid ${C.lineHi}`,
            color: C.white, fontSize: 15, fontWeight: 600,
            padding: '13px', borderRadius: 6, cursor: 'pointer',
            marginBottom: 20, minHeight: 50,
            transition: 'background 0.2s, border-color 0.2s',
            fontFamily: '"Inter", system-ui, sans-serif',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.lineHi; e.currentTarget.style.borderColor = C.gray3 }}
          onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.lineHi }}
        >
          <GoogleIcon />
          Continuar com Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.line }} />
          <span style={{ fontSize: 13, color: C.gray3 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: C.line }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <input
              className="field"
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            className="field"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="field"
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {/* Erro */}
          {error && (
            <div style={{ background: 'rgba(181,72,90,0.12)', border: '1px solid rgba(181,72,90,0.3)', borderRadius: 5, padding: '10px 14px', fontSize: 14, color: '#E07A8A', lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: 4, fontSize: 16, padding: '15px', minHeight: 52 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Aguarde...
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {mode === 'login' ? 'Entrar no Painel' : 'Criar minha conta'} <Icons.arrowRight size={15} />
              </span>
            )}
          </button>
        </form>

        {/* Toggle login/register */}
        <p style={{ textAlign: 'center', fontSize: 14, color: C.gray3, marginTop: 20 }}>
          {mode === 'login' ? 'Não tem conta? ' : 'Já tenho conta. '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: '"Inter", system-ui, sans-serif', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = C.primaryL)}
            onMouseLeave={e => (e.currentTarget.style.color = C.primary)}
          >
            {mode === 'login' ? 'Criar conta gratuita' : 'Entrar'}
          </button>
        </p>

        {/* Voltar */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.line}` }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: C.gray3, fontSize: 13, cursor: 'pointer', fontFamily: '"Inter", system-ui, sans-serif', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => (e.currentTarget.style.color = C.gray2)}
            onMouseLeave={e => (e.currentTarget.style.color = C.gray3)}
          >
            <Icons.arrowLeftSm size={13} /> Voltar ao site
          </button>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
