import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '@/firebase/auth'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode]       = useState<Mode>('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleGoogle() {
    setError('')
    setLoading(true)
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
    setError('')
    setLoading(true)

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
      if (msg.includes('user-not-found') || msg.includes('wrong-password')) {
        setError('Email ou senha incorretos.')
      } else if (msg.includes('email-already-in-use')) {
        setError('Este email já está cadastrado. Faça login.')
      } else if (msg.includes('weak-password')) {
        setError('Senha muito fraca. Use pelo menos 6 caracteres.')
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-serif font-black text-stone-950 text-2xl mx-auto mb-3">
              S
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {mode === 'login' ? 'Entre com sua conta da Sozo' : 'Faça parte da comunidade Sozo'}
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-stone-800 border border-stone-700 text-white text-sm font-medium py-2.5 rounded-sm mb-4 transition-all hover:bg-stone-700 hover:border-stone-500 disabled:opacity-50"
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 text-stone-500 text-sm">
            <div className="flex-1 h-px bg-stone-800" />
            ou
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
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
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-rose-light bg-rose/10 border border-rose/20 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar no Painel' : 'Criar minha conta →'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-stone-500 mt-5">
            {mode === 'login' ? 'Não tem conta? ' : 'Já tenho conta. '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-gold hover:text-gold-light transition-colors"
            >
              {mode === 'login' ? 'Criar conta gratuita' : 'Entrar'}
            </button>
          </p>
        </div>

        <p className="text-center text-sm text-stone-500 mt-4">
          <Link to="/" className="hover:text-stone-300 transition-colors">← Voltar ao site</Link>
        </p>
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
