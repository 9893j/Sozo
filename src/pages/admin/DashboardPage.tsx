import { useAuth } from '@/features/auth/AuthContext'

const KPI_CARDS = [
  { label: 'Membros',       value: '342',   delta: '+8 este mês',  color: 'text-gold',         emoji: '👥' },
  { label: 'Eventos',       value: '6',     delta: 'programados',   color: 'text-emerald-light', emoji: '📅' },
  { label: 'Cultos/semana', value: '4',     delta: 'Qua · Qui · Dom', color: 'text-sky-light',  emoji: '⛪' },
  { label: 'Pedidos',       value: '17',    delta: 'de oração ativos', color: 'text-rose-light', emoji: '🙏' },
]

export default function DashboardPage() {
  const { appUser } = useAuth()

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bom dia' :
    hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-white">
          {greeting}, {appUser?.displayName?.split(' ')[0] ?? 'Pastor'} 👋
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Visão geral da Igreja Sozo — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map(card => (
          <div key={card.label} className="card">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.emoji}</span>
              <span className={`text-xs font-medium ${card.color} bg-stone-800 px-2 py-0.5 rounded-full`}>
                {card.delta}
              </span>
            </div>
            <div className={`font-serif text-4xl font-bold mb-1 ${card.color}`}>{card.value}</div>
            <div className="text-sm text-stone-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <QuickCard
          title="Próximos eventos"
          subtitle="Congresso da Juventude — 07 Jun"
          cta="Ver todos"
          href="/admin/eventos"
        />
        <QuickCard
          title="Escala da semana"
          subtitle="24 confirmados · 8 pendentes"
          cta="Ver escalas"
          href="/admin/escalas"
        />
        <QuickCard
          title="Pedidos de oração"
          subtitle="17 ativos · 47 este mês"
          cta="Ver pedidos"
          href="/admin/oracao"
        />
      </div>
    </div>
  )
}

function QuickCard({ title, subtitle, cta, href }: { title: string; subtitle: string; cta: string; href: string }) {
  return (
    <div className="card hover:border-stone-700 transition-colors">
      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-sm text-stone-300 mb-4">{subtitle}</div>
      <a href={href} className="text-sm font-semibold text-gold hover:text-gold-light transition-colors">
        {cta} →
      </a>
    </div>
  )
}
