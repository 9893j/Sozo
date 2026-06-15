import { useAuth } from '@/features/auth/AuthContext'
import { Icons } from '@/components/ui/icons'
import { C } from '@/lib/tokens'

const KPIS = [
  { label:'Membros ativos',   value:'342', delta:'+8',  period:'este mês',  icon:'users',    color:C.primary },
  { label:'Eventos',          value:'6',   delta:'3',   period:'este mês',  icon:'calendar', color:'#D4A84B' },
  { label:'Cultos por semana',value:'2',   delta:'Ter', period:'e Dom',     icon:'schedule', color:'#52B788' },
  { label:'Pedidos de oração',value:'17',  delta:'4',   period:'novos hoje',icon:'prayer',   color:'#E07A8A' },
]

const QUICK = [
  { label:'Próximo evento', title:'Congresso da Juventude', sub:'07 Jun · 19h00 · Igreja Principal', href:'/admin/eventos', icon:'calendar' as const },
  { label:'Escala da semana', title:'24 confirmados · 8 pendentes', sub:'Próximo culto: Domingo 19h30', href:'/admin/escalas', icon:'schedule' as const },
  { label:'Pedidos de oração', title:'17 pedidos ativos', sub:'47 orações enviadas este mês', href:'/admin/oracao', icon:'prayer' as const },
]

export default function DashboardPage() {
  const { appUser } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const today = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontWeight:800, fontSize:'clamp(22px,3vw,28px)', color:C.white, letterSpacing:'-0.8px', marginBottom:4 }}>
          {greeting}, {appUser?.displayName?.split(' ')[0] ?? 'Pastor'}
        </h1>
        <p style={{ fontSize:13, color:C.gray3, letterSpacing:'0.1px', textTransform:'capitalize' }}>{today}</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {KPIS.map(k => {
          const IconComp = Icons[k.icon as keyof typeof Icons]
          return (
            <div key={k.label} className="kpi-card">
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:`${k.color}14`, border:`1px solid ${k.color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <IconComp size={16} color={k.color} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, color: k.color, fontWeight:600 }}>+{k.delta}</div>
                  <div style={{ fontSize:10, color:C.gray3 }}>{k.period}</div>
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:34, color:C.white, letterSpacing:'-1.5px', lineHeight:1, marginBottom:6 }}>{k.value}</div>
              <div style={{ fontSize:12, color:C.gray3, fontWeight:500 }}>{k.label}</div>
            </div>
          )
        })}
      </div>

      {/* Quick links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {QUICK.map(q => {
          const IconComp = Icons[q.icon]
          return (
            <a key={q.label} href={q.href} style={{ textDecoration:'none', display:'block' }}>
              <div className="card card-hover" style={{ cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <div style={{ width:30, height:30, borderRadius:7, background:'rgba(196,82,26,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <IconComp size={14} color={C.primary} />
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:C.gray3 }}>{q.label}</span>
                </div>
                <div style={{ fontWeight:700, fontSize:15, color:C.white, marginBottom:4, letterSpacing:'-0.3px' }}>{q.title}</div>
                <div style={{ fontSize:12, color:C.gray3 }}>{q.sub}</div>
                <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:5, fontSize:12, color:C.primary, fontWeight:600 }}>
                  Ver detalhes <Icons.chevronRight size={12} color={C.primary} />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Linha de atividade recente */}
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Icons.activity size={14} color={C.gray3} />
            <span style={{ fontSize:12, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:C.gray3 }}>Atividade recente</span>
          </div>
          <span style={{ fontSize:12, color:C.gray3 }}>Últimas 24h</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            { icon:'users' as const,   text:'João Silva cadastrado como novo membro',      time:'há 2h',  color:'#52B788' },
            { icon:'calendar' as const, text:'Evento "Vigília de Pentecostes" publicado', time:'há 4h',  color:C.primary },
            { icon:'prayer' as const,  text:'3 novos pedidos de oração registrados',       time:'há 6h',  color:'#D4A84B' },
            { icon:'posts' as const,   text:'Comunicado semanal publicado pela equipe',    time:'há 8h',  color:'#5B9EC9' },
          ].map((a, i) => {
            const IconComp = Icons[a.icon]
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom: i < 3 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <div style={{ width:28, height:28, borderRadius:7, background:`${a.color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <IconComp size={13} color={a.color} />
                </div>
                <span style={{ fontSize:13, color:C.gray2, flex:1, letterSpacing:'-0.1px' }}>{a.text}</span>
                <span style={{ fontSize:11, color:C.gray3, flexShrink:0 }}>{a.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
