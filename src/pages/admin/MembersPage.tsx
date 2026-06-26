import { useEffect, useState } from 'react'
import { addDoc, updateDoc, doc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import { Icons } from '@/components/ui/icons'
import { TriangleAlert } from 'lucide-react'
import type { Member } from '@/types'

// ─── Tipos locais ─────────────────────────────
interface Ministerio { id: string; name: string; emoji: string }

const STATUS_BADGE = {
  ativo:   { bg: 'rgba(82,183,136,0.15)',  color: '#52B788' },
  inativo: { bg: 'rgba(106,77,53,0.25)',   color: '#B09880' },
}

const FUNCOES = [
  'Pastor', 'Líder de Célula', 'Líder de Ministério', 'Discipulador',
  'Músico', 'Vocal', 'Técnico de Som', 'Mídia Social', 'Recepção',
  'Intercessor', 'Diácono', 'Obreiro', 'Voluntário', 'Membro',
]

// ─── Modal form ───────────────────────────────
interface FormData {
  name: string; email: string; phone: string
  ministerio: string; funcao: string; status: 'ativo' | 'inativo'
}
const EMPTY: FormData = { name:'', email:'', phone:'', ministerio:'', funcao:'Membro', status:'ativo' }

interface MemberModalProps {
  member: Member | null   // null = novo
  ministerios: Ministerio[]
  onClose: () => void
  onSave: (data: FormData, id?: string) => Promise<void>
}

function MemberModal({ member, ministerios, onClose, onSave }: MemberModalProps) {
  const [form, setForm]     = useState<FormData>(member ? {
    name: member.name, email: member.email ?? '', phone: member.phone ?? '',
    ministerio: member.ministerio ?? '', funcao: member.funcao ?? 'Membro',
    status: member.status,
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set(key: keyof FormData, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nome é obrigatório.'); return }
    setSaving(true)
    try {
      await onSave(form, member?.id)
      onClose()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'36px 32px', maxWidth:520, width:'100%', position:'relative', fontFamily:'"Inter",system-ui,sans-serif', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${C.primary}, transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.gray2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', width:32, height:32 }}><Icons.close size={18} /></button>

        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>
          {member ? 'Editar membro' : 'Novo membro'}
        </div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C.white, letterSpacing:'-0.5px', marginBottom:24 }}>
          {member ? member.name : 'Cadastrar membro'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Nome */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Nome completo *</label>
            <input className="field" placeholder="Ex: Maria Silva" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>

          {/* Email + Telefone */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Email</label>
              <input className="field" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>WhatsApp</label>
              <input className="field" placeholder="(61) 9 0000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          {/* Ministério + Função */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Ministério</label>
              <select className="field" value={form.ministerio} onChange={e => set('ministerio', e.target.value)} style={{ cursor:'pointer' }}>
                <option value="">Sem ministério</option>
                {ministerios.map(m => <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Função</label>
              <select className="field" value={form.funcao} onChange={e => set('funcao', e.target.value)} style={{ cursor:'pointer' }}>
                {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:10 }}>Status</label>
            <div style={{ display:'flex', gap:10 }}>
              {(['ativo','inativo'] as const).map(s => (
                <button key={s} type="button" onClick={() => set('status', s)} style={{ flex:1, padding:'10px', borderRadius:6, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', fontWeight:700, fontSize:14, border:`1px solid ${form.status===s ? C.primary : C.line}`, background: form.status===s ? 'rgba(196,82,26,0.1)' : C.bg3, color: form.status===s ? C.primaryL : C.gray2, textTransform:'capitalize', transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  {s === 'ativo' ? <><Icons.checkCircle size={14} /> Ativo</> : '— Inativo'}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ background:'rgba(181,72,90,0.12)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#E07A8A' }}>{error}</div>}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex:1, fontSize:15, padding:'13px', minHeight:48 }}>
              {saving ? 'Salvando...' : member ? 'Salvar alterações' : 'Cadastrar membro'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding:'13px 20px', minHeight:48 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modal de confirmação de exclusão ─────────
function ConfirmModal({ name, onConfirm, onClose }: { name:string; onConfirm:()=>void; onClose:()=>void }) {
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid rgba(181,72,90,0.4)`, borderRadius:10, padding:'32px', maxWidth:380, width:'100%', fontFamily:'"Inter",system-ui,sans-serif', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16, color:'#E07A8A' }}><TriangleAlert size={36} strokeWidth={1.5} /></div>
        <h3 style={{ fontWeight:900, fontSize:20, color:C.white, marginBottom:8 }}>Desativar membro?</h3>
        <p style={{ fontSize:14, color:C.gray2, lineHeight:1.7, marginBottom:24 }}>
          <strong style={{ color:C.white }}>{name}</strong> será marcado como inativo. Você pode reativar a qualquer momento.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onConfirm} style={{ flex:1, background:'rgba(181,72,90,0.2)', border:'1px solid rgba(181,72,90,0.4)', color:'#E07A8A', padding:'12px', borderRadius:6, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif' }}>
            Sim, desativar
          </button>
          <button onClick={onClose} className="btn-ghost" style={{ flex:1, padding:'12px', minHeight:0 }}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────
export default function MembersPage() {
  const [members, setMembers]           = useState<Member[]>([])
  const [ministerios, setMinterios]     = useState<Ministerio[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState<'todos'|'ativo'|'inativo'>('todos')
  const [filterMin, setFilterMin]       = useState('')
  const [editing, setEditing]           = useState<Member | null | 'new'>(null)
  const [confirming, setConfirming]     = useState<Member | null>(null)

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db,'members'), orderBy('name'))),
      getDocs(query(collection(db,'ministerios'), orderBy('name'))),
    ]).then(([mSnap, minSnap]) => {
      setMembers(mSnap.docs.map(d => ({ id:d.id, ...d.data() } as Member)))
      setMinterios(minSnap.docs.map(d => ({ id:d.id, ...d.data() } as Ministerio)))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSave(form: FormData, id?: string) {
    const payload = {
      name:       form.name.trim(),
      email:      form.email.trim() || null,
      phone:      form.phone.trim() || null,
      ministerio: form.ministerio || null,
      funcao:     form.funcao,
      status:     form.status,
      userUid:    null,
      updatedAt:  serverTimestamp(),
    }
    if (id) {
      await updateDoc(doc(db,'members',id), payload)
      setMembers(prev => prev.map(m => m.id===id ? { ...m, ...payload, updatedAt: new Date().toISOString() } : m))
    } else {
      const ref = await addDoc(collection(db,'members'), { ...payload, createdAt: serverTimestamp() })
      setMembers(prev => [...prev, { id:ref.id, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Member].sort((a,b) => a.name.localeCompare(b.name)))
    }
  }

  async function handleDeactivate(member: Member) {
    await updateDoc(doc(db,'members',member.id), { status:'inativo', updatedAt: serverTimestamp() })
    setMembers(prev => prev.map(m => m.id===member.id ? { ...m, status:'inativo' } : m))
    setConfirming(null)
  }

  const minMap = Object.fromEntries(ministerios.map(m => [m.id, m]))

  const filtered = members.filter(m => {
    const matchSearch  = m.name.toLowerCase().includes(search.toLowerCase()) || (m.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchStatus  = filterStatus === 'todos' || m.status === filterStatus
    const matchMin     = !filterMin || m.ministerio === filterMin
    return matchSearch && matchStatus && matchMin
  })

  const ativos   = members.filter(m => m.status === 'ativo').length
  const inativos = members.filter(m => m.status === 'inativo').length

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif' }}>
      {editing !== null && (
        <MemberModal
          member={editing === 'new' ? null : editing}
          ministerios={ministerios}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
      {confirming && (
        <ConfirmModal
          name={confirming.name}
          onConfirm={() => handleDeactivate(confirming)}
          onClose={() => setConfirming(null)}
        />
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Membros</h1>
          <p className="page-sub">{members.length} cadastrados · {ativos} ativos · {inativos} inativos</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>+</span> Novo membro
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
        {[
          { label:'Total',    value:members.length,                    color:C.white },
          { label:'Ativos',   value:ativos,                            color:'#52B788' },
          { label:'Inativos', value:inativos,                          color:C.gray3 },
          { label:'Ministérios', value:ministerios.length,             color:C.primary },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ fontWeight:900, fontSize:32, color:k.color, letterSpacing:'-1px', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.gray3, marginTop:6, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', maxWidth:280, flex:'1 1 200px' }}>
          <Icons.search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.gray3, pointerEvents:'none' }} />
          <input className="field" placeholder="Buscar por nome ou email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:36, width:'100%' }} />
        </div>

        <select className="field" value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} style={{ maxWidth:140, cursor:'pointer' }}>
          <option value="todos">Todos</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>

        <select className="field" value={filterMin} onChange={e => setFilterMin(e.target.value)} style={{ maxWidth:200, cursor:'pointer' }}>
          <option value="">Todos os ministérios</option>
          {ministerios.map(m => <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}
        </select>

        {(search || filterStatus !== 'todos' || filterMin) && (
          <button onClick={() => { setSearch(''); setFilterStatus('todos'); setFilterMin('') }} style={{ background:'none', border:`1px solid ${C.lineHi}`, borderRadius:5, padding:'0 14px', color:C.gray2, fontSize:13, cursor:'pointer', minHeight:48, fontFamily:'"Inter",system-ui,sans-serif', display:'inline-flex', alignItems:'center', gap:6 }}>
            Limpar filtros <Icons.close size={13} />
          </button>
        )}

        <span style={{ marginLeft:'auto', fontSize:13, color:C.gray3 }}>{filtered.length} resultados</span>
      </div>

      {/* Tabela */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:48, textAlign:'center' }}>
            <div className="spinner" style={{ margin:'0 auto' }} />
            <p style={{ color:C.gray3, marginTop:14, fontSize:14 }}>Carregando membros...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:'56px 24px', textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12, color:C.gray3 }}><Icons.users size={40} /></div>
            <div style={{ fontSize:16, color:C.white, fontWeight:700, marginBottom:8 }}>
              {members.length === 0 ? 'Nenhum membro cadastrado' : 'Nenhum resultado'}
            </div>
            <p style={{ fontSize:14, color:C.gray3, marginBottom:20 }}>
              {members.length === 0 ? 'Comece cadastrando o primeiro membro da comunidade.' : 'Tente ajustar os filtros de busca.'}
            </p>
            {members.length === 0 && (
              <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'11px 24px' }}>
                + Cadastrar primeiro membro
              </button>
            )}
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.line}` }}>
                {['Membro','Contato','Ministério','Função','Status','Ações'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => {
                const badge  = STATUS_BADGE[member.status]
                const minObj = member.ministerio ? minMap[member.ministerio] : null
                return (
                  <tr key={member.id} className="table-row">
                    {/* Membro */}
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryL})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:C.white, flexShrink:0 }}>
                          {member.name[0].toUpperCase()}
                        </div>
                        <div style={{ fontWeight:600, fontSize:14, color:C.white }}>{member.name}</div>
                      </div>
                    </td>

                    {/* Contato */}
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ fontSize:13, color:C.gray2 }}>{member.email ?? '—'}</div>
                      <div style={{ fontSize:12, color:C.gray3, marginTop:2 }}>{member.phone ?? ''}</div>
                    </td>

                    {/* Ministério */}
                    <td style={{ padding:'14px 16px', fontSize:13, color: minObj ? C.gray1 : C.gray3 }}>
                      {minObj ? `${minObj.emoji} ${minObj.name}` : '—'}
                    </td>

                    {/* Função */}
                    <td style={{ padding:'14px 16px', fontSize:13, color:C.gray2 }}>{member.funcao ?? '—'}</td>

                    {/* Status */}
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ background:badge.bg, color:badge.color, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:3, textTransform:'uppercase', letterSpacing:'1px' }}>
                        {member.status}
                      </span>
                    </td>

                    {/* Ações */}
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => setEditing(member)} style={{ background:'none', border:`1px solid ${C.lineHi}`, borderRadius:5, padding:'6px 12px', color:C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.15s', fontFamily:'"Inter",system-ui,sans-serif' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primaryL }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor=C.lineHi; e.currentTarget.style.color=C.gray2 }}
                        >Editar</button>
                        {member.status === 'ativo' && (
                          <button onClick={() => setConfirming(member)} style={{ background:'none', border:`1px solid ${C.line}`, borderRadius:5, padding:'6px 12px', color:C.gray3, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.15s', fontFamily:'"Inter",system-ui,sans-serif' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(181,72,90,0.4)'; e.currentTarget.style.color='#E07A8A' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor=C.line; e.currentTarget.style.color=C.gray3 }}
                          >Desativar</button>
                        )}
                        {member.status === 'inativo' && (
                          <button onClick={async () => { await updateDoc(doc(db,'members',member.id),{status:'ativo',updatedAt:serverTimestamp()}); setMembers(prev=>prev.map(m=>m.id===member.id?{...m,status:'ativo'}:m)) }} style={{ background:'none', border:`1px solid rgba(82,183,136,0.3)`, borderRadius:5, padding:'6px 12px', color:'#52B788', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif' }}>
                            Reativar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div style={{ marginTop:12, fontSize:13, color:C.gray3, textAlign:'right' }}>
          {filtered.length} de {members.length} membros
        </div>
      )}
    </div>
  )
}
