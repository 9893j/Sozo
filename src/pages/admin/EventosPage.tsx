import { useEffect, useState } from 'react'
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import type { Evento } from '@/types'

// ─── Tipos ───────────────────────────────────
const STATUS_BADGE = {
  rascunho:  { bg:'rgba(106,77,53,0.25)',  color:'#B09880', label:'Rascunho' },
  publicado: { bg:'rgba(82,183,136,0.15)', color:'#52B788', label:'Publicado' },
  encerrado: { bg:'rgba(91,158,201,0.15)', color:'#5B9EC9', label:'Encerrado' },
}

const EMOJIS = ['✝','🔥','🕊','❤️','🎵','👑','💧','🎉','🙏','⛪','📖','🌙','⭐','🏕']

interface EventoForm {
  title: string; description: string; date: string; time: string
  local: string; emoji: string; maxInscritos: string
  status: Evento['status']
}
const EMPTY_FORM: EventoForm = { title:'', description:'', date:'', time:'19h00', local:'', emoji:'✝', maxInscritos:'', status:'rascunho' }

// ─── Modal form ───────────────────────────────
interface ModalProps { evento: Evento | null; onClose: () => void; onSave: (form: EventoForm, id?: string) => Promise<void> }

function EventoModal({ evento, onClose, onSave }: ModalProps) {
  const [form, setForm]     = useState<EventoForm>(evento ? {
    title: evento.title, description: evento.description, date: evento.date,
    time: evento.time, local: evento.local, emoji: evento.emoji,
    maxInscritos: evento.maxInscritos?.toString() ?? '',
    status: evento.status,
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set<K extends keyof EventoForm>(key: K, val: EventoForm[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Título é obrigatório.'); return }
    if (!form.date)         { setError('Informe a data.'); return }
    if (!form.local.trim()) { setError('Informe o local.'); return }
    setSaving(true)
    try { await onSave(form, evento?.id); onClose() }
    catch { setError('Erro ao salvar. Tente novamente.') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'36px 32px', maxWidth:560, width:'100%', position:'relative', fontFamily:'"Inter",system-ui,sans-serif', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.primary},transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.gray2, fontSize:20, cursor:'pointer' }}>✕</button>

        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>{evento ? 'Editar evento' : 'Novo evento'}</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C.white, letterSpacing:'-0.5px', marginBottom:24 }}>
          {evento ? evento.title : 'Criar evento'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Emoji picker */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:10 }}>Ícone</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => set('emoji', em)} style={{ width:40, height:40, borderRadius:8, border:`2px solid ${form.emoji===em ? C.primary : C.line}`, background: form.emoji===em ? 'rgba(196,82,26,0.15)' : C.bg3, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Título *</label>
            <input className="field" placeholder="Ex: Congresso da Juventude 2025" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          {/* Descrição */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Descrição</label>
            <textarea className="field" placeholder="Descreva o evento..." value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ resize:'vertical', minHeight:80 }} />
          </div>

          {/* Data + Horário */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Data *</label>
              <input className="field" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Horário</label>
              <input className="field" placeholder="19h30" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          {/* Local + Max inscritos */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Local *</label>
              <input className="field" placeholder="Ex: Salão Principal" value={form.local} onChange={e => set('local', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Máx. inscritos</label>
              <input className="field" type="number" placeholder="Ilimitado" min={1} value={form.maxInscritos} onChange={e => set('maxInscritos', e.target.value)} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:10 }}>Status de publicação</label>
            <div style={{ display:'flex', gap:8 }}>
              {(Object.keys(STATUS_BADGE) as Evento['status'][]).map(s => {
                const b = STATUS_BADGE[s]
                return (
                  <button key={s} type="button" onClick={() => set('status', s)} style={{ flex:1, padding:'10px 6px', borderRadius:6, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', fontWeight:700, fontSize:13, border:`1px solid ${form.status===s ? b.color : C.line}`, background: form.status===s ? b.bg : C.bg3, color: form.status===s ? b.color : C.gray2, textTransform:'capitalize', transition:'all 0.15s' }}>
                    {b.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && <div style={{ background:'rgba(181,72,90,0.12)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#E07A8A' }}>{error}</div>}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex:1, fontSize:15, padding:'13px', minHeight:48 }}>
              {saving ? 'Salvando...' : evento ? 'Salvar alterações' : 'Criar evento'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding:'13px 20px', minHeight:48 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Card de evento ───────────────────────────
interface CardProps { evento: Evento; onEdit: () => void; onDelete: () => void; onPublish: () => void }

function EventoCard({ evento, onEdit, onDelete, onPublish }: CardProps) {
  const badge = STATUS_BADGE[evento.status]
  const pct   = evento.maxInscritos ? Math.min(100, Math.round(evento.inscritos / evento.maxInscritos * 100)) : null

  function formatDate(d: string) {
    if (!d) return ''
    const [y,m,day] = d.split('-')
    return new Date(Number(y), Number(m)-1, Number(day)).toLocaleDateString('pt-BR', { day:'numeric', month:'short' })
  }

  return (
    <div style={{ background:C.bg2, border:`1px solid ${evento.status==='publicado' ? C.primaryD : C.line}`, borderRadius:10, overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color 0.2s' }}>
      {/* Header colorido */}
      <div style={{ height:100, background:`linear-gradient(160deg, ${C.bg3} 0%, rgba(196,82,26,0.15) 100%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', fontSize:52 }}>
        {evento.emoji}
        <div style={{ position:'absolute', top:10, right:10 }}>
          <span style={{ background:badge.bg, color:badge.color, fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:3, textTransform:'uppercase', letterSpacing:'1px' }}>{badge.label}</span>
        </div>
        <div style={{ position:'absolute', top:10, left:12, fontSize:22, fontWeight:900, color:'rgba(255,255,255,0.15)', lineHeight:1 }}>
          {formatDate(evento.date)}
        </div>
      </div>

      {/* Corpo */}
      <div style={{ padding:'20px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ fontWeight:800, fontSize:16, color:C.white, lineHeight:1.3 }}>{evento.title}</div>
        <div style={{ fontSize:13, color:C.gray3 }}>📍 {evento.local} · {evento.time}</div>
        {evento.description && <p style={{ fontSize:13, color:C.gray2, lineHeight:1.7, marginTop:2 }}>{evento.description.slice(0,100)}{evento.description.length > 100 ? '...' : ''}</p>}

        {/* Inscritos */}
        <div style={{ marginTop:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.gray3 }}>Inscritos</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.white }}>{evento.inscritos}{evento.maxInscritos ? ` / ${evento.maxInscritos}` : ''}</span>
          </div>
          {pct !== null && (
            <div style={{ height:4, background:C.line, borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background: pct >= 90 ? '#E07A8A' : pct >= 60 ? '#D4A84B' : C.primary, borderRadius:2, transition:'width 0.3s' }} />
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.line}`, display:'flex', gap:8 }}>
        {evento.status === 'rascunho' && (
          <button onClick={onPublish} style={{ flex:1, background:'rgba(82,183,136,0.1)', border:'1px solid rgba(82,183,136,0.3)', borderRadius:5, color:'#52B788', fontSize:13, fontWeight:700, padding:'8px', cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif' }}>
            ↑ Publicar
          </button>
        )}
        {evento.status === 'publicado' && (
          <button onClick={() => {}} style={{ flex:1, background:'rgba(91,158,201,0.1)', border:'1px solid rgba(91,158,201,0.3)', borderRadius:5, color:'#5B9EC9', fontSize:13, fontWeight:700, padding:'8px', cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif' }}>
            ✓ Encerrar
          </button>
        )}
        <button onClick={onEdit} style={{ flex:1, background:'none', border:`1px solid ${C.lineHi}`, borderRadius:5, color:C.gray2, fontSize:13, fontWeight:600, padding:'8px', cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primaryL }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=C.lineHi; e.currentTarget.style.color=C.gray2 }}
        >Editar</button>
        <button onClick={onDelete} style={{ width:36, height:36, background:'none', border:`1px solid ${C.line}`, borderRadius:5, color:C.gray3, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', flexShrink:0 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(181,72,90,0.4)'; e.currentTarget.style.color='#E07A8A' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=C.line; e.currentTarget.style.color=C.gray3 }}
        >🗑</button>
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────
export default function EventosPage() {
  const { appUser } = useAuth()
  const [eventos, setEventos]     = useState<Evento[]>([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState<Evento | null | 'new'>(null)
  const [filterStatus, setFilter] = useState<Evento['status'] | 'todos'>('todos')
  const [search, setSearch]       = useState('')

  useEffect(() => {
    getDocs(query(collection(db,'eventos'), orderBy('date')))
      .then(snap => setEventos(snap.docs.map(d => ({ id:d.id, ...d.data() } as Evento))))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(form: EventoForm, id?: string) {
    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      date:        form.date,
      time:        form.time,
      local:       form.local.trim(),
      emoji:       form.emoji,
      maxInscritos: form.maxInscritos ? Number(form.maxInscritos) : null,
      status:      form.status,
      createdBy:   appUser?.uid ?? '',
      updatedAt:   serverTimestamp(),
    }
    if (id) {
      await updateDoc(doc(db,'eventos',id), payload)
      setEventos(prev => prev.map(e => e.id===id ? { ...e, ...payload, updatedAt: new Date().toISOString() } : e))
    } else {
      const ref = await addDoc(collection(db,'eventos'), { ...payload, inscritos:0, createdAt: serverTimestamp() })
      setEventos(prev => [...prev, { id:ref.id, ...payload, inscritos:0, createdAt:'', updatedAt:'' } as Evento])
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar este evento permanentemente?')) return
    await deleteDoc(doc(db,'eventos',id))
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  async function handlePublish(id: string) {
    await updateDoc(doc(db,'eventos',id), { status:'publicado', updatedAt: serverTimestamp() })
    setEventos(prev => prev.map(e => e.id===id ? { ...e, status:'publicado' } : e))
  }

  const filtered = eventos.filter(e => {
    const matchStatus = filterStatus === 'todos' || e.status === filterStatus
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.local.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const publicados = eventos.filter(e => e.status==='publicado').length
  const rascunhos  = eventos.filter(e => e.status==='rascunho').length
  const totalInscritos = eventos.reduce((a,e) => a + e.inscritos, 0)

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif' }}>
      {editing !== null && (
        <EventoModal
          evento={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Eventos</h1>
          <p className="page-sub">{eventos.length} eventos · {publicados} publicados</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>+</span> Novo evento
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
        {[
          { label:'Total',       value:eventos.length,  color:C.white },
          { label:'Publicados',  value:publicados,      color:'#52B788' },
          { label:'Rascunhos',   value:rascunhos,       color:'#D4A84B' },
          { label:'Inscritos',   value:totalInscritos,  color:C.primary },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ fontWeight:900, fontSize:32, color:k.color, letterSpacing:'-1px', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.gray3, marginTop:6, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
        <input className="field" placeholder="🔍  Buscar evento..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:260 }} />
        <div style={{ display:'flex', gap:6 }}>
          {(['todos','rascunho','publicado','encerrado'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding:'8px 16px', borderRadius:5, border:`1px solid ${filterStatus===s ? C.primary : C.lineHi}`, background: filterStatus===s ? 'rgba(196,82,26,0.1)' : 'none', color: filterStatus===s ? C.primaryL : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', textTransform:'capitalize', minHeight:44 }}>
              {s === 'todos' ? 'Todos' : STATUS_BADGE[s as Evento['status']].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}>
          <div className="spinner" style={{ margin:'0 auto' }} />
          <p style={{ color:C.gray3, marginTop:14, fontSize:14 }}>Carregando eventos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding:'56px 24px', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
          <div style={{ fontSize:16, color:C.white, fontWeight:700, marginBottom:8 }}>
            {eventos.length === 0 ? 'Nenhum evento criado' : 'Nenhum resultado'}
          </div>
          <p style={{ fontSize:14, color:C.gray3, marginBottom:20 }}>
            {eventos.length === 0 ? 'Crie o primeiro evento da Sozo.' : 'Tente outros filtros.'}
          </p>
          {eventos.length === 0 && (
            <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'11px 24px' }}>+ Criar primeiro evento</button>
          )}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:16 }}>
          {filtered.map(ev => (
            <EventoCard
              key={ev.id}
              evento={ev}
              onEdit={() => setEditing(ev)}
              onDelete={() => handleDelete(ev.id)}
              onPublish={() => handlePublish(ev.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
