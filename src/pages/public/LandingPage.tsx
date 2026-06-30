import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, GRAIN } from '@/lib/tokens'
import { FadeIn, Tag, H2, SozoLogo, BtnPrimary, BtnGhost } from '@/components/ui'
import { LiveBanner } from '@/components/ui/LiveBanner'
import { PiInstagramLogoFill, PiInstagramLogoThin } from "react-icons/pi";

// ─────────────────────────────────────────────
//  SVGs inline — sem dependência de catálogo externo.
//  Cada ícone é uma função simples que retorna <svg>.
//  Não há objeto/propriedade que possa ser undefined.
// ─────────────────────────────────────────────
function IconArrowRight({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
}
function IconArrowLeft({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
}
function IconClose({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
}
function IconMenu({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
}
function IconMapPin({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
}
function IconCoffee({ size = 32 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
}
function IconSparkle({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z" /></svg>
}
function IconHeart({ size = 16, filled = false }: { size?: number; filled?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
}
function IconCheck({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
}
function IconCross({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M5 9h14" /></svg>
}
function IconFlame({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 17a2.5 2.5 0 002.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 11-15 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>
}
function IconDove({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7h.01M3.4 18a8.8 8.8 0 0 0 8.6 1c5-1.5 7-7 6-12-2.5 1-4.5 3.5-5 6L4 5l3 8-3.6 5z" /></svg>
}
function IconMusic({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
}
function IconCrown({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h20M2 18l2-9 5 5 3-9 3 9 5-5 2 9" /></svg>
}
function IconDroplet({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69s5 5.32 5 9.31a5 5 0 1 1-10 0c0-4 5-9.31 5-9.31z" /></svg>
}
function IconParty({ size = 72 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3 2 22l10.7-3.8M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-7.5 7.5M2 14l1.5-1.5" /></svg>
}

// Mapa de iconKey → componente — substitui o iconCatalog.tsx
const GALLERY_ICONS: Record<string, (p: { size?: number }) => JSX.Element> = {
  cross: IconCross, flame: IconFlame, dove: IconDove, heart: IconHeart,
  music: IconMusic, crown: IconCrown, water: IconDroplet, party: IconParty,
}
function GalleryIcon({ iconKey, size }: { iconKey: string; size?: number }) {
  const Comp = GALLERY_ICONS[iconKey] ?? IconSparkle
  return <Comp size={size} />
}

// ─── Dados ────────────────────────────────────
const CYCLE = [
  { n:'01', name:'CONECTAR',    sub:'Ser visto.',         desc:'Aqui você não é só mais um — você é conhecido, acolhido e valorizado.' },
  { n:'02', name:'CAMINHAR',    sub:'Não andar sozinho.', desc:'Crescemos juntos, aprendendo a viver a fé no dia a dia.' },
  { n:'03', name:'CUIDAR',      sub:'Responsabilidade.',  desc:'Acreditamos em um ambiente seguro, onde vidas são tratadas com amor, verdade e graça.' },
  { n:'04', name:'MULTIPLICAR', sub:'Gerar outros.',      desc:'Todo discípulo é chamado a discipular — porque vida gera vida.' },
]
const VALORES = [
  'Cristocentrismo radical',
  'Discipulado relacional e intencional',
  'Fidelidade bíblica',
  'Cultura de cuidado',
  'Ação social mensurável',
  'Excelência para a glória de Deus',
]
const PILARES = [
  { word:'SALVAR',   ref:'João 3:16',    desc:'Proclamar o Evangelho com clareza e amor, conduzindo pessoas à fé salvadora.' },
  { word:'CURAR',    ref:'Romanos 12:2', desc:'Promover saúde espiritual, emocional e mental pela renovação da mente.' },
  { word:'LIBERTAR', ref:'Lucas 4:18',   desc:'Quebrar cativeiros e padrões destrutivos pelo poder do Espírito Santo.' },
]
const EVENTOS = [
  { day:'07', month:'Jun', sub:'Sozo Next',           title:'Congresso da Juventude',  time:'19h00', local:'Igreja Principal',  free:true },
  { day:'14', month:'Jun', sub:'Toda a família',       title:'Vigília de Pentecostes',  time:'23h00', local:'Salão Principal',   free:false },
  { day:'21', month:'Jun', sub:'Ministério de Louvor', title:'Conferência de Adoração', time:'18h30', local:'Residencial Oeste', free:true },
  { day:'29', month:'Jun', sub:'Sozo Comunidade',      title:'Culto de Aniversário',    time:'19h00', local:'Igreja Principal',  free:true },
]
const GALERIA = [
  { id:1, label:'Culto de Domingo',        sub:'19h30 · Residencial Oeste', grad:'linear-gradient(160deg,#2a0800 0%,#7a1e00 50%,#c4521a 100%)', iconKey:'cross' },
  { id:2, label:'Congresso da Juventude',  sub:'Sozo Next 2024',            grad:'linear-gradient(160deg,#06041a 0%,#1a0e3d 50%,#4a20a0 100%)', iconKey:'flame' },
  { id:3, label:'Vigília de Pentecostes',  sub:'Alta madrugada',            grad:'linear-gradient(160deg,#020c1a 0%,#073d5c 50%,#1a7aa0 100%)', iconKey:'dove' },
  { id:4, label:'Encontro de Casais',      sub:'Sozo Família',              grad:'linear-gradient(160deg,#1a0208 0%,#5c1020 50%,#a02040 100%)', iconKey:'heart' },
  { id:5, label:'Conferência de Adoração', sub:'Ministério de Louvor',      grad:'linear-gradient(160deg,#0a1002 0%,#2d4a08 50%,#5a8c14 100%)', iconKey:'music' },
  { id:6, label:'Retiro de Líderes',       sub:'Formação e missão',         grad:'linear-gradient(160deg,#100a02 0%,#4a3008 50%,#d4a84b 100%)', iconKey:'crown' },
  { id:7, label:'Batismos nas Águas',      sub:'Testemunho de fé',          grad:'linear-gradient(160deg,#020a14 0%,#0a3050 50%,#1a6090 100%)', iconKey:'water' },
  { id:8, label:'Culto de Aniversário',    sub:'Sozo Comunidade',           grad:'linear-gradient(160deg,#140802 0%,#7a2808 50%,#e06a2c 100%)', iconKey:'party' },
]
const TWEETS = [
  { init:'S', name:'Sozo Comunidade', handle:'@sozobrasilia', verified:true,  time:'2h', cat:'Palavra',
    text:'Hoje no culto: "Você não foi criado para carregar o peso sozinho. O fardo é leve quando caminhamos juntos." Uma noite de libertação e cura. Obrigado a todos que estiveram presentes.',
    likes:94, reposts:18, comments:12 },
  { init:'N', name:'Sozo Next', handle:'@sozonext', verified:false, time:'4h', cat:'Jovens',
    text:'CONGRESSO DA JUVENTUDE 2025 — Inscrições abertas! 3 noites de adoração, palavra e comunhão. Entrada totalmente gratuita. Chama seus amigos — esse momento pode mudar uma vida.',
    likes:147, reposts:63, comments:32, destaque:true },
  { init:'I', name:'Intercessão Sozo', handle:'@sozooracao', verified:false, time:'1d', cat:'Testemunho',
    text:'Deus é fiel. Com imensa gratidão: após semanas de oração coletiva, recebemos a notícia de cura e restauração. Continuem enviando seus pedidos — respondemos a cada um.',
    likes:203, reposts:47, comments:0 },
  { init:'P', name:'Pastor Sozo', handle:'@pastorsozo', verified:true, time:'1d', cat:'Devocional',
    text:'Romanos 12:2 — "Não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente." Discipulado é isso: renovação contínua. Todo dia. Em cada relação. Vida na vida.',
    likes:178, reposts:52, comments:21 },
  { init:'F', name:'Sozo Família', handle:'@sozofamilia', verified:false, time:'2d', cat:'Família',
    text:'Encontro de casais confirmado para Julho. Um fim de semana para restaurar, aprofundar e celebrar o amor. Vagas limitadas — inscrições pelo link na bio.',
    likes:89, reposts:34, comments:15 },
  { init:'K', name:'Sozo Kids', handle:'@sozokids', verified:false, time:'3d', cat:'Kids',
    text:'As crianças também têm um lugar no coração de Deus. Nosso ministério Kids acontece todo domingo. Um ambiente seguro, lúdico e cheio do Espírito para os pequenos.',
    likes:116, reposts:29, comments:8 },
]

// ─── Carrossel ───────────────────────────────
function Carousel() {
  const [active, setActive] = useState(0)
  const [drag, setDrag]     = useState<number | null>(null)
  const [liked, setLiked]   = useState<Set<number>>(new Set())
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => setActive(i => (i + 1) % GALERIA.length), [])
  const prev = useCallback(() => setActive(i => (i - 1 + GALERIA.length) % GALERIA.length), [])
  const startAuto = useCallback(() => { timer.current = setInterval(next, 4500) }, [next])
  const stopAuto  = useCallback(() => { if (timer.current) clearInterval(timer.current) }, [])

  useEffect(() => { startAuto(); return stopAuto }, [startAuto, stopAuto])

  function onTouchStart(e: React.TouchEvent) { setDrag(e.touches[0].clientX) }
  function onTouchEnd(e: React.TouchEvent) {
    if (drag === null) return
    const diff = drag - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    setDrag(null)
  }

  const item = GALERIA[active]

  return (
    <div onMouseEnter={stopAuto} onMouseLeave={startAuto} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position:'relative', userSelect:'none' }}>
      <div style={{ position:'relative', height:480, borderRadius:10, overflow:'hidden', background:item.grad, transition:'background 0.6s ease' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:GRAIN, backgroundSize:'300px', opacity:0.06, mixBlendMode:'overlay', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.06), transparent)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:32, top:32, opacity:0.18, lineHeight:1, pointerEvents:'none', filter:'blur(1px)', color:C.white }}>
          <GalleryIcon iconKey={item.iconKey} size={96} />
        </div>
        <div style={{ position:'absolute', left:36, top:28, fontWeight:900, fontSize:13, color:'rgba(255,255,255,0.2)', letterSpacing:'3px' }}>
          {String(active + 1).padStart(2,'0')} / {String(GALERIA.length).padStart(2,'0')}
        </div>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.92)' }}>
          <GalleryIcon iconKey={item.iconKey} size={72} />
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:6 }}>Galeria · Sozo</div>
            <div style={{ fontWeight:900, fontSize:22, color:C.white, letterSpacing:'-0.5px', lineHeight:1.2 }}>{item.label}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', marginTop:4 }}>{item.sub}</div>
          </div>
          <button
            onClick={() => setLiked(s => { const n = new Set(s); n.has(active) ? n.delete(active) : n.add(active); return n })}
            style={{ background:'rgba(0,0,0,0.45)', border:`1px solid ${liked.has(active) ? C.primary : 'rgba(255,255,255,0.15)'}`, borderRadius:40, padding:'8px 16px', display:'flex', alignItems:'center', gap:7, cursor:'pointer', color: liked.has(active) ? C.primaryL : 'rgba(255,255,255,0.6)', fontSize:14, fontWeight:600, backdropFilter:'blur(8px)', transition:'all 0.2s' }}
          >
            <IconHeart size={16} filled={liked.has(active)} />
            {liked.has(active) ? 'Curtido' : 'Curtir'}
          </button>
        </div>
        {['prev','next'].map(dir => (
          <button
            key={dir}
            onClick={dir === 'prev' ? prev : next}
            aria-label={dir === 'prev' ? 'Anterior' : 'Próximo'}
            style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', [dir === 'prev' ? 'left' : 'right']: 16, width:44, height:44, borderRadius:'50%', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', border:`1px solid rgba(255,255,255,0.12)`, color:'rgba(255,255,255,0.8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=C.primaryD; e.currentTarget.style.borderColor=C.primary }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}
          >
            {dir === 'prev' ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:18 }}>
        {GALERIA.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} style={{ width: i === active ? 28 : 6, height:6, borderRadius:3, background: i === active ? C.primary : C.lineHi, border:'none', cursor:'pointer', padding:0, transition:'all 0.35s ease' }} />
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginTop:14, overflowX:'auto', paddingBottom:4 }}>
        {GALERIA.map((g, i) => (
          <button key={g.id} onClick={() => setActive(i)} style={{ flexShrink:0, width:80, height:56, borderRadius:6, overflow:'hidden', background:g.grad, border:`2px solid ${i === active ? C.primary : 'transparent'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.85)', transition:'all 0.2s', opacity: i === active ? 1 : 0.5, transform: i === active ? 'scale(1.05)' : 'scale(1)' }}
            onMouseEnter={e => { if (i !== active) e.currentTarget.style.opacity='0.8' }}
            onMouseLeave={e => { if (i !== active) e.currentTarget.style.opacity='0.5' }}
          >
            <GalleryIcon iconKey={g.iconKey} size={22} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Tweet card ──────────────────────────────
type Tweet = typeof TWEETS[0]

function TweetCard({ t, onOpen }: { t: Tweet; onOpen: () => void }) {
  const [liked,    setLiked]    = useState(false)
  const [reposted, setReposted] = useState(false)
  const [count,    setCount]    = useState({ l: t.likes, r: t.reposts })

  function toggleLike()   { setLiked(v => !v); setCount(c => ({ ...c, l: liked ? c.l - 1 : c.l + 1 })) }
  function toggleRepost() { setReposted(v => !v); setCount(c => ({ ...c, r: reposted ? c.r - 1 : c.r + 1 })) }

  const CAT_COLORS: Record<string, string> = {
    Palavra:'#C4521A', Jovens:'#9b59b6', Testemunho:'#D4A84B',
    Devocional:'#52B788', Família:'#E07A8A', Kids:'#5B9EC9',
  }
  const catColor = CAT_COLORS[t.cat] ?? C.primary
  const destaque = 'destaque' in t && t.destaque

  return (
    <div style={{
      background: destaque ? `linear-gradient(135deg, ${C.bg3} 0%, rgba(196,82,26,0.06) 100%)` : C.bg2,
      border:`1px solid ${destaque ? C.primaryD : C.line}`,
      borderRadius:10, padding:'20px', display:'flex', flexDirection:'column', gap:14,
      transition:'border-color 0.2s, transform 0.2s', cursor:'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = destaque ? C.primary : C.lineHi; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = destaque ? C.primaryD : C.line; e.currentTarget.style.transform='none' }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryL})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:17, color:C.white, flexShrink:0 }}>
          {t.init}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            <span style={{ fontWeight:700, fontSize:15, color:C.white }}>{t.name}</span>
            {t.verified && (
              <span title="Verificado" style={{ width:18, height:18, borderRadius:'50%', background:C.primary, display:'inline-flex', alignItems:'center', justifyContent:'center', color:C.white, flexShrink:0 }}>
                <IconCheck size={11} />
              </span>
            )}
            <span style={{ fontSize:13, color:C.gray3 }}>{t.handle}</span>
            <span style={{ fontSize:13, color:C.gray3 }}>·</span>
            <span style={{ fontSize:13, color:C.gray3 }}>{t.time}</span>
            <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:catColor, background:`${catColor}18`, padding:'3px 8px', borderRadius:3 }}>{t.cat}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize:15, color:C.gray1, lineHeight:1.75, margin:0 }}>{t.text}</p>
      <div style={{ display:'flex', alignItems:'center', gap:0, paddingTop:8, borderTop:`1px solid ${C.line}`, marginTop:'auto' }}>
        <button onClick={onOpen} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:C.gray3, fontSize:14, cursor:'pointer', padding:'6px 14px 6px 0', minHeight:36, transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color='#5B9EC9')} onMouseLeave={e => (e.currentTarget.style.color=C.gray3)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {t.comments > 0 && <span>{t.comments}</span>}
        </button>
        <button onClick={toggleRepost} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color: reposted ? '#52B788' : C.gray3, fontSize:14, cursor:'pointer', padding:'6px 14px', minHeight:36, transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color='#52B788')} onMouseLeave={e => (e.currentTarget.style.color = reposted ? '#52B788' : C.gray3)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          {count.r > 0 && <span>{count.r}</span>}
        </button>
        <button onClick={toggleLike} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color: liked ? C.primary : C.gray3, fontSize:14, cursor:'pointer', padding:'6px 14px', minHeight:36, transition:'color 0.2s, transform 0.15s', transform: liked ? 'scale(1.15)' : 'scale(1)' }}
          onMouseEnter={e => (e.currentTarget.style.color=C.primaryL)} onMouseLeave={e => (e.currentTarget.style.color = liked ? C.primary : C.gray3)}>
          <IconHeart size={16} filled={liked} />
          <span>{count.l}</span>
        </button>
        <button onClick={onOpen} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:C.gray3, fontSize:14, cursor:'pointer', padding:'6px 0 6px 14px', marginLeft:'auto', minHeight:36, transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color=C.white)} onMouseLeave={e => (e.currentTarget.style.color=C.gray3)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
      </div>
    </div>
  )
}

// ─── Modal de Login ──────────────────────────
function LoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(18px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.bg2, border:`1px solid ${C.lineHi}`, borderRadius:10, padding:'48px 44px', maxWidth:420, width:'100%', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${C.primary}, ${C.gold}, transparent)`, borderRadius:'10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:C.gray2, cursor:'pointer', minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4 }}>
          <IconClose size={20} />
        </button>
        <SozoLogo size={48} />
        <h3 style={{ marginTop:28, marginBottom:10, fontSize:24, fontWeight:900, color:C.white, letterSpacing:'-0.5px' }}>Entrar na comunidade</h3>
        <p style={{ fontSize:15, color:C.gray2, marginBottom:28, lineHeight:1.75 }}>Acesse para participar dos cultos, grupos e eventos.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input className="field" placeholder="E-mail ou celular" aria-label="E-mail" />
          <input className="field" type="password" placeholder="Senha" aria-label="Senha" />
          <button className="btn-primary" style={{ marginTop:4, fontSize:16, padding:'15px', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }} onClick={() => navigate('/login')}>
            Entrar <IconArrowRight size={15} />
          </button>
          <button className="btn-ghost" style={{ fontSize:15, padding:'14px' }} onClick={() => navigate('/login')}>Criar conta nova</button>
        </div>
      </div>
    </div>
  )
}

// ─── Page principal ──────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogin, setShowLogin]   = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  function goto(id: string) {
    setMobileOpen(false)
    setTimeout(() => document.querySelector(id)?.scrollIntoView({ behavior:'smooth' }), 50)
  }

  const open = () => setShowLogin(true)
  const navLinks: [string,string][] = [
    ['Início','#hero'],['Comunidade','#identidade'],['Cultos','#rotina'],['Eventos','#eventos'],['Galeria','#galeria'],
  ]

  return (
    <div style={{ background:C.bg, color:C.gray1, fontFamily:'"Inter",system-ui,sans-serif', overflowX:'hidden' }}>
      <div aria-hidden="true" style={{ position:'fixed', inset:0, zIndex:2, pointerEvents:'none', backgroundImage:GRAIN, backgroundRepeat:'repeat', backgroundSize:'300px 300px', opacity:0.038, mixBlendMode:'overlay' }} />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* ── NAV ─────────────────────────────── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6%', height:70, background: scrolled ? 'rgba(13,9,6,0.93)' : 'transparent', backdropFilter: scrolled ? 'blur(28px)' : 'none', borderBottom: scrolled ? `1px solid ${C.lineHi}` : 'none', transition:'all 0.35s ease' }}>
        <SozoLogo size={42} />
        <div style={{ display:'flex', gap:32, alignItems:'center' }} className="hide-mobile">
          {navLinks.map(([l,id]) => (
            <button key={id} onClick={() => goto(id)} style={{ background:'none', border:'none', color:C.gray2, fontSize:15, fontWeight:500, cursor:'pointer', transition:'color 0.2s', padding:'8px 4px', minHeight:44 }}
              onMouseEnter={e => (e.currentTarget.style.color=C.white)} onMouseLeave={e => (e.currentTarget.style.color=C.gray2)}>{l}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button onClick={open} className="btn-primary" style={{ fontSize:14, padding:'10px 24px', minHeight:44 }}>Participar</button>
          <button onClick={() => setMobileOpen(v=>!v)} className="show-mobile" aria-label="Menu" style={{ background:'none', border:'none', color:C.white, cursor:'pointer', minWidth:46, minHeight:46, display:'none', alignItems:'center', justifyContent:'center' }}>
            <IconMenu size={22} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:99, background:'rgba(13,9,6,0.98)', backdropFilter:'blur(24px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28 }}>
          <button onClick={() => setMobileOpen(false)} style={{ position:'absolute', top:22, right:26, background:'none', border:'none', color:C.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', width:44, height:44 }}>
            <IconClose size={26} />
          </button>
          <SozoLogo size={56} />
          {navLinks.map(([l,id]) => (
            <button key={id} onClick={() => goto(id)} style={{ background:'none', border:'none', color:C.gray1, fontSize:24, fontWeight:700, cursor:'pointer', minHeight:60 }}>{l}</button>
          ))}
          <button onClick={() => { setMobileOpen(false); open() }} className="btn-primary" style={{ marginTop:8, fontSize:18, padding:'17px 44px', minHeight:60, display:'flex', alignItems:'center', gap:10 }}>
            Participar <IconArrowRight size={17} />
          </button>
        </div>
      )}

      {/* ── HERO ─────────────────────────────── */}
      <section id="hero" style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'120px 6% 80px', position:'relative', overflow:'hidden', background:C.bg }}>
        <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <div className="orb orb1" style={{ position:'absolute', borderRadius:'50%', width:750, height:750, background:'radial-gradient(circle at center, rgba(196,82,26,0.18) 0%, rgba(196,82,26,0.06) 45%, transparent 72%)', top:'-18%', right:'-8%' }} />
          <div className="orb orb2" style={{ position:'absolute', borderRadius:'50%', width:520, height:520, background:'radial-gradient(circle at center, rgba(212,168,75,0.11) 0%, rgba(212,168,75,0.03) 50%, transparent 72%)', bottom:'5%', left:'3%' }} />
          <div className="orb orb3" style={{ position:'absolute', borderRadius:'50%', width:360, height:360, background:'radial-gradient(circle at center, rgba(196,82,26,0.09) 0%, transparent 68%)', top:'38%', left:'35%' }} />
        </div>
        <div aria-hidden="true" style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize:'72px 72px', opacity:0.45, pointerEvents:'none' }} />
        <div aria-hidden="true" style={{ position:'absolute', left:'55%', top:0, bottom:0, width:1, background:`linear-gradient(to bottom, transparent, ${C.primaryD}, transparent)`, opacity:0.55, pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:9, marginBottom:20, border:`1px solid ${C.lineHi}`, padding:'8px 18px', borderRadius:4, background:'rgba(196,82,26,0.07)' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:C.primary, animation:'pulse 2s infinite', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary }}>Brasília · DF · Residencial Oeste</span>
            </div>

            {/* Banner de transmissão ao vivo */}
            <div><LiveBanner /></div>

            <div style={{ fontSize:12, fontWeight:600, color:C.gray3, letterSpacing:'3px', textTransform:'uppercase', marginBottom:12 }}>SOMOS</div>
            <h1 style={{ fontWeight:900, fontSize:'clamp(44px,7.5vw,84px)', letterSpacing:'-2.5px', lineHeight:0.92, marginBottom:30 }}>
              <span style={{ color:C.white }}>UMA IGREJA</span><br />
              <span style={{ background:`linear-gradient(135deg, ${C.primary} 0%, ${C.gold} 130%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>DE DISCÍPULOS</span>
            </h1>
            <div style={{ marginBottom:34, paddingLeft:18, borderLeft:`2px solid ${C.primaryD}` }}>
              {[['VIVER','como Jesus.'],['AMAR','como Jesus.'],['SERVIR','como Jesus.']].map(([b,r]) => (
                <div key={b} style={{ fontSize:18, marginBottom:7, color:C.gray2, fontWeight:300 }}>
                  <strong style={{ color:C.primaryL, fontWeight:800 }}>{b}</strong>, {r}
                </div>
              ))}
            </div>
            <p style={{ fontSize:17, color:C.gray2, lineHeight:1.9, marginBottom:40, maxWidth:430 }}>
              A Sozo conecta pessoas, fé e propósito. Não somos orientados por método — mas por uma Pessoa.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <BtnPrimary onClick={open}><span style={{ display:'inline-flex', alignItems:'center', gap:9 }}>Fazer parte <IconArrowRight size={16} /></span></BtnPrimary>
              <BtnGhost onClick={() => goto('#identidade')}>Conhecer a visão</BtnGhost>
            </div>
            <div style={{ marginTop:52, paddingTop:28, borderTop:`1px solid ${C.line}` }}>
              <p style={{ fontStyle:'italic', fontSize:15, color:C.gray3, lineHeight:1.85 }}>"Portanto ide, fazei discípulos de todas as nações..."</p>
              <p style={{ fontSize:11, color:C.primary, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', marginTop:9 }}>Mateus 28:19</p>
            </div>
          </div>

          <div style={{ background:`linear-gradient(150deg, ${C.bg2} 0%, ${C.bg3} 100%)`, border:`1px solid ${C.lineHi}`, borderRadius:8, padding:'46px 40px', position:'relative', overflow:'hidden', boxShadow:`0 24px 64px rgba(0,0,0,0.45)` }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${C.primary}, ${C.gold}, transparent)` }} />
            <Tag>Nossa Cultura</Tag>
            <h2 style={{ fontWeight:900, fontSize:46, color:C.white, letterSpacing:'-2px', lineHeight:0.93, marginBottom:24 }}>VIDA<br />NA VIDA</h2>
            <p style={{ fontSize:17, color:C.gray2, lineHeight:1.9, marginBottom:18 }}>Aqui não vivemos um programa.<br />Vivemos uma <strong style={{ color:C.primaryL }}>cultura.</strong></p>
            <p style={{ fontSize:17, color:C.gray2, lineHeight:1.9, marginBottom:32 }}>O discipulado acontece na vida real, em relacionamentos verdadeiros, onde cada pessoa é cuidada, acompanhada e enviada.</p>
            <div style={{ background:'rgba(196,82,26,0.09)', border:`1px solid rgba(196,82,26,0.22)`, borderRadius:6, padding:'22px 24px' }}>
              <p style={{ fontSize:17, color:C.white, fontWeight:600, lineHeight:1.7 }}>
                Porque acreditamos que transformação acontece quando{' '}
                <em style={{ color:C.primaryL, fontStyle:'normal', fontWeight:800 }}>uma vida toca outra vida.</em>
              </p>
            </div>
            <div aria-hidden="true" style={{ position:'absolute', bottom:-28, right:-14, fontSize:136, opacity:0.035, fontWeight:900, color:C.primary, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>S</div>
          </div>
        </div>
      </section>

      {/* ── 3 PILARES ────────────────────────── */}
      <section style={{ borderTop:`1px solid ${C.line}`, background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)` }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ textAlign:'center', marginBottom:60 }}>
              <Tag>Os 3 Pilares</Tag>
              <H2 center>Salvar · Curar · Libertar</H2>
              <p style={{ fontSize:17, color:C.gray2, lineHeight:1.85, maxWidth:490, margin:'0 auto' }}>Não são etapas. São dimensões simultâneas da obra de Jesus Cristo na nossa comunidade.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, background:C.line }}>
              {PILARES.map((p,i) => (
                <div key={p.word} style={{ background: i===1 ? C.surface : C.bg3, padding:'52px 36px', position:'relative', overflow:'hidden', transition:'background 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.background=C.surface)}
                  onMouseLeave={e => (e.currentTarget.style.background = i===1 ? C.surface : C.bg3)}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: i===1 ? `linear-gradient(90deg, ${C.primary}, ${C.gold})` : `linear-gradient(90deg, transparent, ${C.primaryD}, transparent)` }} />
                  <div style={{ marginBottom:18, color:C.primary }}><IconSparkle size={20} /></div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', color:C.gray3, textTransform:'uppercase', marginBottom:12 }}>{p.ref}</div>
                  <h3 style={{ fontWeight:900, fontSize:34, color:C.white, letterSpacing:'-1px', marginBottom:16 }}>{p.word}</h3>
                  <p style={{ fontSize:16, color:C.gray2, lineHeight:1.85 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── IDENTIDADE ───────────────────────── */}
      <section id="identidade" style={{ borderTop:`1px solid ${C.line}`, background:C.bg2 }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'start' }}>
              <div>
                <Tag>Quem Somos</Tag>
                <H2>Cristocêntrica.<br />Terapêutica.<br />Profética.</H2>
                <p style={{ fontSize:17, color:C.gray2, lineHeight:1.9, marginBottom:22 }}>A Sozo é edificada sobre a convicção de que o Evangelho é capaz de salvar, curar e libertar o ser humano em sua integralidade — espírito, alma e corpo.</p>
                <p style={{ fontSize:17, color:C.gray2, lineHeight:1.9 }}>Somos uma família espiritual onde o discipulado relacional não é um programa, mas um estilo de vida.</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column' }}>
                {[{ label:'Missão', text:'Discipular pessoas à maneira de Jesus, caminhando vida na vida.' },{ label:'Visão', text:'Ser uma igreja relacional, simples e acolhedora, onde ninguém caminha sozinho.' }].map(item => (
                  <div key={item.label} style={{ padding:'30px 0', borderBottom:`1px solid ${C.line}` }}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:12 }}>{item.label}</div>
                    <p style={{ fontSize:17, color:C.gray1, lineHeight:1.85 }}>{item.text}</p>
                  </div>
                ))}
                <div style={{ paddingTop:30 }}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:18 }}>Valores</div>
                  {VALORES.map(v => (
                    <div key={v} style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:11 }}>
                      <span style={{ color:C.primary, flexShrink:0, display:'inline-flex' }}><IconSparkle size={14} /></span>
                      <span style={{ fontSize:16, color:C.gray2, lineHeight:1.7 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CICLO ────────────────────────────── */}
      <section id="ciclo" style={{ borderTop:`1px solid ${C.line}`, background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)` }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ textAlign:'center', marginBottom:60 }}>
              <Tag>Ciclo Vida na Vida</Tag>
              <H2 center>Como crescemos juntos</H2>
              <p style={{ fontSize:17, color:C.gray2, lineHeight:1.85, maxWidth:450, margin:'0 auto' }}>Um ciclo contínuo e vivo — não um programa, mas uma cultura de discipulado.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2, background:C.line }}>
              {CYCLE.map((c,i) => (
                <div key={c.name} style={{ background: i%2===0 ? C.bg2 : C.bg3, padding:'42px 26px' }}>
                  <div style={{ fontWeight:900, fontSize:60, color:C.line, lineHeight:1, marginBottom:20, letterSpacing:'-3px' }}>{c.n}</div>
                  <div style={{ fontWeight:800, fontSize:12, letterSpacing:'2.5px', color:C.primary, marginBottom:9, textTransform:'uppercase' }}>{c.name}</div>
                  <div style={{ fontWeight:700, fontSize:16, color:C.white, marginBottom:12 }}>{c.sub}</div>
                  <p style={{ fontSize:15, color:C.gray2, lineHeight:1.8 }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:2, background:C.surface, padding:'34px 36px', borderTop:`2px solid ${C.primary}`, display:'flex', alignItems:'center', gap:22 }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, flexShrink:0 }}>Lembrete</span>
              <div style={{ width:1, height:26, background:C.lineHi, flexShrink:0 }} />
              <p style={{ fontSize:16, color:C.gray2, fontStyle:'italic', lineHeight:1.75 }}>"Discipulado acontece na vida, não só no culto. Todo discípulo é um futuro multiplicador."</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── ROTINA ───────────────────────────── */}
      <section id="rotina" style={{ borderTop:`1px solid ${C.line}`, background:C.bg2 }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:52, flexWrap:'wrap', gap:16 }}>
              <div><Tag>Programação</Tag><H2>Cultos da semana</H2></div>
              <a href="https://maps.app.goo.gl/3TtxPSPNVc6QDVq1A" target="_blank" rel="noreferrer" style={{ fontSize:15, color:C.primary, fontWeight:600, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
                <IconMapPin size={15} /> Ver no mapa <IconArrowRight size={14} />
              </a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { day:'TER', name:'Sala de Oração',  time:'20h00', local:'Sala de Oração — Residencial Oeste',    tag:'Intercessão', hi:false },
                { day:'DOM', name:'Culto Principal', time:'19h30', local:'Residencial Oeste 102 Conj 02 Lote 16', tag:'Presencial',  hi:true  },
              ].map(r => (
                <div key={r.day} style={{ display:'flex', alignItems:'center', padding:'32px', background: r.hi ? C.surface : C.bg3, border:`1px solid ${r.hi ? C.primaryD : C.line}`, borderRadius:6, borderLeft: r.hi ? `4px solid ${C.primary}` : `1px solid ${C.line}`, boxShadow: r.hi ? `inset 0 0 48px rgba(196,82,26,0.06)` : 'none' }}>
                  <div style={{ width:54, fontWeight:900, fontSize:12, letterSpacing:'2px', color: r.hi ? C.primary : C.gray3, flexShrink:0 }}>{r.day}</div>
                  <div style={{ width:1, height:38, background:C.lineHi, flexShrink:0, margin:'0 28px' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:19, color:C.white }}>{r.name}</div>
                    <div style={{ fontSize:15, color:C.gray2, marginTop:5 }}>{r.local}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                    <div style={{ fontSize:26, fontWeight:900, color: r.hi ? C.primaryL : C.gray1 }}>{r.time}</div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color: r.hi ? C.white : C.gray2, background: r.hi ? C.primary : C.lineHi, padding:'7px 15px', borderRadius:3 }}>{r.tag}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, padding:'32px', background:'rgba(196,82,26,0.07)', border:`1px solid ${C.lineHi}`, borderRadius:6, display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ color:C.primaryL, display:'flex', alignItems:'center' }}><IconCoffee size={32} /></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:19, color:C.white, marginBottom:7 }}>Café Conexão</div>
                <p style={{ fontSize:16, color:C.gray2, lineHeight:1.8 }}>Quer conhecer melhor a igreja, nossa história e liderança? Um ambiente leve, acolhedor, com conversa, comunhão e um café preparado pra você.</p>
              </div>
              <button onClick={open} className="btn-primary" style={{ fontSize:16, padding:'14px 28px', minHeight:52, display:'flex', alignItems:'center', gap:8 }}>Participar <IconArrowRight size={15} /></button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── EVENTOS ──────────────────────────── */}
      <section id="eventos" style={{ borderTop:`1px solid ${C.line}`, background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)` }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ marginBottom:52 }}><Tag>Agenda</Tag><H2>Próximos eventos</H2><p style={{ fontSize:17, color:C.gray2, maxWidth:490, lineHeight:1.85 }}>Momentos que constroem nossa história coletiva.</p></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:2, background:C.line }}>
              {EVENTOS.map(ev => (
                <div key={ev.title} onClick={open} role="button" tabIndex={0} onKeyDown={e => e.key==='Enter' && open()} style={{ background:C.bg2, padding:'34px 28px', cursor:'pointer', transition:'background 0.2s, transform 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.transform='translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background=C.bg2; e.currentTarget.style.transform='none' }}
                >
                  <div style={{ display:'flex', gap:16, marginBottom:22 }}>
                    <div style={{ textAlign:'center', borderRight:`1px solid ${C.lineHi}`, paddingRight:16, flexShrink:0 }}>
                      <div style={{ fontSize:34, fontWeight:900, color:C.primary, lineHeight:1 }}>{ev.day}</div>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3, marginTop:3 }}>{ev.month}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:C.gray3, textTransform:'uppercase', marginBottom:6 }}>{ev.sub}</div>
                      <div style={{ fontWeight:700, fontSize:17, color:C.white, lineHeight:1.35 }}>{ev.title}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:14, color:C.gray2, marginBottom:20, display:'flex', alignItems:'center', gap:6 }}><IconMapPin size={13} /> {ev.local} · {ev.time}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    {ev.free ? <span style={{ fontSize:11, fontWeight:700, color:C.primaryL, letterSpacing:'1px', textTransform:'uppercase', background:'rgba(196,82,26,0.1)', padding:'5px 12px', borderRadius:3 }}>Gratuito</span> : <span style={{ fontSize:11, fontWeight:700, color:C.gray2, letterSpacing:'1px', textTransform:'uppercase' }}>Inscrição</span>}
                    <span style={{ fontSize:14, color:C.primary, fontWeight:600, display:'inline-flex', alignItems:'center', gap:5 }}>Ver <IconArrowRight size={13} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── GALERIA / CARROSSEL ───────────────── */}
      <section id="galeria" style={{ borderTop:`1px solid ${C.line}`, background:C.bg2 }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:44, flexWrap:'wrap', gap:16 }}>
              <div>
                <Tag>Galeria</Tag>
                <H2>Momentos da nossa história</H2>
                <p style={{ fontSize:17, color:C.gray2, maxWidth:480, lineHeight:1.85 }}>Cultos, conferências, retiros e celebrações — cada momento guardado com gratidão.</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:C.gray3 }}>
                <span>Deslize ou clique para navegar</span>
              </div>
            </div>
            <Carousel />
          </div>
        </FadeIn>
      </section>

      {/* ── FEED ESTILO X / TWITTER ───────────── */}
      <section style={{ borderTop:`1px solid ${C.line}`, background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)` }}>
        <FadeIn>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'92px 6%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:16 }}>
              <div>
                <Tag>Comunidade</Tag>
                <H2>Vida da Sozo em tempo real</H2>
                <p style={{ fontSize:17, color:C.gray2, maxWidth:480, lineHeight:1.85 }}>Palavra, testemunhos e avisos — tudo o que está acontecendo na nossa comunidade.</p>
              </div>
              <button onClick={open} style={{ display:'flex', alignItems:'center', gap:8, background:C.primary, color:C.white, border:'none', borderRadius:5, padding:'11px 22px', fontSize:14, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Publicar na comunidade
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, alignItems:'start' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[TWEETS[0], TWEETS[3]].map(t => <TweetCard key={t.handle + t.time} t={t} onOpen={open} />)}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[TWEETS[1], TWEETS[4]].map(t => <TweetCard key={t.handle + t.time} t={t} onOpen={open} />)}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[TWEETS[2], TWEETS[5]].map(t => <TweetCard key={t.handle + t.time} t={t} onOpen={open} />)}
              </div>
            </div>
            <div style={{ marginTop:32, textAlign:'center' }}>
              <button onClick={open} className="btn-ghost" style={{ fontSize:15, padding:'13px 36px', display:'inline-flex', alignItems:'center', gap:8 }}>
                Ver toda a comunidade <IconArrowRight size={14} />
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA FINAL ────────────────────────── */}
      <section style={{ borderTop:`1px solid ${C.line}`, padding:'116px 6%', position:'relative', overflow:'hidden', background:`radial-gradient(ellipse 70% 60% at 50% 100%, rgba(196,82,26,0.13), transparent), ${C.bg}` }}>
        <div aria-hidden="true" style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize:'72px 72px', opacity:0.38, pointerEvents:'none' }} />
        <div aria-hidden="true" style={{ position:'absolute', left:'50%', bottom:0, transform:'translateX(-50%)', width:700, height:350, background:'radial-gradient(ellipse at center bottom, rgba(196,82,26,0.22) 0%, transparent 70%)', pointerEvents:'none' }} />
        <FadeIn>
          <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center', position:'relative' }}>
            <Tag>Junte-se a nós</Tag>
            <h2 style={{ fontWeight:900, fontSize:'clamp(36px,6vw,62px)', color:C.white, letterSpacing:'-2px', lineHeight:1.04, marginBottom:22 }}>Você não foi chamado para viver a fé sozinho.</h2>
            <p style={{ fontSize:18, color:C.gray2, lineHeight:1.9, marginBottom:52 }}>A Sozo é uma comunidade onde o Evangelho transforma vidas com impacto real — em cada geração, em cada relação.</p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <BtnPrimary onClick={open} style={{ padding:'18px 48px', fontSize:18, minHeight:58 }}><span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>Criar minha conta <IconArrowRight size={17} /></span></BtnPrimary>
              <BtnGhost onClick={() => goto('#identidade')} style={{ padding:'17px 46px', fontSize:18, minHeight:58 }}>Conhecer mais</BtnGhost>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer style={{ background:'#080503', borderTop:`1px solid ${C.line}`, padding:'64px 6% 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:48, marginBottom:56 }}>
            <div>
              <div style={{ marginBottom:22 }}><SozoLogo size={48} /></div>
              <p style={{ fontSize:14, color:C.gray3, lineHeight:1.9, maxWidth:260 }}>Salvar · Curar · Libertar.<br />Discipulado relacional. Vida na Vida.</p>
              <a href="https://maps.app.goo.gl/3TtxPSPNVc6QDVq1A" target="_blank" rel="noreferrer" style={{ display:'block', marginTop:16, fontSize:13, color:C.gray3, textDecoration:'none', lineHeight:1.85 }}>Residencial Oeste 102<br />Conj 02 Lote 16 · Brasília, DF</a>
              <a href="https://www.instagram.com/sozobrasilia/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center',  gap: '2px', marginTop: 10, fontSize: 13, color: C.gray3, textDecoration: 'none' }}><PiInstagramLogoFill size={24} />sozobrasilia</a>

            </div>
            {[
              { title:'Comunidade', links:['Quem Somos','Os 3 Pilares','Vida na Vida','Grupos de Conexão'] },
              { title:'Igreja',     links:['Cultos','Eventos','Galeria','Café Conexão'] },
              { title:'Plataforma', links:['Entrar','Criar conta','Painel','Suporte'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.primary, marginBottom:20 }}>{col.title}</div>
                {col.links.map(l => (
                  <button key={l} onClick={open} style={{ display:'block', fontSize:14, color:C.gray3, background:'none', border:'none', cursor:'pointer', marginBottom:13, padding:0, textAlign:'left', transition:'color 0.2s', minHeight:34 }}
                    onMouseEnter={e => (e.currentTarget.style.color=C.white)}
                    onMouseLeave={e => (e.currentTarget.style.color=C.gray3)}
                  >{l}</button>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.line}`, paddingTop:28, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p style={{ fontSize:13, color:C.gray3 }}>© 2025 Sozo Comunidade Cristã · Todos os direitos reservados</p>
            <p style={{ fontSize:13, color:C.lineHi, fontStyle:'italic' }}>Salvar · Curar · Libertar</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
