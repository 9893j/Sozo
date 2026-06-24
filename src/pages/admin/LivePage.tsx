import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { C } from '@/lib/tokens'
import { Icons } from '@/components/ui/icons'
import { FaInstagram, FaYoutube, FaFacebook, FaLink } from 'react-icons/fa6'

// ─── Tipos ───────────────────────────────────
interface LiveConfig {
  isLive:      boolean
  platform:    'instagram' | 'youtube' | 'facebook' | 'outro'
  link:        string
  title:       string
  nextDate:    string  // próxima transmissão agendada (texto livre)
  nextTime:    string
}

const EMPTY: LiveConfig = {
  isLive: false, platform: 'instagram', link: '', title: 'Culto ao vivo', nextDate: '', nextTime: '19h30',
}

const PLATFORMS: { key: LiveConfig['platform']; label: string; Icon: typeof FaInstagram; color: string }[] = [
  { key:'instagram', label:'Instagram', Icon:FaInstagram, color:'#E1306C' },
  { key:'youtube',   label:'YouTube',   Icon:FaYoutube,   color:'#FF0000' },
  { key:'facebook',  label:'Facebook',  Icon:FaFacebook,  color:'#1877F2' },
  { key:'outro',     label:'Outro link',Icon:FaLink,      color:C.gray3   },
]

// ─── Page ─────────────────────────────────────
export default function LivePage() {
  const [config, setConfig]   = useState<LiveConfig>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  // Carrega config existente
  useEffect(() => {
    getDoc(doc(db, 'live', 'config'))
      .then(snap => {
        if (snap.exists()) setConfig({ ...EMPTY, ...snap.data() } as LiveConfig)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function set<K extends keyof LiveConfig>(key: K, val: LiveConfig[K]) {
    setConfig(c => ({ ...c, [key]: val }))
  }

  async function handleSave() {
    if (config.isLive && !config.link.trim()) {
      setError('Adicione o link da transmissão antes de ativar o "Ao Vivo".')
      return
    }
    setError('')
    setSaving(true)
    try {
      await setDoc(doc(db, 'live', 'config'), { ...config, updatedAt: serverTimestamp() })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding:48, textAlign:'center' }}>
        <div className="spinner" style={{ margin:'0 auto' }} />
      </div>
    )
  }

  const platformInfo = PLATFORMS.find(p => p.key === config.platform)!

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif', maxWidth:680 }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontWeight:800, fontSize:26, color:C.white, letterSpacing:'-0.8px' }}>Transmissão</h1>
        <p style={{ fontSize:13, color:C.gray3, marginTop:4 }}>Configure o link e o status da transmissão ao vivo</p>
      </div>

      {/* Status atual — preview de como aparece na landing */}
      <div style={{ marginBottom:20, padding:'18px 20px', borderRadius:10, background: config.isLive ? 'rgba(196,82,26,0.08)' : '#0E0A06', border:`1px solid ${config.isLive ? 'rgba(196,82,26,0.3)' : 'rgba(255,255,255,0.05)'}`, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background: config.isLive ? '#E07A8A' : C.gray3, flexShrink:0, animation: config.isLive ? 'pulse-live 1.5s infinite' : 'none' }} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.white }}>
            {config.isLive ? 'Transmissão AO VIVO agora' : 'Nenhuma transmissão ativa'}
          </div>
          <div style={{ fontSize:12, color:C.gray3, marginTop:2 }}>
            {config.isLive ? 'Visível na landing page para todos os visitantes' : 'O banner de "ao vivo" está oculto na landing'}
          </div>
        </div>
      </div>

      {/* Toggle Ao Vivo */}
      <div style={{ background:'#0E0A06', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'20px 22px', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:C.white }}>Ativar "Ao Vivo"</div>
            <div style={{ fontSize:12, color:C.gray3, marginTop:3 }}>Mostra o banner pulsante na landing page</div>
          </div>
          <button
            onClick={() => set('isLive', !config.isLive)}
            style={{ width:48, height:26, borderRadius:13, border:'none', cursor:'pointer', background: config.isLive ? C.primary : C.lineHi, position:'relative', transition:'background 0.2s', flexShrink:0 }}
          >
            <div style={{ width:20, height:20, borderRadius:'50%', background:C.white, position:'absolute', top:3, left: config.isLive ? 25 : 3, transition:'left 0.2s' }} />
          </button>
        </div>
      </div>

      {/* Plataforma */}
      <div style={{ background:'#0E0A06', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'20px 22px', marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.primary, marginBottom:14 }}>Plataforma da transmissão</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
          {PLATFORMS.map(p => {
            const active = config.platform === p.key
            return (
              <button key={p.key} onClick={() => set('platform', p.key)} style={{ padding:'14px 8px', borderRadius:8, border:`1px solid ${active ? p.color+'66' : 'rgba(255,255,255,0.07)'}`, background: active ? p.color+'14' : '#0A0704', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, transition:'all 0.15s', fontFamily:'"Inter",system-ui,sans-serif' }}>
                <p.Icon size={20} color={active ? p.color : C.gray3} />
                <span style={{ fontSize:11, fontWeight:600, color: active ? C.white : C.gray3 }}>{p.label}</span>
              </button>
            )
          })}
        </div>

        {/* Link */}
        <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:8 }}>
          Link {platformInfo.label === 'Outro link' ? '' : `do ${platformInfo.label}`}
        </label>
        <input
          className="field"
          placeholder={
            config.platform === 'instagram' ? 'https://instagram.com/sozobrasilia/live' :
            config.platform === 'youtube'   ? 'https://youtube.com/@sozobrasilia/live' :
            config.platform === 'facebook'  ? 'https://facebook.com/sozobrasilia/live' :
            'https://...'
          }
          value={config.link}
          onChange={e => set('link', e.target.value)}
        />
        <p style={{ fontSize:11, color:C.gray3, marginTop:6 }}>
          Cole o link direto da live. Os visitantes serão redirecionados para assistir.
        </p>
      </div>

      {/* Título + próxima transmissão */}
      <div style={{ background:'#0E0A06', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'20px 22px', marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.primary, marginBottom:14 }}>Detalhes</div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Título da transmissão</label>
          <input className="field" placeholder="Ex: Culto de Domingo" value={config.title} onChange={e => set('title', e.target.value)} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Próxima transmissão</label>
            <input className="field" placeholder="Ex: Domingo" value={config.nextDate} onChange={e => set('nextDate', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Horário</label>
            <input className="field" placeholder="19h30" value={config.nextTime} onChange={e => set('nextTime', e.target.value)} />
          </div>
        </div>
        <p style={{ fontSize:11, color:C.gray3, marginTop:8 }}>
          Aparece na landing quando a live estiver desativada — ex: "Próxima transmissão: Domingo às 19h30"
        </p>
      </div>

      {/* Erros / sucesso */}
      {error && <div style={{ background:'rgba(181,72,90,0.1)', border:'1px solid rgba(181,72,90,0.28)', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#E07A8A', marginBottom:16 }}>{error}</div>}
      {saved && <div style={{ background:'rgba(82,183,136,0.1)', border:'1px solid rgba(82,183,136,0.28)', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#52B788', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}><Icons.checkCircle size={14} /> Configuração salva — a landing page já está atualizada.</div>}

      {/* Salvar */}
      <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize:14, padding:'12px 28px', minHeight:46 }}>
        {saving ? 'Salvando...' : 'Salvar configuração'}
      </button>

      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
