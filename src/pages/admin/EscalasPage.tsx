import { useEffect, useState } from 'react'
import { addDoc, updateDoc, doc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { C } from '@/lib/tokens'
import { Icons } from '@/components/ui/icons'
import { ClipboardList, Pencil } from 'lucide-react'
import type { Escala, Member } from '@/types'

// ─── Tipos ───────────────────────────────────
const STATUS_OPTS = ['confirmado','pendente','ausente'] as const
type EscalaStatus = typeof STATUS_OPTS[number]

const STATUS_BADGE: Record<EscalaStatus, { bg:string; color:string }> = {
  confirmado: { bg:'rgba(82,183,136,0.15)',  color:'#52B788' },
  pendente:   { bg:'rgba(212,168,75,0.15)',  color:'#D4A84B' },
  ausente:    { bg:'rgba(181,72,90,0.15)',   color:'#E07A8A' },
}

const HORARIOS    = ['08h00','09h00','10h00','18h00','19h00','19h30','20h00','21h00']

interface EscalaForm {
  memberUid: string; memberName: string
  ministerioId: string; funcao: string
  date: string; time: string
  status: EscalaStatus
}
const EMPTY_FORM: EscalaForm = { memberUid:'', memberName:'', ministerioId:'', funcao:'', date:'', time:'19h30', status:'pendente' }

// ─── Modal form ───────────────────────────────
interface ModalProps {
  escala: Escala | null
  members: Member[]
  onClose: () => void
  onSave: (form: EscalaForm, id?: string) => Promise<void>
}

function EscalaModal({ escala, members, onClose, onSave }: ModalProps) {
  const [form, setForm]   = useState<EscalaForm>(escala ? {
    memberUid:    escala.memberUid,
    memberName:   escala.memberName,
    ministerioId: escala.ministerioId,
    funcao:       escala.funcao,
    date:         escala.date,
    time:         escala.time,
    status:       escala.status as EscalaStatus,
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set<K extends keyof EscalaForm>(key: K, val: EscalaForm[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function selectMember(uid: string) {
    const m = members.find(m => m.id === uid)
    if (m) { set('memberUid', m.id); set('memberName', m.name) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.memberUid) { setError('Selecione um membro.'); return }
    if (!form.date)      { setError('Informe a data.'); return }
    if (!form.funcao)    { setError('Informe a função.'); return }
    setSaving(true)
    try { await onSave(form, escala?.id); onClose() }
    catch { setError('Erro ao salvar. Tente novamente.') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'36px 32px', maxWidth:500, width:'100%', position:'relative', fontFamily:'"Inter",system-ui,sans-serif', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.primary},transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.gray2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', width:32, height:32 }}><Icons.close size={18} /></button>

        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>{escala ? 'Editar escala' : 'Nova escala'}</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C.white, letterSpacing:'-0.5px', marginBottom:24 }}>
          {escala ? escala.memberName : 'Adicionar à escala'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Membro */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Membro *</label>
            <select className="field" value={form.memberUid} onChange={e => selectMember(e.target.value)} style={{ cursor:'pointer' }}>
              <option value="">Selecionar membro...</option>
              {members.filter(m => m.status === 'ativo').map(m => (
                <option key={m.id} value={m.id}>{m.name}{m.funcao ? ` — ${m.funcao}` : ''}</option>
              ))}
            </select>
          </div>

          {/* Data + Horário */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Data *</label>
              <input className="field" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Horário</label>
              <select className="field" value={form.time} onChange={e => set('time', e.target.value)} style={{ cursor:'pointer' }}>
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          {/* Função */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Função na escala *</label>
            <input className="field" placeholder="Ex: Vocal, Guitarra, Recepção..." value={form.funcao} onChange={e => set('funcao', e.target.value)} />
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:10 }}>Status de confirmação</label>
            <div style={{ display:'flex', gap:8 }}>
              {STATUS_OPTS.map(s => {
                const b = STATUS_BADGE[s]
                return (
                  <button key={s} type="button" onClick={() => set('status', s)} style={{ flex:1, padding:'10px 6px', borderRadius:6, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', fontWeight:700, fontSize:13, border:`1px solid ${form.status===s ? b.color : C.line}`, background: form.status===s ? b.bg : C.bg3, color: form.status===s ? b.color : C.gray2, textTransform:'capitalize', transition:'all 0.15s' }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {error && <div style={{ background:'rgba(181,72,90,0.12)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#E07A8A' }}>{error}</div>}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex:1, fontSize:15, padding:'13px', minHeight:48 }}>
              {saving ? 'Salvando...' : escala ? 'Salvar alterações' : 'Adicionar à escala'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding:'13px 20px', minHeight:48 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────
export default function EscalasPage() {
  const [escalas, setEscalas]   = useState<Escala[]>([])
  const [members, setMembers]   = useState<Member[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<Escala | null | 'new'>(null)
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState<EscalaStatus | 'todos'>('todos')

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db,'escalas'), orderBy('date'))),
      getDocs(query(collection(db,'members'), orderBy('name'))),
    ]).then(([eSnap, mSnap]) => {
      setEscalas(eSnap.docs.map(d => ({ id:d.id, ...d.data() } as Escala)))
      setMembers(mSnap.docs.map(d => ({ id:d.id, ...d.data() } as Member)))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSave(form: EscalaForm, id?: string) {
    const payload = { ...form, updatedAt: serverTimestamp() }
    if (id) {
      await updateDoc(doc(db,'escalas',id), payload)
      setEscalas(prev => prev.map(e => e.id===id ? { ...e, ...form } : e))
    } else {
      const ref = await addDoc(collection(db,'escalas'), { ...payload, createdAt: serverTimestamp() })
      setEscalas(prev => [...prev, { id:ref.id, ...form, createdAt:'', updatedAt:'' }])
    }
  }

  async function updateStatus(id: string, status: EscalaStatus) {
    await updateDoc(doc(db,'escalas',id), { status, updatedAt: serverTimestamp() })
    setEscalas(prev => prev.map(e => e.id===id ? { ...e, status } : e))
  }

  // Agrupa por data
  const filtered = escalas.filter(e => {
    const matchDate   = !filterDate   || e.date === filterDate
    const matchStatus = filterStatus === 'todos' || e.status === filterStatus
    return matchDate && matchStatus
  })

  const byDate = filtered.reduce<Record<string, Escala[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = []
    acc[e.date].push(e)
    return acc
  }, {})

  const sortedDates = Object.keys(byDate).sort()

  function formatDate(d: string) {
    if (!d) return ''
    const [y,m,day] = d.split('-')
    const dt = new Date(Number(y), Number(m)-1, Number(day))
    return dt.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })
  }

  const confirmados = escalas.filter(e => e.status==='confirmado').length
  const pendentes   = escalas.filter(e => e.status==='pendente').length
  const ausentes    = escalas.filter(e => e.status==='ausente').length

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif' }}>
      {editing !== null && (
        <EscalaModal
          escala={editing === 'new' ? null : editing}
          members={members}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Escalas</h1>
          <p className="page-sub">{escalas.length} escalonamentos · {confirmados} confirmados</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>+</span> Adicionar à escala
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
        {[
          { label:'Confirmados', value:confirmados, color:'#52B788' },
          { label:'Pendentes',   value:pendentes,   color:'#D4A84B' },
          { label:'Ausentes',    value:ausentes,    color:'#E07A8A' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ fontWeight:900, fontSize:32, color:k.color, letterSpacing:'-1px', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.gray3, marginTop:6, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <input className="field" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ maxWidth:180 }} />
        <select className="field" value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} style={{ maxWidth:160, cursor:'pointer' }}>
          <option value="todos">Todos os status</option>
          {STATUS_OPTS.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
        </select>
        {(filterDate || filterStatus !== 'todos') && (
          <button onClick={() => { setFilterDate(''); setFilterStatus('todos') }} style={{ background:'none', border:`1px solid ${C.lineHi}`, borderRadius:5, padding:'0 14px', color:C.gray2, fontSize:13, cursor:'pointer', minHeight:48, fontFamily:'"Inter",system-ui,sans-serif', display:'inline-flex', alignItems:'center', gap:6 }}>
            Limpar <Icons.close size={13} />
          </button>
        )}
      </div>

      {/* Lista agrupada por data */}
      {loading ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}>
          <div className="spinner" style={{ margin:'0 auto' }} />
          <p style={{ color:C.gray3, marginTop:14, fontSize:14 }}>Carregando escalas...</p>
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="card" style={{ padding:'56px 24px', textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12, color:C.gray3 }}><ClipboardList size={36} strokeWidth={1.5} /></div>
          <div style={{ fontSize:16, color:C.white, fontWeight:700, marginBottom:8 }}>Nenhuma escala encontrada</div>
          <p style={{ fontSize:14, color:C.gray3, marginBottom:20 }}>Comece adicionando membros à escala dos próximos cultos.</p>
          <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'11px 24px' }}>+ Adicionar primeiro</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sortedDates.map(date => (
            <div key={date}>
              {/* Header da data */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:15, color:C.white, textTransform:'capitalize' }}>{formatDate(date)}</div>
                <div style={{ flex:1, height:1, background:C.line }} />
                <span style={{ fontSize:12, color:C.gray3 }}>{byDate[date].length} escalonados</span>
              </div>

              {/* Cards dos membros */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:8 }}>
                {byDate[date].map(e => {
                  const badge = STATUS_BADGE[e.status as EscalaStatus]
                  return (
                    <div key={e.id} style={{ background:C.bg2, border:`1px solid ${C.line}`, borderRadius:8, padding:'16px', display:'flex', flexDirection:'column', gap:10 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},${C.primaryL})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:C.white, flexShrink:0 }}>
                          {e.memberName[0].toUpperCase()}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14, color:C.white }}>{e.memberName}</div>
                          <div style={{ fontSize:12, color:C.gray3 }}>{e.funcao} · {e.time}</div>
                        </div>
                        <span style={{ background:badge.bg, color:badge.color, fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:3, textTransform:'uppercase', letterSpacing:'1px', flexShrink:0 }}>{e.status}</span>
                      </div>

                      {/* Botões de status rápido */}
                      <div style={{ display:'flex', gap:6 }}>
                        {STATUS_OPTS.filter(s => s !== e.status).map(s => {
                          const b = STATUS_BADGE[s]
                          return (
                            <button key={s} onClick={() => updateStatus(e.id, s)} style={{ flex:1, padding:'6px 4px', borderRadius:4, border:`1px solid ${b.color}22`, background:`${b.color}0A`, color:b.color, fontSize:11, fontWeight:600, cursor:'pointer', textTransform:'capitalize', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}
                              onMouseEnter={ev => (ev.currentTarget.style.background=b.bg)}
                              onMouseLeave={ev => (ev.currentTarget.style.background=`${b.color}0A`)}
                            >{s}</button>
                          )
                        })}
                        <button onClick={() => setEditing(e)} style={{ padding:'6px 10px', borderRadius:4, border:`1px solid ${C.lineHi}`, background:'none', color:C.gray2, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', display:'flex', alignItems:'center', justifyContent:'center' }}><Pencil size={13} strokeWidth={1.75} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
