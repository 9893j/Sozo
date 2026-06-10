import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { logOut } from '@/firebase/auth'

interface NavItem {
  to:       string
  icon:     string
  label:    string
  section?: string
  roles?:   string[]
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin',              icon: '▦',  label: 'Dashboard',    section: 'Visão Geral' },
  { to: '/admin/membros',      icon: '👥', label: 'Membros',      section: 'Igreja' },
  { to: '/admin/ministerios',  icon: '⛪', label: 'Ministérios' },
  { to: '/admin/escalas',      icon: '📋', label: 'Escalas' },
  { to: '/admin/eventos',      icon: '📅', label: 'Eventos' },
  { to: '/admin/oracao',       icon: '🙏', label: 'Oração',       section: 'Comunidade' },
  { to: '/admin/comunicados',  icon: '📢', label: 'Comunicados' },
  { to: '/admin/transmissao',  icon: '📡', label: 'Transmissão' },
  { to: '/admin/usuarios',     icon: '🔐', label: 'Usuários',     section: 'Administração', roles: ['pastor', 'super_admin'] },
  { to: '/admin/perfil',       icon: '👤', label: 'Meu Perfil',   section: 'Conta' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { appUser, role } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logOut()
    navigate('/')
  }

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.roles || (role && item.roles.includes(role))
  )

  return (
    <div className="flex h-screen overflow-hidden bg-stone-950">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40 h-full w-64 bg-stone-950 border-r border-stone-800
          flex flex-col overflow-y-auto transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-stone-800 flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-serif font-black text-stone-950 text-sm">
            S
          </div>
          <div>
            <div className="font-serif text-[17px] font-bold text-gold-light">Sozo</div>
            <div className="text-[10px] text-stone-500 font-sans">Painel da Igreja</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <SidebarNav items={visibleItems} onClose={() => setSidebarOpen(false)} />
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-serif font-bold text-stone-950 text-sm flex-shrink-0">
              {appUser?.displayName?.[0] ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-stone-100 truncate">{appUser?.displayName}</div>
              <div className="text-[11px] text-gold capitalize">{appUser?.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-stone-500 hover:text-rose-light transition-colors py-1"
          >
            ← Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-stone-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-stone-300 text-xl"
          >
            ☰
          </button>
          <span className="font-serif font-bold text-gold-light">Sozo</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  let lastSection = ''

  return (
    <>
      {items.map(item => {
        const showSection = item.section && item.section !== lastSection
        if (item.section) lastSection = item.section

        return (
          <div key={item.to}>
            {showSection && (
              <div className="px-4 pt-5 pb-1.5 text-[10px] font-semibold tracking-[2px] uppercase text-stone-500">
                {item.section}
              </div>
            )}
            <NavLink
              to={item.to}
              end={item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `sb-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="w-[17px] text-center text-sm flex-shrink-0">{item.icon}</span>
              {item.label}
            </NavLink>
          </div>
        )
      })}
    </>
  )
}
