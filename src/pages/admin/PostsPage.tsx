import { useEffect, useState } from 'react'
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import type { Post, PostCategory } from '@/types'

const CATS: { key: PostCategory; label: string; color: string; emoji: string }[] = [
  { key:'palavra',     label:'Palavra',     color:'#C4521A', emoji:'📖' },
  { key:'eventos',     label:'Eventos',     color:'#D4A84B', emoji:'📅' },
  { key:'oracao',      label:'Oração',      color:'#5B9EC9', emoji:'🙏' },
  { key:'aviso',       label:'Aviso',       color:'#E07A8A', emoji:'📢' },
  { key:'testemunho',  label:'Testemunho',  color:'#52B788', emoji:'✦' },
]
const CAT_MAP = Object.fromEntries(CATS.map(c => [c.key, c]))

interface PostForm { title: string; body: string; category: PostCategory; published: boolean }
const EMPTY: PostForm = { title:'', body:'', category:'aviso', published:false }

function PostModal({ post, onClose, onSave }: { post: Post | null; onClose: () => void; onSave: (f: PostForm, id?: string) => Promise<void> }) {
  const [form, setForm]   = useState<PostForm>(post ? { title:post.title, body:post.body, category:post.category, published:post.published } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set<K extends keyof PostForm>(k: K, v: PostForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Título é obrigatório.'); return }
    if (!form.body.trim())  { setError('Conteúdo é obrigatório.'); return }
    setSaving(true)
    try { await onSave(form, post?.id); onClose() }
    catch { setError('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'36px 32px', maxWidth:580, width:'100%', position:'relative', fontFamily:'"Inter",system-ui,sans-serif', maxHeight:'92vh', overflowY:'auto' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.primary},transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.gray2, fontSize:20, cursor:'pointer' }}>✕</button>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>{post ? 'Editar' : 'Novo'} Comunicado</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:C.white, marginBottom:24 }}>{post ? post.title : 'Criar comunicado'}</h3>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:8 }}>Categoria</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {CATS.map(c => (
                <button key={c.key} type="button" onClick={() => set('category', c.key)} style={{ padding:'7px 14px', borderRadius:5, border:`1px solid ${form.category===c.key ? c.color : C.line}`, background: form.category===c.key ? `${c.color}18` : C.bg3, color: form.category===c.key ? c.color : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Título *</label>
            <input className="field" placeholder="Título do comunicado" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, display:'block', marginBottom:7 }}>Conteúdo *</label>
            <textarea className="field" placeholder="Escreva o comunicado aqui..." value={form.body} onChange={e => set('body', e.target.value)} rows={6} style={{ resize:'vertical', minHeight:140 }} required />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {[
              { val:false, label:'💾 Rascunho' },
              { val:true,  label:'📢 Publicar agora' },
            ].map(opt => (
              <button key={String(opt.val)} type="button" onClick={() => set('published', opt.val)} style={{ flex:1, padding:'10px', borderRadius:6, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', fontWeight:700, fontSize:14, border:`1px solid ${form.published===opt.val ? C.primary : C.line}`, background: form.published===opt.val ? 'rgba(196,82,26,0.1)' : C.bg3, color: form.published===opt.val ? C.primaryL : C.gray2, transition:'all 0.15s' }}>
                {opt.label}
              </button>
            ))}
          </div>
          {error && <div style={{ background:'rgba(181,72,90,0.12)', border:'1px solid rgba(181,72,90,0.3)', borderRadius:5, padding:'10px 14px', fontSize:14, color:'#E07A8A' }}>{error}</div>}
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex:1, fontSize:15, padding:'13px', minHeight:48 }}>{saving ? 'Salvando...' : post ? 'Salvar' : 'Criar comunicado'}</button>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding:'13px 20px', minHeight:48 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PostsPage() {
  const { appUser } = useAuth()
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Post | null | 'new'>(null)
  const [filterCat, setFilter] = useState<PostCategory | 'todos'>('todos')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    getDocs(query(collection(db,'posts'), orderBy('createdAt','desc')))
      .then(s => setPosts(s.docs.map(d => ({ id:d.id, ...d.data() } as Post))))
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSave(form: PostForm, id?: string) {
    const payload = { title:form.title.trim(), body:form.body.trim(), category:form.category, published:form.published, authorUid:appUser?.uid ?? '', authorName:appUser?.displayName ?? '', imageUrl:null, updatedAt:serverTimestamp() }
    if (id) {
      await updateDoc(doc(db,'posts',id), payload)
      setPosts(prev => prev.map(p => p.id===id ? { ...p, ...payload, updatedAt:'' } : p))
    } else {
      const ref = await addDoc(collection(db,'posts'), { ...payload, likes:0, createdAt:serverTimestamp() })
      setPosts(prev => [{ id:ref.id, ...payload, likes:0, createdAt:'', updatedAt:'' } as Post, ...prev])
    }
  }

  async function togglePublish(post: Post) {
    const published = !post.published
    await updateDoc(doc(db,'posts',post.id), { published, updatedAt:serverTimestamp() })
    setPosts(prev => prev.map(p => p.id===post.id ? { ...p, published } : p))
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar este comunicado?')) return
    await deleteDoc(doc(db,'posts',id))
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = posts.filter(p => {
    const matchCat    = filterCat === 'todos' || p.category === filterCat
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const publicados = posts.filter(p => p.published).length
  const rascunhos  = posts.filter(p => !p.published).length

  return (
    <div style={{ fontFamily:'"Inter",system-ui,sans-serif' }}>
      {editing !== null && <PostModal post={editing==='new' ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} />}

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Comunicados</h1>
          <p className="page-sub">{publicados} publicados · {rascunhos} rascunhos</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>+</span> Novo comunicado
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
        {[
          { label:'Total',       value:posts.length,  color:C.white },
          { label:'Publicados',  value:publicados,    color:'#52B788' },
          { label:'Rascunhos',   value:rascunhos,     color:'#D4A84B' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ fontWeight:900, fontSize:32, color:k.color, letterSpacing:'-1px', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.gray3, marginTop:6, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <input className="field" placeholder="🔍 Buscar comunicado..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:240 }} />
        <button onClick={() => setFilter('todos')} style={{ padding:'7px 16px', borderRadius:5, border:`1px solid ${filterCat==='todos' ? C.primary : C.lineHi}`, background: filterCat==='todos' ? 'rgba(196,82,26,0.1)' : 'none', color: filterCat==='todos' ? C.primaryL : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', minHeight:44 }}>Todos</button>
        {CATS.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)} style={{ padding:'7px 14px', borderRadius:5, border:`1px solid ${filterCat===c.key ? c.color : C.lineHi}`, background: filterCat===c.key ? `${c.color}18` : 'none', color: filterCat===c.key ? c.color : C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', minHeight:44 }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding:'48px 24px', textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📢</div>
          <div style={{ fontSize:15, color:C.white, fontWeight:700, marginBottom:6 }}>Nenhum comunicado</div>
          <p style={{ fontSize:13, color:C.gray3, marginBottom:16 }}>Crie o primeiro comunicado da comunidade Sozo.</p>
          <button onClick={() => setEditing('new')} className="btn-primary" style={{ fontSize:14, padding:'11px 24px' }}>+ Criar comunicado</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(post => {
            const cat = CAT_MAP[post.category]
            return (
              <div key={post.id} style={{ background:C.bg2, border:`1px solid ${post.published ? C.lineHi : C.line}`, borderRadius:8, padding:'20px', display:'flex', gap:16, transition:'border-color 0.2s' }}>
                <div style={{ width:44, height:44, borderRadius:8, background:`${cat.color}18`, border:`1px solid ${cat.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{cat.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:800, fontSize:15, color:C.white }}>{post.title}</span>
                    <span style={{ background:`${cat.color}18`, color:cat.color, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:3, letterSpacing:'1px', textTransform:'uppercase' }}>{cat.label}</span>
                    <span style={{ background: post.published ? 'rgba(82,183,136,0.15)' : 'rgba(212,168,75,0.15)', color: post.published ? '#52B788' : '#D4A84B', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:3, letterSpacing:'1px', textTransform:'uppercase' }}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <p style={{ fontSize:14, color:C.gray2, lineHeight:1.7, marginBottom:12 }}>{post.body.slice(0,160)}{post.body.length>160 ? '...' : ''}</p>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => togglePublish(post)} style={{ padding:'6px 14px', borderRadius:5, border:`1px solid ${post.published ? 'rgba(212,168,75,0.3)' : 'rgba(82,183,136,0.3)'}`, background:'none', color: post.published ? '#D4A84B' : '#52B788', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif' }}>
                      {post.published ? '↓ Despublicar' : '↑ Publicar'}
                    </button>
                    <button onClick={() => setEditing(post)} style={{ padding:'6px 14px', borderRadius:5, border:`1px solid ${C.lineHi}`, background:'none', color:C.gray2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'"Inter",system-ui,sans-serif', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primaryL }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=C.lineHi; e.currentTarget.style.color=C.gray2 }}
                    >Editar</button>
                    <button onClick={() => handleDelete(post.id)} style={{ width:32, height:32, background:'none', border:`1px solid ${C.line}`, borderRadius:5, color:C.gray3, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(181,72,90,0.4)'; e.currentTarget.style.color='#E07A8A' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=C.line; e.currentTarget.style.color=C.gray3 }}
                    >🗑</button>
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
