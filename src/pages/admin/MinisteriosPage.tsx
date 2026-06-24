import { useEffect, useState } from 'react'
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { C } from '@/lib/tokens'
import { Icons } from '@/components/ui/icons'
import { MINISTRY_ICONS, getIconByKey, resolveIconKey } from '@/lib/iconCatalog'
import type { Ministerio } from '@/types'

interface MinForm { name: string; description: string; iconKey: string; liderUid: string }
const EMPTY: MinForm = { name:'', description:'', iconKey:'church', liderUid:'' }

function MinisterioModal({ min, onClose, onSave }: { min: Ministerio | null; onClose: () => void; onSave: (f: MinForm, id?: string) => Promise<void> }) {
  const [form, setForm]   = useState<MinForm>(min ? { name:min.name, description:min.description, iconKey:resolveIconKey(min), liderUid:min.liderUid ?? '' } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set<K extends keyof MinForm>(k: K, v: MinForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nome é obrigatório.'); return }
    setSaving(true)
    try { await onSave(form, min?.id); onClose() }
    catch { setError('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'36px 32px', maxWidth:500, width:'100%', position:'relative', fontFamily:'"Inter",system-ui,sans-serif', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.primary},transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.gray2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', width:32, height:32 }}>
          <Icons.close size={18} />
        </button>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>{min ? 'Editar' : 'Novo'} Ministério</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C.white, marginBottom:24 }}>{min ? min.name : 'Criar ministério'}</h3>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:8 }}>Ícone</label>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {MINISTRY_ICONS.map(({ key, Icon }) => (
                <button key={key} type="button" onClick={() => set('iconKey', key)} style={{ width:38, height:38, borderRadius:7, border:`2px solid ${form.iconKey===key ? C.primary : C.line}`, background: form.iconKey===key ? 'rgba(196,82,26,0.15)' : C.bg3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', color: form.iconKey===key ? C.primaryL : C.gray2 }}>
                  <Icon size={18} strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Nome *</label>
            <input className="field" placeholder="Ex: Ministério de Louvor" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Descrição</label>
            <textarea className="field" placeholder="Descreva o propósito deste ministério..." value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ resize:'vertical', minHeight:80 }} />
          </div>
          {error && <div style={{ background:'rgba(181,72,90,0.12)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#E07A8A' }}>{error}</div>}
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex:1, fontSize:15, padding:'13px', minHeight:48 }}>{saving ? 'Salvando...' : min ? 'Salvar' : 'Criar ministério'}</button>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding:'13px 20px', minHeight:48 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MinisteriosPage() {
  const [mins, setMins]       = useState<Ministerio[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Ministerio | null | 'new'>(null)

  useEffect(() => {
    getDocs(query(collection(db,'ministerios'), orderBy('name')))
      .then(s => setMins(s.docs.map(d => ({ id:d.id, ...d.data() } as Ministerio))))
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSave(form: MinForm, id?: string) {
    const payload = { name:form.name.trim(), description:form.description.trim(), iconKey:form.iconKey, liderUid:form.liderUid || null, active:true }
    if (id) {
      await updateDoc(doc(db,'ministerios',id), payload)
      setMins(prev => prev.map(m => m.id===id ? { ...m, ...payload } : m))
    } else {
      const ref = await addDoc(collection(db,'ministerios'), { ...payload, membersCount:0, createdAt:serverTimestamp() })
      setMins(prev => [...prev, { id:ref.id, ...payload, membersCount:0, createdAt:'' } as Ministerio].sort((a,b) => a.name.localeCompare(b.name)))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este ministério?')) return
    await deleteDoc(doc(db,'ministerios',id))
    setMins(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif' }}>
      {editing !== null && <MinisterioModal min={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} />}

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Ministérios</h1>
          <p className="page-sub">{mins.length} ministérios ativos</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <Icons.plus size={16} /> Novo ministério
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
      ) : mins.length === 0 ? (
        <div className="card" style={{ padding:'56px 24px', textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12, color:C.gray3 }}><Icons.ministry size={40} /></div>
          <div style={{ fontSize:16, color:C.white, fontWeight:700, marginBottom:8 }}>Nenhum ministério criado</div>
          <p style={{ fontSize:14, color:C.gray3, marginBottom:20 }}>Crie os ministérios da sua igreja para organizar membros e escalas.</p>
          <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'11px 24px', display:'inline-flex', alignItems:'center', gap:8 }}><Icons.plus size={15} /> Criar primeiro ministério</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:12 }}>
          {mins.map(m => {
            const MinIcon = getIconByKey(resolveIconKey(m))
            return (
            <div key={m.id} style={{ background:C.bg2, border:`1px solid ${C.line}`, borderRadius:10, overflow:'hidden', transition:'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor=C.lineHi)}
              onMouseLeave={e => (e.currentTarget.style.borderColor=C.line)}
            >
              <div style={{ height:80, background:`linear-gradient(160deg,${C.bg3},rgba(196,82,26,0.1))`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primaryL }}>
                <MinIcon size={36} strokeWidth={1.5} />
              </div>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ fontWeight:800, fontSize:16, color:C.white, marginBottom:6 }}>{m.name}</div>
                <p style={{ fontSize:13, color:C.gray2, lineHeight:1.7, marginBottom:14, minHeight:38 }}>{m.description || 'Sem descrição.'}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:C.gray3, display:'flex', alignItems:'center', gap:5 }}><Icons.users size={13} /> {m.membersCount ?? 0} membros</span>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setEditing(m)} style={{ background:'none', border:`1px solid ${C.lineHi}`, borderRadius:5, padding:'6px 12px', color:C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primaryL }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=C.lineHi; e.currentTarget.style.color=C.gray2 }}
                    >Editar</button>
                    <button onClick={() => handleDelete(m.id)} style={{ width:32, height:32, background:'none', border:`1px solid ${C.line}`, borderRadius:5, color:C.gray3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(181,72,90,0.4)'; e.currentTarget.style.color='#E07A8A' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=C.line; e.currentTarget.style.color=C.gray3 }}
                    ><Icons.trash size={15} /></button>
                  </div>
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
