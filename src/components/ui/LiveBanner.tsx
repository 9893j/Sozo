import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { C } from '@/lib/tokens'
import { Icons } from '@/components/ui/icons'
import { FaInstagram, FaYoutube, FaFacebook, FaLink } from 'react-icons/fa6'

// ─── Tipos ───────────────────────────────────
interface LiveConfig {
  isLive:   boolean
  platform: 'instagram' | 'youtube' | 'facebook' | 'outro'
  link:     string
  title:    string
  nextDate: string
  nextTime: string
}

const PLATFORM_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: FaInstagram, youtube: FaYoutube, facebook: FaFacebook, outro: FaLink,
}

// ─── Banner "Ao Vivo" — usar dentro do Hero da Landing ──
// Escuta o documento /live/config em tempo real (onSnapshot)
// Se isLive=true, mostra banner pulsante com botão "Assistir agora"
// Se isLive=false mas tiver nextDate, mostra "Próxima transmissão"
export function LiveBanner() {
  const [config, setConfig] = useState<LiveConfig | null>(null)

  useEffect(() => {
    // onSnapshot = escuta em tempo real, atualiza sem precisar recarregar a página
    const unsub = onSnapshot(doc(db, 'live', 'config'), snap => {
      if (snap.exists()) setConfig(snap.data() as LiveConfig)
    })
    return () => unsub()
  }, [])

  if (!config) return null

  // ── Estado: AO VIVO agora ──────────────────
  if (config.isLive && config.link) {
    return (
      <a
        href={config.link}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          marginBottom: 28, padding: '10px 20px', borderRadius: 6,
          background: 'rgba(196,82,26,0.12)',
          border: '1px solid rgba(196,82,26,0.4)',
          textDecoration: 'none', cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(196,82,26,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(196,82,26,0.12)')}
      >
        <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#E07A8A', animation: 'pulse-live 1.5s infinite' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E07A8A' }} />
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E07A8A' }}>
          AO VIVO
        </span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>
          {config.title || 'Transmissão ao vivo'}
        </span>
        <span style={{ fontSize: 12, color: C.primaryL, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {(() => { const PlatformIcon = PLATFORM_ICON[config.platform]; return <PlatformIcon size={13} /> })()} Assistir agora <Icons.arrowRight size={13} />
        </span>

        <style>{`
          @keyframes pulse-live {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0; transform: scale(2); }
          }
        `}</style>
      </a>
    )
  }

  // ── Estado: próxima transmissão agendada ───
  if (!config.isLive && config.nextDate) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        marginBottom: 28, padding: '9px 18px', borderRadius: 6,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ fontSize: 14, color: C.gray2, display: 'inline-flex', alignItems: 'center' }}>{(() => { const PlatformIcon = PLATFORM_ICON[config.platform]; return <PlatformIcon size={14} /> })()}</span>
        <span style={{ fontSize: 12, color: C.gray2 }}>
          Próxima transmissão: <strong style={{ color: C.white }}>{config.nextDate}</strong>
          {config.nextTime && <> às <strong style={{ color: C.white }}>{config.nextTime}</strong></>}
        </span>
      </div>
    )
  }

  // ── Nenhuma transmissão configurada ────────
  return null
}
