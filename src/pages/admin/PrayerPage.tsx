import { useEffect, useState } from 'react'
import { addDoc, updateDoc, doc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import type { PrayerRequest, PrayerCategory } from '@/types'

const CATEGORIES: { key: PrayerCategory; label: string; emoji: string; color: string }[] = [
  { key:'cura',       label:'Cura',        emoji:'💊', color:'#52B788' },
  { key:'familia',    label:'Família',     emoji:'👨‍👩‍👧', color:'#E06A2C' },
  { key:'provisao',   label:'Provisão',    emoji:'💰', color:'#D4A84B' },
  { key:'libertacao', label:'Libertação',  emoji:'🕊', color:'#5B9EC9' },
  { key:'gratidao',   label:'Gratidão',    emoji:'🙏', color:'#9b59b6' },
  { key:'outro',      label:'Outro',       emoji:'✦',  color:'#B09880' },
]
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]))

function NewPrayerModal({ onClose, onSave }: { onClose: () => void; onSave: (text:string, cat:PrayerCategory, anon:boolean, name:string) => Promise<void> }) {
  const { appUser } = useAuth()
  const [text, setText]     = useState('')
  const [cat, setCat]       = useState<PrayerCategory>('outro')
  const [anon, setAnon]     = useState(false)
  const [name, setName]     = useState(appUser?.displayName ?? '')
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    try { await onSave(text, cat, anon, name); onClose() }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'36px 32px', maxWidth:480, width:'100%', position:'relative', fontFamily:'"Inter",system-ui,sans-serif' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.primary},transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.gray2, fontSize:20, cursor:'pointer' }}>✕</button>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>Pedido de Oração</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C.white, marginBottom:24 }}>Registrar pedido</h3>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Categoria</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c.key} type="button" onClick={() => setCat(c.key)} style={{ padding:'7px 14px', borderRadius:5, border:`1px solid ${cat===c.key ? c.color : C.line}`, background: cat===c.key ? `${c.color}18` : C.bg3, color: cat===c.key ? c.color : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Pedido *</label>
            <textarea className="field" placeholder="Descreva o pedido de oração..." value={text} onChange={e => setText(e.target.value)} rows={4} style={{ resize:'vertical', minHeight:100 }} required />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Nome</label>
            <input className="field" placeholder="Nome de quem pede" value={name} onChange={e => setName(e.target.value)} disabled={anon} style={{ opacity:anon ? 0.4 : 1 }} />
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} style={{ width:16, height:16, accentColor:C.primary }} />
            <span style={{ fontSize:14, color:C.gray2 }}>Pedido anônimo</span>
          </label>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex:1, fontSize:15, padding:'13px', minHeight:48 }}>{saving ? 'Registrando...' : 'Registrar pedido'}</button>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding:'13px 20px', minHeight:48 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PrayerPage() {
  const { appUser } = useAuth()
  const [prayers, setPrayers]   = useState<PrayerRequest[]>([])
  const [loading, setLoading]   = useState(true)
  const [showNew, setShowNew]   = useState(false)
  const [filterCat, setFilterCat] = useState<PrayerCategory | 'todos'>('todos')
  const [showAnswered, setShowAnswered] = useState(false)

  useEffect(() => {
    getDocs(query(collection(db,'prayers'), orderBy('createdAt','desc')))
      .then(s => setPrayers(s.docs.map(d => ({ id:d.id, ...d.data() } as PrayerRequest))))
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSave(text: string, cat: PrayerCategory, anon: boolean, name: string) {
    const payload = { text, category:cat, anonymous:anon, authorName: anon ? 'Anônimo' : name, authorUid: appUser?.uid ?? null, prayerCount:0, answered:false, createdAt:serverTimestamp() }
    const ref = await addDoc(collection(db,'prayers'), payload)
    setPrayers(prev => [{ id:ref.id, ...payload, createdAt:'' } as PrayerRequest, ...prev])
  }

  async function pray(id: string, current: number) {
    await updateDoc(doc(db,'prayers',id), { prayerCount: current+1 })
    setPrayers(prev => prev.map(p => p.id===id ? { ...p, prayerCount: current+1 } : p))
  }

  async function markAnswered(id: string) {
    await updateDoc(doc(db,'prayers',id), { answered:true })
    setPrayers(prev => prev.map(p => p.id===id ? { ...p, answered:true } : p))
  }

  const filtered = prayers.filter(p => {
    const matchCat      = filterCat === 'todos' || p.category === filterCat
    const matchAnswered = showAnswered ? true : !p.answered
    return matchCat && matchAnswered
  })

  const ativos     = prayers.filter(p => !p.answered).length
  const respondidos = prayers.filter(p => p.answered).length
  const totalPrays = prayers.reduce((a,p) => a + p.prayerCount, 0)

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif' }}>
      {showNew && <NewPrayerModal onClose={() => setShowNew(false)} onSave={handleSave} />}

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Pedidos de Oração</h1>
          <p className="page-sub">{ativos} ativos · {respondidos} respondidos</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary" style={{ fontSize:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>+</span> Registrar pedido
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
        {[
          { label:'Pedidos ativos',    value:ativos,      color:C.primary },
          { label:'Respondidos',       value:respondidos, color:'#52B788' },
          { label:'Orações enviadas',  value:totalPrays,  color:'#D4A84B' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ fontWeight:900, fontSize:32, color:k.color, letterSpacing:'-1px', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.gray3, marginTop:6, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <button onClick={() => setFilterCat('todos')} style={{ padding:'7px 16px', borderRadius:5, border:`1px solid ${filterCat==='todos' ? C.primary : C.lineHi}`, background: filterCat==='todos' ? 'rgba(196,82,26,0.1)' : 'none', color: filterCat==='todos' ? C.primaryL : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', minHeight:40 }}>Todos</button>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilterCat(c.key)} style={{ padding:'7px 14px', borderRadius:5, border:`1px solid ${filterCat===c.key ? c.color : C.lineHi}`, background: filterCat===c.key ? `${c.color}18` : 'none', color: filterCat===c.key ? c.color : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', minHeight:40 }}>
            {c.emoji} {c.label}
          </button>
        ))}
        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', marginLeft:'auto' }}>
          <input type="checkbox" checked={showAnswered} onChange={e => setShowAnswered(e.target.checked)} style={{ width:15, height:15, accentColor:C.primary }} />
          <span style={{ fontSize:13, color:C.gray2 }}>Ver respondidos</span>
        </label>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding:'48px 24px', textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🙏</div>
          <div style={{ fontSize:15, color:C.white, fontWeight:700, marginBottom:6 }}>Nenhum pedido encontrado</div>
          <p style={{ fontSize:13, color:C.gray3 }}>Registre o primeiro pedido de oração da comunidade.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(p => {
            const cat = CAT_MAP[p.category]
            return (
              <div key={p.id} style={{ background: p.answered ? `rgba(82,183,136,0.05)` : C.bg2, border:`1px solid ${p.answered ? 'rgba(82,183,136,0.2)' : C.line}`, borderRadius:8, padding:'20px', display:'flex', gap:16, transition:'border-color 0.2s' }}>
                {/* Cat icon */}
                <div style={{ width:42, height:42, borderRadius:8, background:`${cat.color}18`, border:`1px solid ${cat.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{cat.emoji}</div>

                {/* Conteúdo */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, fontSize:14, color:C.white }}>{p.anonymous ? 'Anônimo' : p.authorName}</span>
                    <span style={{ background:`${cat.color}18`, color:cat.color, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:3, letterSpacing:'1px', textTransform:'uppercase' }}>{cat.label}</span>
                    {p.answered && <span style={{ background:'rgba(82,183,136,0.15)', color:'#52B788', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:3, letterSpacing:'1px', textTransform:'uppercase' }}>✓ Respondido</span>}
                  </div>
                  <p style={{ fontSize:15, color:C.gray1, lineHeight:1.75, marginBottom:12 }}>{p.text}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <button onClick={() => pray(p.id, p.prayerCount)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:`1px solid ${C.lineHi}`, borderRadius:5, padding:'6px 14px', color:C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primaryL }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=C.lineHi; e.currentTarget.style.color=C.gray2 }}
                    >🙏 Orar · {p.prayerCount}</button>
                    {!p.answered && (
                      <button onClick={() => markAnswered(p.id)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(82,183,136,0.3)', borderRadius:5, padding:'6px 14px', color:'#52B788', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif' }}>
                        ✓ Marcar respondido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
