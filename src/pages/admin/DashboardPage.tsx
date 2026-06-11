import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'

const KPIS = [
  { label:'Membros',       value:'342', delta:'+8 este mês',       color:C.primary,  emoji:'👥' },
  { label:'Eventos',       value:'6',   delta:'programados',        color:C.gold,     emoji:'📅' },
  { label:'Cultos/semana', value:'2',   delta:'Ter · Dom',          color:'#52B788',  emoji:'⛪' },
  { label:'Pedidos',       value:'17',  delta:'de oração ativos',   color:'#E07A8A',  emoji:'🙏' },
]

export default function DashboardPage() {
  const { appUser } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <h1 className="page-title">{greeting}, {appUser?.displayName?.split(' ')[0] ?? 'Pastor'} 👋</h1>
        <p className="page-sub">
          {new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {KPIS.map(k => (
          <div key={k.label} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:14 }}>
              <span style={{ fontSize:22 }}>{k.emoji}</span>
              <span style={{ fontSize:11, fontWeight:700, color:k.color, background:`${k.color}18`, padding:'3px 9px', borderRadius:3, letterSpacing:'0.5px' }}>{k.delta}</span>
            </div>
            <div style={{ fontWeight:900, fontSize:40, color:k.color, letterSpacing:'-1px', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:13, color:C.gray2, marginTop:6 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[
          { title:'Próximos eventos',   sub:'Congresso da Juventude — 07 Jun', href:'/admin/eventos' },
          { title:'Escala da semana',   sub:'24 confirmados · 8 pendentes',     href:'/admin/escalas' },
          { title:'Pedidos de oração',  sub:'17 ativos · 47 este mês',          href:'/admin/oracao' },
        ].map(q => (
          <div key={q.title} className="card card-hover" style={{ cursor:'pointer' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.gray3, marginBottom:6 }}>{q.title}</div>
            <div style={{ fontSize:14, color:C.gray1, marginBottom:16 }}>{q.sub}</div>
            <a href={q.href} style={{ fontSize:13, fontWeight:600, color:C.primary, textDecoration:'none' }}>Ver detalhes →</a>
          </div>
        ))}
      </div>
    </div>
  )
}
