import { useState } from 'react'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db } from '@/firebase/config'
import { auth } from '@/firebase/config'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import { ROLE_LABELS } from '@/types'
import { logOut } from '@/firebase/auth'
import { useNavigate } from 'react-router-dom'

const ROLE_DESC: Record<string, string> = {
  super_admin: 'Acesso total — gerencia usuários, roles e toda a plataforma.',
  pastor:      'Painel completo — todos os módulos exceto configurações de sistema.',
  lider:       'Membros, escalas, eventos e pedidos de oração.',
  membro:      'Perfil pessoal, eventos e pedidos de oração.',
  visitante:   'Somente landing page pública.',
}

export default function ProfilePage() {
  const { appUser, refetch } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState(appUser?.displayName ?? '')
  const [phone, setPhone]             = useState(appUser?.phone ?? '')
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) { setError('Nome é obrigatório.'); return }
    setSaving(true); setError('')
    try {
      if (!appUser) return
      await updateDoc(doc(db,'users',appUser.uid), { displayName:displayName.trim(), phone:phone.trim()||null, updatedAt:serverTimestamp() })
      if (auth.currentUser) await updateProfile(auth.currentUser, { displayName:displayName.trim() })
      await refetch()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Erro ao salvar. Tente novamente.') }
    finally { setSaving(false) }
  }

  async function handleLogout() {
    await logOut()
    navigate('/')
  }

  if (!appUser) return null

  const role = appUser.role

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif', maxWidth:680 }}>
      <div style={{ marginBottom:32 }}>
        <h1 className="page-title">Meu Perfil</h1>
        <p className="page-sub">Gerencie suas informações e preferências</p>
      </div>

      {/* Avatar + identidade */}
      <div className="card" style={{ marginBottom:16, display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},${C.primaryL})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:28, color:C.white, flexShrink:0 }}>
          {appUser.displayName?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:20, color:C.white, marginBottom:4 }}>{appUser.displayName}</div>
          <div style={{ fontSize:14, color:C.gray2, marginBottom:8 }}>{appUser.email}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(196,82,26,0.12)', border:`1px solid ${C.primaryD}`, borderRadius:5, padding:'5px 12px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.primary, display:'inline-block' }} />
            <span style={{ fontSize:12, fontWeight:700, color:C.primaryL, textTransform:'uppercase', letterSpacing:'1px' }}>{ROLE_LABELS[role]}</span>
          </div>
        </div>
      </div>

      {/* Permissões do role */}
      <div className="card" style={{ marginBottom:16, borderLeft:`3px solid ${C.primary}` }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:8 }}>Nível de acesso</div>
        <div style={{ fontWeight:700, fontSize:16, color:C.white, marginBottom:4 }}>{ROLE_LABELS[role]}</div>
        <p style={{ fontSize:14, color:C.gray2, lineHeight:1.7 }}>{ROLE_DESC[role] ?? ''}</p>
      </div>

      {/* Formulário de edição */}
      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:20 }}>Informações pessoais</div>
        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Nome completo *</label>
              <input className="field" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Seu nome" required />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>WhatsApp</label>
              <input className="field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(61) 9 0000-0000" />
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Email</label>
            <input className="field" value={appUser.email} disabled style={{ opacity:0.5, cursor:'not-allowed' }} />
            <p style={{ fontSize:11, color:C.gray3, marginTop:5 }}>Email não pode ser alterado por aqui.</p>
          </div>

          {error && <div style={{ background:'rgba(181,72,90,0.12)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#E07A8A' }}>{error}</div>}
          {saved  && <div style={{ background:'rgba(82,183,136,0.12)', border:'1px solid rgba(82,183,136,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#52B788' }}>✓ Perfil salvo com sucesso.</div>}

          <div>
            <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize:15, padding:'13px 32px', minHeight:48 }}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Atividade */}
      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:16 }}>Conta</div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            { label:'UID', value: appUser.uid },
            { label:'Membro desde', value: appUser.createdAt ? new Date(appUser.createdAt).toLocaleDateString('pt-BR') : '—' },
            { label:'Status', value: appUser.active ? 'Ativo' : 'Inativo' },
            { label:'Ministérios', value: appUser.ministerios?.length > 0 ? appUser.ministerios.join(', ') : 'Nenhum' },
          ].map(row => (
            <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.line}` }}>
              <span style={{ fontSize:13, color:C.gray3, fontWeight:600 }}>{row.label}</span>
              <span style={{ fontSize:13, color:C.gray1, fontFamily:'monospace', maxWidth:300, textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sair */}
      <div className="card" style={{ borderColor:'rgba(181,72,90,0.2)' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#E07A8A', marginBottom:12 }}>Sair da conta</div>
        <p style={{ fontSize:14, color:C.gray2, marginBottom:16, lineHeight:1.6 }}>Você será redirecionado para a landing page.</p>
        <button onClick={handleLogout} style={{ background:'rgba(181,72,90,0.1)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'11px 24px', color:'#E07A8A', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(181,72,90,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(181,72,90,0.1)' }}
        >← Sair da conta</button>
      </div>
    </div>
  )
}
